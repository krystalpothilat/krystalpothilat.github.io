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

import puzzleImg from "../imgs/puzzle-image.png";

import { getSectionLayout } from "../puzzle/puzzleLayout.js";

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

  const zoom = viewport.scale;

  // how "zoomed in" we are (0 = zoomed out, 1 = zoomed in)
  const zoomStrength = Math.min(1, Math.max(0, (zoom - 0.2) / 1.5));

  // Edge fade: fades to transparent on all 4 sides when zoomed into a section.
  // This hides neighbouring sections' pieces without hard bars or gaps.
  const baseFade = 30;
  const fade = `${baseFade + zoomStrength * 20}%`;
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
              imageUrl={puzzleImg}
            />
          ))}
        </motion.div>
      </div>

      {/* Section overlays for zoom-out view (outside the mask so they're always visible) */}
      {viewport.isZoomedOut &&
        (() => {
          const s = viewport.scale;
          const tx = viewport.translate.x;
          const ty = viewport.translate.y;

          const layout = getSectionLayout();

          return Object.values(layout).map((slot) => {
            const px = slot.col * PIECE_SIZE * s + tx;
            const py = slot.row * PIECE_SIZE * s + ty;
            const w = SECTION_COLS * PIECE_SIZE * s;
            const h = SECTION_ROWS * PIECE_SIZE * s;
            const section = SECTIONS[slot.id];
            const done = completedSections.has(slot.id);
            return (
              <div
                key={slot.id}
                onClick={() => viewport.zoomInToSection(slot.id)}
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
                    fontSize: Math.min(28, Math.max(12, w * 0.04)),
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
                  {slot.id}
                </span>
              </div>
            );
          });
        })()}

      {/* {!viewport.isZoomedOut && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            boxShadow: "inset 0 0 200px 200px rgba(0,0,0,0.75)",
          }}
        />
      )} */}
    </div>
  );
}
