import {
  SECTIONS,
  PIECE_SIZE,
  SECTION_COLS,
  SECTION_ROWS,
  PUZZLE_COLS,
  PUZZLE_ROWS,
} from "../data/puzzleData.js";

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
function nub(side, s, T, N, H, outward) {
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

export function buildPuzzlePieces() {
  const pieces = [];
  const edgeMap = {}; // store edges of each piece

  const orderedSections = Object.values(SECTIONS).sort((a, b) => {
    if (a.puzzleRow !== b.puzzleRow) return a.puzzleRow - b.puzzleRow;
    return a.puzzleCol - b.puzzleCol;
  });

  orderedSections.forEach((section) => {
    const { puzzleCol, puzzleRow, pureFun } = section;
    const overrideMap = {};
    (section.pieces || []).forEach((p) => {
      overrideMap[`${p.localCol},${p.localRow}`] = p;
    });

    for (let r = 0; r < SECTION_ROWS; r++) {
      for (let c = 0; c < SECTION_COLS; c++) {
        const pc = puzzleCol + c;
        const pr = puzzleRow + r;
        const override = overrideMap[`${c},${r}`] || {};

        // Determine edges
        const isTopBorder = pr === 0;
        const isLeftBorder = pc === 0;
        const isRightBorder = pc === PUZZLE_COLS - 1;
        const isBottomBorder = pr === PUZZLE_ROWS - 1;

        // TOP (depends on above)
        const above = edgeMap[`${pc},${pr - 1}`];

        const topEdge = isTopBorder
          ? null
          : above?.bottom == null
            ? null
            : !above.bottom;

        // LEFT (depends on left)
        const leftEdge = isLeftBorder
          ? null
          : edgeMap[`${pc - 1},${pr}`]?.right == null
            ? null
            : !edgeMap[`${pc - 1},${pr}`].right;

        // RIGHT (only decided here)
        const rightEdge = isRightBorder ? null : Math.random() < 0.5;

        // BOTTOM (only decided here)
        const bottomEdge = isBottomBorder ? null : Math.random() < 0.5;

        edgeMap[`${pc},${pr}`] = {
          top: topEdge,
          left: leftEdge,
          right: rightEdge,
          bottom: bottomEdge,
        };

        const homeX = pc * PIECE_SIZE;
        const homeY = pr * PIECE_SIZE;
        const isLocked = pureFun
          ? true
          : override.locked !== undefined
            ? override.locked
            : true;

        // positionOffset
        const margin = PIECE_SIZE * 0.6;
        const minX = puzzleCol * PIECE_SIZE + margin;
        const maxX = (puzzleCol + SECTION_COLS - 1) * PIECE_SIZE - margin;
        const minY = puzzleRow * PIECE_SIZE + margin;
        const maxY = (puzzleRow + SECTION_ROWS - 1) * PIECE_SIZE - margin;

        const maxOffset = PIECE_SIZE * 4;
        const positionOffsetX = isLocked
          ? homeX
          : Math.min(
              maxX,
              Math.max(minX, homeX + (Math.random() - 0.5) * maxOffset),
            );
        const positionOffsetY = isLocked
          ? homeY
          : Math.min(
              maxY,
              Math.max(minY, homeY + (Math.random() - 0.5) * maxOffset),
            );

        pieces.push({
          id: `piece_${pc}_${pr}`,
          puzzleCol: pc,
          puzzleRow: pr,
          sectionId: section.id,
          homeX,
          homeY,
          x: positionOffsetX,
          y: positionOffsetY,
          locked: isLocked,
          connected: isLocked,
          type: pureFun ? "plain" : override.type || "plain",
          label: pureFun ? null : override.label,
          sublabel: pureFun ? null : override.sublabel,
          linksTo: pureFun ? null : override.linksTo,
          clipPath: getPieceClipPathFromEdges(
            PIECE_SIZE,
            edgeMap[`${pc},${pr}`],
          ),
        });
      }
    }
  });

  return pieces;
}

export function clampToSection(piece, SECTIONS) {
  const section = SECTIONS[piece.sectionId];
  if (!section) return piece; // fallback if no section

  const minX = section.puzzleCol * PIECE_SIZE;
  const minY = section.puzzleRow * PIECE_SIZE;
  const maxX = minX + SECTION_COLS * PIECE_SIZE - PIECE_SIZE;
  const maxY = minY + SECTION_ROWS * PIECE_SIZE - PIECE_SIZE;

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
