import React, {
  useCallback,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import { PIECE_SIZE, PUZZLE_COLS, PUZZLE_ROWS } from "../data/puzzleData.js";
import { getPieceSideStrokePath } from "../puzzle/puzzleUtils.js";

import styles from "../styles/PuzzlePiece.module.css";

function getGroup(type) {
  if (type === "nav" || type === "title" || type === "section-header") {
    return "nav";
  }

  if (type === "project" || type === "job" || type === "extracurricular") {
    return "piece";
  }

  return "plain";
}

const LABEL_COLORS = {
  nav: {
    border: "rgba(255, 215, 0, 0.9)", // warm gold
    // text: "#fdf6ea",
    // bg: "rgba(74,55,40,0.25)",
  },

  piece: {
    border: "rgba(120, 180, 255, 0.9)", // soft blue
    // text: "#fdf6ea",
    // bg: "rgba(30, 60, 120, 0.25)",
  },

  plain: { border: null, text: null, bg: null },
};

const LABEL_GLOW = {
  nav: "rgba(255, 215, 0, 0.9)", // gold
  piece: "rgba(120, 180, 255, 0.85)", // blue
  plain: "rgba(0,0,0,0)", // none
};

function getPieceRotation(id) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((hash % 9) - 4) * 1.4;
}

