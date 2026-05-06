import React, { useState, useCallback, useRef, useEffect } from "react";
import PuzzleBoard from "./components/PuzzleBoard.jsx";
import HUD from "./components/HUD.jsx";
import SectionComplete from "./components/SectionComplete.jsx";
import { usePuzzleEngine } from "./hooks/usePuzzleEngine.js";
import { useViewport } from "./hooks/useViewport.js";
import { SECTIONS } from "./data/puzzleData.js";
import { getSectionLayout } from "./puzzle/puzzleLayout.js";
import "./styles/App.module.css";
import DetailOverlay from "./components/DetailOverlay.jsx";

export default function App() {
  const {
    pieces,
    dragging,
    startDrag,
    moveDrag,
    endDrag,
    resetPuzzle,
    completedSections,
    totalCompletion,
    justSnapped,
  } = usePuzzleEngine();

  const viewport = useViewport();
  const [activeDetail, setActiveDetail] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const [achievement, setAchievement] = useState(null);

  const prevCompleted = useRef(new Set());

  // Track newly completed sections to show achievement
  useEffect(() => {
    const layout = getSectionLayout();

    for (const layoutId of completedSections) {
      const wasCompleted = prevCompleted.current.has(layoutId);

      if (!wasCompleted) {
        const slot = layout[layoutId];
        const section = slot ? SECTIONS[slot.layoutId] : null;

        if (section) {
          setAchievement({
            id: layoutId,
            label: section.label,
          });
        }
      }
    }

    prevCompleted.current = new Set(completedSections);
  }, [completedSections]);

  const handlePieceClick = useCallback(
    (piece) => {
      console.log("clicked piece:", piece);
      console.log("detailsId:", piece.detailsId);

      if (justSnapped === piece.id) return;

      // 1. NAVIGATION FIRST (if it exists)
      if (piece.linksTo) {
        const layout = getSectionLayout();
        if (layout[piece.linksTo]) {
          viewport.navigateTo(piece.linksTo);
          return;
        }
      }

      // 2. ONLY IF NO NAVIGATION → OPEN OVERLAY
      if (piece.detailsId) {
        setActiveDetail(piece.detailsId);
        setActiveSection(piece.sectionId);
      }
    },
    [viewport, justSnapped],
  );

  return (
    <div className="app-container">
      <PuzzleBoard
        pieces={pieces}
        dragging={dragging}
        startDrag={startDrag}
        moveDrag={moveDrag}
        endDrag={endDrag}
        viewport={viewport}
        onPieceClick={handlePieceClick}
        completedSections={completedSections}
      />
      <HUD
        currentSection={viewport.currentSection}
        isZoomedOut={viewport.isZoomedOut}
        onZoomOut={viewport.zoomOut}
        onNavigate={viewport.navigateTo}
        totalCompletion={totalCompletion}
        completedSections={completedSections}
        onReset={resetPuzzle}
      />
      {activeDetail && (
        <DetailOverlay
          detailsId={activeDetail}
          section={SECTIONS[activeSection]}
          onClose={() => {
            setActiveDetail(null);
            setActiveSection(null);
          }}
        />
      )}
      {achievement && (
        <SectionComplete
          sectionLabel={achievement.label}
          onDone={() => setAchievement(null)}
        />
      )}
    </div>
  );
}
