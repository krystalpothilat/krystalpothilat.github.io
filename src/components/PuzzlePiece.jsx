import React, { useCallback, useMemo } from "react";
import { PIECE_SIZE, PUZZLE_COLS, PUZZLE_ROWS } from "../data/puzzleData.js";

const LABEL_COLORS = {
  nav: {
    border: "rgba(255,255,255,0.75)",
    text: "#ffffff",
    bg: "rgba(255,255,255,0.08)",
  },
  "section-header": {
    border: "rgba(255,255,255,0.5)",
    text: "#ffffff",
    bg: "rgba(0,0,0,0.3)",
  },
  title: {
    border: "rgba(255,220,100,0.85)",
    text: "#fff8dc",
    bg: "rgba(0,0,0,0.35)",
  },
  job: {
    border: "rgba(100,180,255,0.85)",
    text: "#e8f4ff",
    bg: "rgba(20,60,160,0.45)",
  },
  activity: {
    border: "rgba(100,255,160,0.85)",
    text: "#e8fff2",
    bg: "rgba(10,100,50,0.45)",
  },
  project: {
    border: "rgba(220,150,255,0.85)",
    text: "#f5e8ff",
    bg: "rgba(100,20,160,0.45)",
  },
  plain: { border: null, text: null, bg: null },
};

function getPieceRotation(id) {
  const hash = id.split("").reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return ((hash % 9) - 4) * 1.4;
}

export default function PuzzlePiece({
  piece,
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

  const isMovable = !locked && !connected;
  const isSnapped = connected && !locked;
  const colors = LABEL_COLORS[type] || LABEL_COLORS.plain;
  const rotation = useMemo(
    () => (isMovable ? getPieceRotation(id) : 0),
    [id, isMovable],
  );

  const IMG_W = PUZZLE_COLS * S;
  const IMG_H = PUZZLE_ROWS * S;

  const handleMouseDown = useCallback(
    (e) => {
      if (!isMovable) return;
      e.preventDefault();
      onMouseDown(id, e.clientX, e.clientY);
    },
    [isMovable, id, onMouseDown],
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
      if (piece.linksTo && onPieceClick) {
        e.stopPropagation();
        onPieceClick(piece);
      }
    },
    [piece, onPieceClick],
  );

  const zIndex = isDragging
    ? 9999
    : isMovable
      ? 500 + piece.puzzleCol + piece.puzzleRow
      : piece.puzzleCol + piece.puzzleRow;

  const dropShadow = isDragging
    ? "drop-shadow(0 12px 30px rgba(0,0,0,0.95))"
    : isSnapped
      ? `drop-shadow(0 0 10px ${colors.border?.replace(/[\d.]+\)$/, "0.4)") || "rgba(255,255,255,0.3)"})`
      : isMovable
        ? "drop-shadow(0 5px 16px rgba(0,0,0,0.85))"
        : "none";

  const left = locked || connected ? Math.round(x) : x;
  const top = locked || connected ? Math.round(y) : y;

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
        cursor: isMovable ? "grab" : piece.linksTo ? "pointer" : "default",
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
          <linearGradient id={`sheen_${id}`} x1="0%" y1="0%" x2="70%" y2="70%">
            <stop offset="0%" stopColor="white" stopOpacity="0.15" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </linearGradient>
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
        <path
          d={clipPath}
          fill={`url(#sheen_${id})`}
          clipPath={`url(#clip_${id})`}
        />
        <path
          d={clipPath}
          fill="none"
          stroke={
            isMovable ? "rgba(255,255,230,0.8)" : "rgba(255,255,255,0.18)"
          }
          strokeWidth={isMovable ? 2.5 : 1.2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {type !== "plain" && colors.border && (
          <path
            d={clipPath}
            fill="none"
            stroke={colors.border}
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            opacity={isSnapped ? 1 : 0.55}
          />
        )}
      </svg>

      {label && type !== "plain" && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
            textAlign: "center",
            pointerEvents: "none",
            background:
              "radial-gradient(ellipse at center, rgba(0,0,0,0.55) 20%, transparent 78%)",
          }}
        >
          <span
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize:
                type === "title"
                  ? "16px"
                  : type === "section-header"
                    ? "14px"
                    : "13px",
              fontWeight: 800,
              color: colors.text || "#fff",
              textShadow: "0 1px 10px rgba(0,0,0,1)",
              lineHeight: 1.2,
              letterSpacing: "0.03em",
            }}
          >
            {label}
          </span>
          {sublabel && (
            <span
              style={{
                fontFamily: "'DM Mono', monospace",
                fontSize: 10,
                color: "rgba(255,255,255,0.75)",
                textShadow: "0 1px 6px rgba(0,0,0,1)",
                marginTop: 4,
                letterSpacing: "0.06em",
              }}
            >
              {sublabel}
            </span>
          )}
          {piece.linksTo && (
            <span
              style={{
                fontSize: 9,
                marginTop: 5,
                color: colors.border || "rgba(255,255,255,0.5)",
                fontFamily: "'DM Mono', monospace",
                letterSpacing: "0.1em",
              }}
            >
              ▶ open
            </span>
          )}
        </div>
      )}
    </div>
  );
}
