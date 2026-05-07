import {
  SECTIONS,
  SECTION_TEMPLATES,
  PIECE_SIZE,
  NUM_SECTION_COLS,
  NUM_SECTION_ROWS,
  SECTION_COLS,
  SECTION_ROWS,
  PUZZLE_COLS,
  PUZZLE_ROWS,
} from "../data/puzzleData.js";

import {
  shuffle,
  nub,
  getPieceClipPathFromEdges,
  generateSectionSlots,
} from "./puzzleUtils.js";
import { getSectionLayout, getOverrides } from "./puzzleLayout.js";

export function generateSectionLayout() {
  const layout = {};

  const slots = generateSectionSlots();

  const sections = shuffle(Object.values(SECTIONS));

  const usedSlots = slots.slice(0, sections.length);
  const remainingSlots = slots.slice(sections.length);

  // 1. place real sections
  sections.forEach((section, i) => {
    const slot = usedSlots[i];

    layout[section.sectionId] = {
      layoutId: section.sectionId,
      sectionId: section.sectionId,
      col: slot.col,
      row: slot.row,
      minCol: slot.minCol,
      maxCol: slot.maxCol,
      minRow: slot.minRow,
      maxRow: slot.maxRow,
    };
  });

  // 2. fill remaining slots with puzzle zones
  remainingSlots.forEach((slot, i) => {
    const id = `puzzleZone_${i}`;

    layout[id] = {
      layoutId: id,
      sectionId: "puzzleZone",
      col: slot.col,
      row: slot.row,
      minCol: slot.minCol,
      maxCol: slot.maxCol,
      minRow: slot.minRow,
      maxRow: slot.maxRow,
    };
  });

  return layout;
}

export function getSectionOverrides(layout) {
  const overrides = {};
  Object.values(layout).forEach((sectionSlot) => {
    const { layoutId, sectionId } = sectionSlot;

    const overrideMap = {};

    // Build all grid positions and shuffle them so pieces are randomly
    // distributed across the full section - not just row 0.
    const allPositions = [];
    for (let r = 0; r < SECTION_ROWS; r++) {
      for (let c = 0; c < SECTION_COLS; c++) {
        allPositions.push({ r, c });
      }
    }
    const positions = shuffle(allPositions);
    let index = 0;

    positions.forEach(({ r, c }) => {
      overrideMap[`${r},${c}`] = {
        r,
        c,
        locked: Math.random() > 0.2,
      };
    });

    const section =
      Object.values(SECTIONS).find((s) => s.sectionId === sectionId) ??
      SECTION_TEMPLATES[sectionId];

    const pieces = section?.pieces || [];

    const interiorPositions = positions.filter(
      ({ r, c }) =>
        r > 0 && r < SECTION_ROWS - 1 && c > 0 && c < SECTION_COLS - 1,
    );

    const shuffledInterior = shuffle(interiorPositions);

    pieces.forEach((piece, i) => {
      const { r, c } = shuffledInterior[i];
      overrideMap[`${r},${c}`] = {
        ...overrideMap[`${r},${c}`],
        ...piece,
      };
    });
    overrides[layoutId] = overrideMap;
  });
  //   console.log(overrides);
  return overrides;
}

export function buildPuzzlePieces() {
  const pieces = [];
  const edgeMap = {}; // store edges of each piece

  const layout = getSectionLayout();
  const overrides = getOverrides(layout);

  Object.values(layout).forEach((sectionSlot) => {
    const { col: puzzleCol, row: puzzleRow, layoutId, sectionId } = sectionSlot;

    const overrideMap = overrides[layoutId] || {};

    for (let r = 0; r < SECTION_ROWS; r++) {
      for (let c = 0; c < SECTION_COLS; c++) {
        const pc = puzzleCol + c;
        const pr = puzzleRow + r;
        const override = overrideMap[`${r},${c}`] || {};

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
        const isLocked = override.locked ?? true;

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
          layoutId,
          sectionId,
          homeX,
          homeY,
          x: positionOffsetX,
          y: positionOffsetY,
          locked: isLocked,
          connected: isLocked,
          type: override.type || "plain",
          label: override.label || null,
          sublabel: override.sublabel || null,
          status: override.status || null,
          linksTo: override.linksTo || null,
          detailsId: override.detailsId || null,
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
