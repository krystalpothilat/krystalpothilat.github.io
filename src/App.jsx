import React, { useState, useCallback, useRef, useEffect } from "react";
import PuzzleBoard from "./components/PuzzleBoard.jsx";
import HUD from "./components/HUD.jsx";
import SectionComplete from "./components/SectionComplete.jsx";
import { usePuzzleEngine } from "./hooks/usePuzzleEngine.js";
import { useViewport } from "./hooks/useViewport.js";
import { SECTIONS } from "./data/puzzleData.js";
import { getSectionLayout } from "./puzzle/puzzleLayout.js";
import "./styles/App.module.css";
import DetailOverlay from "./components/overlays/DetailOverlay.jsx";
import OverlayManager from "./components/OverlayManager.jsx";

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
  const [overlay, setOverlay] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const [showLabels, setShowLabels] = useState(true);

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

      // NAVIGATION FIRST
      if (piece.linksTo) {
        const layout = getSectionLayout();
        if (layout[piece.linksTo]) {
          viewport.navigateTo(piece.linksTo);
          return;
        }
      }

      // COMING SOON
      if (piece.status === "coming_soon") {
        setOverlay({
          type: "COMING_SOON",
          data: piece,
        });
        return;
      }

      // READY → DETAIL
      if (piece.status === "ready" && piece.detailsId) {
        setOverlay({
          type: "DETAIL",
          data: {
            detailsId: piece.detailsId,
            section: SECTIONS[piece.sectionId],
          },
        });
      }
    },
    [viewport],
  );

  return (
    <div className="app-container">
      <PuzzleBoard
        pieces={pieces}
        showLabels={showLabels}
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
        showLabels={showLabels}
        setShowLabels={setShowLabels}
      />
      <OverlayManager overlay={overlay} setOverlay={setOverlay} />
      {achievement && (
        <SectionComplete
          sectionLabel={achievement.label}
          onDone={() => setAchievement(null)}
        />
      )}
    </div>
  );
}
