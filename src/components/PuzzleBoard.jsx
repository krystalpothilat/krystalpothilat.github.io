import React, { useRef, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import PuzzlePiece from "./PuzzlePiece.jsx";
import {
  PIECE_SIZE,
  PUZZLE_COLS,
  PUZZLE_ROWS,
  SECTION_COLS,
  SECTION_ROWS,
  SECTIONS,
} from "../data/puzzleData.js";

const IMAGE_URL = import.meta.env.VITE_PUZZLE_IMAGE_URL || "/puzzle-image.jpg";

export default function PuzzleBoard({
  pieces,
  dragging,
  startDrag,
  moveDrag,
  endDrag,
  viewport,
  onPieceClick,
  completedSections,
}) {
  const boardRef = useRef(null);
  const screenToPuzzle = useCallback(
    (x, y) => viewport.screenToPuzzle(x, y),
    [viewport],
  );

  const onMD = useCallback(
    (id, x, y) => startDrag(id, x, y, screenToPuzzle),
    [startDrag, screenToPuzzle],
  );
  const onMM = useCallback(
    (e) => {
      if (dragging) moveDrag(e.clientX, e.clientY, screenToPuzzle);
    },
    [dragging, moveDrag, screenToPuzzle],
  );
  const onMU = useCallback(() => endDrag(), [endDrag]);
  const onTS = useCallback(
    (id, x, y) => startDrag(id, x, y, screenToPuzzle),
    [startDrag, screenToPuzzle],
  );
  const onTM = useCallback(
    (e) => {
      if (!dragging) return;
      e.preventDefault();
      moveDrag(e.touches[0].clientX, e.touches[0].clientY, screenToPuzzle);
    },
    [dragging, moveDrag, screenToPuzzle],
  );
  const onTE = useCallback(() => endDrag(), [endDrag]);

  useEffect(() => {
    window.addEventListener("mousemove", onMM);
    window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onTM, { passive: false });
    window.addEventListener("touchend", onTE);
    return () => {
      window.removeEventListener("mousemove", onMM);
      window.removeEventListener("mouseup", onMU);
      window.removeEventListener("touchmove", onTM);
      window.removeEventListener("touchend", onTE);
    };
  }, [onMM, onMU, onTM, onTE]);

  const puzzleW = PUZZLE_COLS * PIECE_SIZE;
  const puzzleH = PUZZLE_ROWS * PIECE_SIZE;

  // Edge fade: fades to transparent on all 4 sides when zoomed into a section.
  // This hides neighbouring sections' pieces without hard bars or gaps.
  const fade = "15%";
  const mask = [
    `linear-gradient(to right,  transparent 0%, black ${fade}, black ${100 - parseFloat(fade)}%, transparent 100%)`,
    `linear-gradient(to bottom, transparent 0%, black ${fade}, black ${100 - parseFloat(fade)}%, transparent 100%)`,
  ].join(", ");

  return (
    <div
      ref={boardRef}
      style={{
        position: "fixed",
        inset: 0,
        overflow: "hidden",
        background: "#0a0a0f",
        cursor: dragging ? "grabbing" : "default",
      }}
    >
      {/* Mask wrapper --> fades edges when zoomed in to hide other sections */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          WebkitMaskImage: viewport.isZoomedOut ? "none" : mask,
          WebkitMaskComposite: "destination-in",
          maskImage: viewport.isZoomedOut ? "none" : mask,
          maskComposite: "intersect",
          overflow: "hidden",
        }}
      >
        <motion.div
          animate={{
            scale: viewport.scale,
            x: viewport.translate.x,
            y: viewport.translate.y,
          }}
          transition={{
            type: "spring",
            stiffness: 200,
            damping: 30,
            mass: 0.9,
          }}
          style={{
            position: "absolute",
            transformOrigin: "0 0",
            width: puzzleW,
            height: puzzleH,
          }}
        >
          {pieces.map((piece) => (
            <PuzzlePiece
              key={piece.id}
              piece={piece}
              isDragging={dragging?.pieceId === piece.id}
              onMouseDown={onMD}
              onTouchStart={onTS}
              onPieceClick={onPieceClick}
              imageUrl={IMAGE_URL}
            />
          ))}
        </motion.div>
      </div>

      {/* Section overlays for zoom-out view (outside the mask so they're always visible) */}
      {viewport.isZoomedOut &&
        (() => {
          const s = viewport.scale;
          const tx = viewport.translate.x * s;
          const ty = viewport.translate.y * s;
          return Object.values(SECTIONS).map((section) => {
            const px = section.puzzleCol * PIECE_SIZE * s + tx;
            const py = section.puzzleRow * PIECE_SIZE * s + ty;
            const w = SECTION_COLS * PIECE_SIZE * s;
            const h = SECTION_ROWS * PIECE_SIZE * s;
            const done = completedSections.has(section.id);
            return (
              <div
                key={section.id}
                onClick={() => viewport.zoomInToSection(section.id)}
                style={{
                  position: "absolute",
                  left: px,
                  top: py,
                  width: w,
                  height: h,
                  border: `2px solid ${done ? "rgba(80,200,120,0.6)" : "rgba(255,255,255,0.15)"}`,
                  borderRadius: 4,
                  boxSizing: "border-box",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "10px 12px",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "rgba(255,255,255,0.04)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  style={{
                    fontFamily: "'Syne', sans-serif",
                    fontWeight: "800",
                    fontSize: `${Math.max(10, w * 0.075)}px`,
                    color: done
                      ? "rgba(80,200,120,0.9)"
                      : "rgba(255,255,255,0.5)",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    textShadow: "0 2px 8px rgba(0,0,0,0.9)",
                    pointerEvents: "none",
                  }}
                >
                  {done ? "✓ " : ""}
                  {section.label}
                </span>
              </div>
            );
          });
        })()}
    </div>
  );
}
