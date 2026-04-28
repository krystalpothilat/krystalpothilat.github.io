import {
  SECTIONS,
  PIECE_SIZE,
  NUM_SECTION_COLS,
  NUM_SECTION_ROWS,
  SECTION_COLS,
  SECTION_ROWS,
  PUZZLE_COLS,
  PUZZLE_ROWS,
} from "../data/puzzleData.js";

import { getSectionLayout } from "./puzzleLayout.js";

// Flat edge rules:
// - Puzzle border = always flat
function flatRight(col) {
  return col === PUZZLE_COLS - 1;
}
function flatLeft(col) {
  return col === 0;
}
function flatBottom(row) {
  return row === PUZZLE_ROWS - 1;
}
function flatTop(row) {
  return row === 0;
}

// CREATE NUB(S) FOR PUZZLE PIECE
export function nub(side, s, T, N, H, outward) {
  const m = s / 2;
  const d = outward ? 1 : -1;
  switch (side) {
    case "top": {
      const ty = -T * d;
      return [
        `L ${m - N},0`,
        `C ${m - N},${ty * 0.45} ${m - H},${ty * 0.95} ${m},${ty}`,
        `C ${m + H},${ty * 0.95} ${m + N},${ty * 0.45} ${m + N},0`,
        `L ${s},0`,
      ].join(" ");
    }
    case "right": {
      const tx = T * d;
      return [
        `L ${s},${m - N}`,
        `C ${s + tx * 0.45},${m - N} ${s + tx * 0.95},${m - H} ${s + tx},${m}`,
        `C ${s + tx * 0.95},${m + H} ${s + tx * 0.45},${m + N} ${s},${m + N}`,
        `L ${s},${s}`,
      ].join(" ");
    }
    case "bottom": {
      const ty = T * d;
      return [
        `L ${m + N},${s}`,
        `C ${m + N},${s + ty * 0.45} ${m + H},${s + ty * 0.95} ${m},${s + ty}`,
        `C ${m - H},${s + ty * 0.95} ${m - N},${s + ty * 0.45} ${m - N},${s}`,
        `L 0,${s}`,
      ].join(" ");
    }
    case "left": {
      const tx = -T * d;
      return [
        `L 0,${m + N}`,
        `C ${tx * 0.45},${m + N} ${tx * 0.95},${m + H} ${tx},${m}`,
        `C ${tx * 0.95},${m - H} ${tx * 0.45},${m - N} 0,${m - N}`,
        `L 0,0`,
      ].join(" ");
    }
    default:
      return "";
  }
}

//generate Start/End Rows/Cols for each section
function generateSectionSlots() {
  const slots = [];

  for (let r = 0; r < NUM_SECTION_ROWS; r++) {
    for (let c = 0; c < NUM_SECTION_COLS; c++) {
      const col = c * SECTION_COLS;
      const row = r * SECTION_ROWS;

      slots.push({
        col,
        row,
        minCol: col,
        maxCol: col + SECTION_COLS - 1,
        minRow: row,
        maxRow: row + SECTION_ROWS - 1,
      });
    }
  }

  return slots;
}

export function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function clampToSection(piece) {
  const layout = getSectionLayout();
  const section = layout[piece.layoutId];

  if (!section) return piece;

  const minX = section.minCol * PIECE_SIZE;
  const maxX = section.maxCol * PIECE_SIZE;
  const minY = section.minRow * PIECE_SIZE;
  const maxY = section.maxRow * PIECE_SIZE;

  return {
    ...piece,
    x: Math.min(Math.max(piece.x, minX), maxX),
    y: Math.min(Math.max(piece.y, minY), maxY),
  };
}

export function getSnapThreshold() {
  return PIECE_SIZE * 0.4;
}

export function snapToHome(piece) {
  const dx = piece.x - piece.homeX;
  const dy = piece.y - piece.homeY;
  if (Math.sqrt(dx * dx + dy * dy) < getSnapThreshold()) {
    return { ...piece, x: piece.homeX, y: piece.homeY, connected: true };
  }
  return piece;
}

export function getTotalCompletion(pieces) {
  const free = pieces.filter((p) => !p.locked);
  if (free.length === 0) return 1;
  return free.filter((p) => p.connected).length / free.length;
}

function getPieceClipPathFromEdges(s, edges) {
  const T = s * 0.22;
  const N = s * 0.13;
  const H = s * 0.2;

  const top =
    edges.top === null ? `L ${s},0` : nub("top", s, T, N, H, edges.top);
  const right =
    edges.right === null
      ? `L ${s},${s}`
      : nub("right", s, T, N, H, edges.right);
  const bottom =
    edges.bottom === null
      ? `L 0,${s}`
      : nub("bottom", s, T, N, H, edges.bottom);
  const left =
    edges.left === null ? `L 0,0` : nub("left", s, T, N, H, edges.left);

  return `M 0,0 ${top} ${right} ${bottom} ${left} Z`;
}

function checkOverlap(x1, y1, x2, y2, size, maxOverlap = 0.75) {
  const dx = Math.max(0, size - Math.abs(x1 - x2));
  const dy = Math.max(0, size - Math.abs(y1 - y2));
  const overlapArea = dx * dy;
  return overlapArea > size * size * maxOverlap;
}
