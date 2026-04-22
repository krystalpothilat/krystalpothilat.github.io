import React, { useState, useCallback, useRef, useEffect } from "react";
import PuzzleBoard from "./components/PuzzleBoard.jsx";
import HUD from "./components/HUD.jsx";
import SectionComplete from "./components/SectionComplete.jsx";
import { usePuzzleEngine } from "./hooks/usePuzzleEngine.js";
import { useViewport } from "./hooks/useViewport.js";
import { SECTIONS } from "./data/puzzleData.js";
import "./styles/App.module.css";

// Use Vite env variable for background image
const IMAGE_URL = import.meta.env.VITE_BACKGROUND_IMAGE_URL || "/wood.jpg";

export default function App() {
  const {
    pieces,
    dragging,
    startDrag,
    moveDrag,
    endDrag,
    unlockAll,
    resetPuzzle,
    completedSections,
    totalCompletion,
    justSnapped,
  } = usePuzzleEngine();

  const viewport = useViewport();
  const [activeDetail, setActiveDetail] = useState(null);
  const [achievement, setAchievement] = useState(null);
  const prevCompleted = useRef(new Set());

  // Track newly completed sections to show achievement
  useEffect(() => {
    completedSections.forEach((id) => {
      if (!prevCompleted.current.has(id)) {
        const s = SECTIONS[id];
        if (s) setAchievement({ id, label: s.label });
      }
    });
    prevCompleted.current = new Set(completedSections);
  }, [completedSections]);

  // Handle clicking a puzzle piece
  const handlePieceClick = useCallback(
    (piece) => {
      // Block navigation if this piece JUST snapped — mouseup+click fire together
      if (justSnapped === piece.id) return;
      if (!piece.linksTo) return;

      if (piece.linksTo === "__easter_egg__") {
        unlockAll();
        viewport.zoomOut();
        return;
      }
      if (SECTIONS[piece.linksTo]) {
        viewport.navigateTo(piece.linksTo);
        return;
      }
      setActiveDetail(piece.linksTo);
    },
    [viewport, unlockAll, justSnapped],
  );

  return (
    <div
      className="app-container"
      style={{ backgroundImage: `url(${IMAGE_URL})` }}
    >
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
        onUnlockAll={unlockAll}
        onReset={resetPuzzle}
      />
      {achievement && (
        <SectionComplete
          sectionLabel={achievement.label}
          onDone={() => setAchievement(null)}
        />
      )}
    </div>
  );
}