export default function PuzzlePiece({
  piece,
  showLabels,
  isDragging,
  onMouseDown,
  onTouchStart,
  onPieceClick,
  imageUrl,
}) {
  const S = PIECE_SIZE;
  const PAD = Math.round(S * 0.25);
  const { id, x, y, locked, connected, type, label, sublabel, clipPath } =
    piece;

  const bgX = -piece.puzzleCol * S;
  const bgY = -piece.puzzleRow * S;

  const isImportant = type !== "plain";
  const isMovable = !locked && !connected;
  const isSnapped = connected && !locked;
  const [snapLocked, setSnapLocked] = useState(false);
  const group = getGroup(type);
  const colors = LABEL_COLORS[group] || LABEL_COLORS.plain;
  const glowColor = LABEL_GLOW[group] || "rgba(255, 255, 255, 0.6)";
  const rotation = useMemo(
    () => (isMovable ? getPieceRotation(id) : 0),
    [id, isMovable],
  );

  const IMG_W = PUZZLE_COLS * S;
  const IMG_H = PUZZLE_ROWS * S;

  const startPosRef = useRef({ x: 0, y: 0 });
  const movedRef = useRef(false);

  const baseIndex = piece.puzzleRow * PUZZLE_COLS + piece.puzzleCol;

  const zIndex = isDragging
    ? 9999
    : snapLocked && isImportant
      ? 11
      : snapLocked
        ? 10
        : isMovable
          ? 500 + baseIndex
          : 10;

  // Shadow hierarchy
  // 1. Strong shadow only while dragging (lifted piece)
  // 2. No shadow when snapped (flush with board)
  // 3. Subtle shadow for movable idle pieces (light lift, not floating)
  const dropShadow = isDragging
    ? "drop-shadow(3px 5px 0px rgba(74,55,40,0.85)) drop-shadow(0 8px 20px rgba(74,55,40,0.35))"
    : isSnapped
      ? "none"
      : isMovable
        ? "drop-shadow(0 1px 2px rgba(74,55,40,0.15))"
        : "none";

  const glow = isImportant
    ? "drop-shadow(0 0 6px rgba(255, 215, 0, 0.8))"
    : "none";

  const left = locked || connected ? Math.round(x) : x;
  const top = locked || connected ? Math.round(y) : y;

  const handleMouseDown = useCallback(
    (e) => {
      e.preventDefault();

      movedRef.current = false;
      startPosRef.current = { x: e.clientX, y: e.clientY };

      const onMove = (ev) => {
        const dx = ev.clientX - startPosRef.current.x;
        const dy = ev.clientY - startPosRef.current.y;

        if (Math.hypot(dx, dy) > 5) {
          movedRef.current = true;
        }
      };

      const onUp = () => {
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };

      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);

      onMouseDown(id, e.clientX, e.clientY);
    },
    [id, onMouseDown],
  );

  const handleTouchStart = useCallback(
    (e) => {
      if (!isMovable) return;
      onTouchStart(id, e.touches[0].clientX, e.touches[0].clientY);
    },
    [isMovable, id, onTouchStart],
  );

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();

      if (isDragging || movedRef.current) return;

      if (!onPieceClick) return;

      onPieceClick(piece);
    },
    [piece, onPieceClick, isDragging],
  );

  useEffect(() => {
    if (isSnapped) {
      const t = setTimeout(() => {
        setSnapLocked(true);
      }, 250); // match your snap animation duration

      return () => clearTimeout(t);
    } else {
      setSnapLocked(false);
    }
  }, [isSnapped]);
  return (
    <div
      style={{
        position: "absolute",
        left,
        top,
        width: S,
        height: S,
        overflow: "visible",
        zIndex,
        cursor: isMovable
          ? "grab"
          : piece.linksTo || piece.detailsId
            ? "pointer"
            : "default",
        transform: isMovable
          ? `rotate(${isDragging ? 0 : rotation}deg) scale(${isDragging ? 1.05 : 1})`
          : "none",
        transformOrigin: `${S / 2}px ${S / 2}px`,
        transition: isDragging
          ? "transform 0.08s ease"
          : isSnapped
            ? "left 0.35s cubic-bezier(0.34,1.56,0.64,1), top 0.35s cubic-bezier(0.34,1.56,0.64,1), transform 0.3s ease"
            : "none",
        filter: dropShadow,
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <svg
        width={S + PAD * 2}
        height={S + PAD * 2}
        style={{
          position: "absolute",
          left: -PAD,
          top: -PAD,
          overflow: "visible",
          pointerEvents: "none",
        }}
        viewBox={`${-PAD} ${-PAD} ${S + PAD * 2} ${S + PAD * 2}`}
      >
        <defs>
          <clipPath id={`clip_${id}`}>
            <path d={clipPath} />
          </clipPath>
        </defs>

        <image
          href={imageUrl}
          x={bgX}
          y={bgY}
          width={IMG_W}
          height={IMG_H}
          clipPath={`url(#clip_${id})`}
          preserveAspectRatio="none"
        />
        {type !== "plain" && colors.bg && (
          <path d={clipPath} fill={colors.bg} clipPath={`url(#clip_${id})`} />
        )}
        {/* Phase 1: draw all 4 sides as individual strokes.
            Overlap on shared edges is expected at this stage — 
            Phase 2 will suppress sides based on neighbor state. */}
        {["top", "right", "bottom", "left"].map((side) => (
          <path
            key={side}
            d={getPieceSideStrokePath(
              S,
              piece.edges ?? {
                top: null,
                right: null,
                bottom: null,
                left: null,
              },
              side,
            )}
            fill="none"
            stroke={isMovable ? "rgba(74,55,40,0.85)" : "rgba(74,55,40,0.35)"}
            strokeWidth={isImportant ? 3 : isMovable ? 3 : 1.5}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        ))}
        {/* Subtle inner highlight - warm cream, not cold white */}
        {/* <path
          d={clipPath}
          fill="none"
          stroke="rgba(253,246,234,0.25)"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        /> */}
        {/* {type !== "plain" && colors.border && (
          <path
            d={clipPath}
            fill="none"
            stroke={colors.border}
            strokeWidth="1.5"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={isSnapped ? 0.9 : 0.5}
          />
        )} */}
      </svg>

      {showLabels && label && type !== "plain" && (
        <div className={styles.labelContainer}>
          <span
            className={styles.labelText}
            style={{
              fontSize:
                type === "title"
                  ? "30px"
                  : type === "section-header"
                    ? "30px"
                    : "28px",

              textShadow: `
      0 0 8px ${glowColor},
      0 0 18px ${glowColor},
      0 0 32px ${glowColor},
      0 0 48px ${glowColor}
    `,
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              className={styles.sublabelText}
              style={{
                textShadow: `
        0 0 6px ${glowColor},
        0 0 14px ${glowColor},
        0 0 24px ${glowColor}
      `,
              }}
            >
              {sublabel}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
