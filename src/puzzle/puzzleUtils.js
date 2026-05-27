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
export function generateSectionSlots() {
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

export function isImportantType(type) {
  return (
    type === "nav" ||
    type === "title" ||
    type === "section-header" ||
    type === "project" ||
    type === "job" ||
    type === "extracurricular" ||
    type === "me"
  );
}

function isConnected(piece) {
  return piece != null && (piece.locked || piece.connected);
}

// Computes which border sides each piece is responsible for drawing.
// Returns a Map of pieceId → { top, right, bottom, left } booleans.
//
// Default ownership for a locked/connected normal piece:
//   top   → always draw (unless top-neighbor is important)
//   left  → always draw (unless left-neighbor is important)
//   bottom→ only draw if bottom-neighbor is floating/absent OR at puzzle border
//   right → only draw if right-neighbor is floating/absent OR at puzzle border
//
// Overrides:
//   floating/movable piece  → draws all 4 always
//   important piece         → draws all 4 always
//   normal piece next to an important neighbor → suppress that shared side
//     (the important piece owns it with its glow border)
export function computeOwnedSides(pieces, puzzleCols, puzzleRows) {
  const grid = new Map();
  pieces.forEach((p) => grid.set(`${p.puzzleCol},${p.puzzleRow}`, p));

  const result = new Map();

  pieces.forEach((piece) => {
    const { puzzleCol: pc, puzzleRow: pr, type } = piece;

    // --- State 1: Floating/movable — always draws all 4 sides ---
    const isMovable = !piece.locked && !piece.connected;
    if (isMovable) {
      result.set(piece.id, {
        top: true,
        right: true,
        bottom: true,
        left: true,
      });
      return;
    }

    // --- State 2: Locked important — always draws all 4 sides ---
    const isImportant = isImportantType(type);
    if (isImportant) {
      result.set(piece.id, {
        top: true,
        right: true,
        bottom: true,
        left: true,
      });
      return;
    }

    // --- States 3/4/5: Locked regular piece ---
    // Look up all 4 neighbors
    const above = grid.get(`${pc},${pr - 1}`);
    const below = grid.get(`${pc},${pr + 1}`);
    const leftN = grid.get(`${pc - 1},${pr}`);
    const rightN = grid.get(`${pc + 1},${pr}`);

    const isTopBorder = pr === 0;
    const isLeftBorder = pc === 0;
    const isBottomBorder = pr === puzzleRows - 1;
    const isRightBorder = pc === puzzleCols - 1;

    // Helper: should this piece draw the side toward `neighbor`?
    // - Always draw if neighbor is important (suppress would hide the glow — important owns it, we defer)
    //   Wait, actually we SUPPRESS when neighbor is important (they draw it with glow)
    // - Always draw if no neighbor exists in the grid at all (edge piece with no puzzle neighbor)
    // - Draw if neighbor is floating/movable (they're gone, we fill the gap)
    // - State 3: puzzle border → always draw
    // - State 4: neighbor missing/floating → draw
    // - State 5: neighbor locked regular → top+left convention (don't draw bottom/right)
    const neighborDrawn = (neighbor, isThisBorder, isDefaultDraw) => {
      if (isThisBorder) return true; // State 3: puzzle border
      if (neighbor == null) return true; // no neighbor in grid at all
      if (isImportantType(neighbor.type)) return false; // important neighbor owns this edge
      if (!isConnected(neighbor)) return true; // State 4: neighbor is floating
      return isDefaultDraw; // State 5: top+left convention
    };

    result.set(piece.id, {
      top: neighborDrawn(above, isTopBorder, true), // top: default draw = true
      left: neighborDrawn(leftN, isLeftBorder, true), // left: default draw = true
      bottom: neighborDrawn(below, isBottomBorder, false), // bottom: default draw = false
      right: neighborDrawn(rightN, isRightBorder, false), // right: default draw = false
    });
  });

  return result;
}

export function getPieceClipPathFromEdges(s, edges) {
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

// Returns an open (non-closed) SVG path for a single side of a piece.
// We M to the corner that starts that side, then append the full nub segment
// (which already contains the leading flat L, the curve, and the trailing flat L).
export function getPieceSideStrokePath(s, edges, side) {
  const T = s * 0.22;
  const N = s * 0.13;
  const H = s * 0.2;

  switch (side) {
    case "top":
      return edges.top === null
        ? `M 0,0 L ${s},0`
        : `M 0,0 ` + nub("top", s, T, N, H, edges.top);

    case "right":
      return edges.right === null
        ? `M ${s},0 L ${s},${s}`
        : `M ${s},0 ` + nub("right", s, T, N, H, edges.right);

    case "bottom":
      return edges.bottom === null
        ? `M ${s},${s} L 0,${s}`
        : `M ${s},${s} ` + nub("bottom", s, T, N, H, edges.bottom);

    case "left":
      return edges.left === null
        ? `M 0,${s} L 0,0`
        : `M 0,${s} ` + nub("left", s, T, N, H, edges.left);

    default:
      return "";
  }
}
