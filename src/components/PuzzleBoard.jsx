import React, {
  useRef,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { motion } from "framer-motion";
import PuzzlePiece from "./PuzzlePiece.jsx";
import { getSectionLayout } from "../puzzle/puzzleLayout.js";
import { computeOwnedSides } from "../puzzle/puzzleUtils.js";
import { imgs } from "../assets";
import styles from "../styles/PuzzleBoard.module.css";
import {
  PIECE_SIZE,
  PUZZLE_COLS,
  PUZZLE_ROWS,
  SECTION_COLS,
  SECTION_ROWS,
  SECTIONS,
  SECTION_TEMPLATES,
} from "../data/puzzleData.js";

export default function PuzzleBoard({
  pieces,
  showLabels,
  dragging,
  startDrag,
  moveDrag,
  endDrag,
  viewport,
  onPieceClick,
  completedSections,
}) {
  const boardRef = useRef(null);
  const [focusedPieceId, setFocusedPieceId] = useState(null);

  const ownedSidesMap = useMemo(
    () => computeOwnedSides(pieces, PUZZLE_COLS, PUZZLE_ROWS),
    [pieces],
  );
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
      className={styles.board}
      style={{
        cursor: dragging ? "grabbing" : "default",
        backgroundImage: `url(${imgs.wood})`,
      }}
    >
      {/* Mask wrapper --> fades edges when zoomed in to hide other sections */}
      <div className={styles.maskWrapper}>
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
          className={styles.puzzleCanvas}
          style={{
            width: puzzleW,
            height: puzzleH,
          }}
        >
          {pieces.map((piece) => {
            const ownedSides = ownedSidesMap.get(piece.id) ?? {
              top: true,
              right: true,
              bottom: true,
              left: true,
            };

            // DEBUG
            if (
              piece.type !== "plain" &&
              (!ownedSides.bottom || !ownedSides.right)
            ) {
              console.log(
                "MISSING SIDE",
                piece.id,
                piece.type,
                piece.locked,
                piece.connected,
                ownedSides,
              );
            }
            if (piece.type !== "plain" && !piece.edges) {
              console.log("NO EDGES", piece.id, piece.type);
            }

            return (
              <PuzzlePiece
                key={piece.id}
                piece={piece}
                currentSection={viewport.currentSection}
                setFocusedPieceId={setFocusedPieceId}
                focusedPieceId={focusedPieceId}
                isZoomedOut={viewport.isZoomedOut}
                showLabels={showLabels}
                isDragging={dragging?.pieceId === piece.id}
                onMouseDown={onMD}
                onTouchStart={onTS}
                onPieceClick={onPieceClick}
                imageUrl={imgs.puzzleImage}
                ownedSides={ownedSides}
              />
            );
          })}
        </motion.div>
      </div>

      {/* Section overlays for zoom-out view (outside the mask so they're always visible) */}
      {viewport.isZoomedOut &&
        showLabels &&
        (() => {
          const s = viewport.scale;
          const tx = viewport.translate.x;
          const ty = viewport.translate.y;

          const layout = getSectionLayout();

          return Object.values(layout).map((slot) => {
            const section =
              Object.values(SECTIONS).find(
                (s) => s.sectionId === slot.sectionId,
              ) ?? SECTION_TEMPLATES[slot.sectionId];

            const label = section?.label ?? slot.sectionId;

            const px = slot.col * PIECE_SIZE * s + tx;
            const py = slot.row * PIECE_SIZE * s + ty;
            const w = SECTION_COLS * PIECE_SIZE * s;
            const h = SECTION_ROWS * PIECE_SIZE * s;
            // const section = SECTIONS[slot.sectionId];
            const done = completedSections.has(slot.layoutId);
            return (
              <div
                key={slot.layoutId}
                onClick={() => viewport.zoomInToSection(slot.layoutId)}
                className={styles.sectionOverlay}
                style={{
                  left: px,
                  top: py,
                  width: w,
                  height: h,
                  border: `2px solid ${done ? "rgba(90,138,90,0.7)" : "rgba(74,55,40,0.3)"}`,
                }}
              >
                <span
                  className={styles.sectionLabel}
                  style={{
                    fontSize: 20,
                    color: done ? "rgba(90,138,90,0.9)" : "rgba(74,55,40,0.6)",
                  }}
                >
                  {done ? "✓ " : ""}
                  {label}
                </span>
              </div>
            );
          });
        })()}
    </div>
  );
}
