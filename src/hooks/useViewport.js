import { useState, useCallback } from "react";
import {
  SECTIONS,
  PIECE_SIZE,
  SECTION_COLS,
  SECTION_ROWS,
  NUM_SECTION_COLS,
  NUM_SECTION_ROWS,
  PUZZLE_COLS,
  PUZZLE_ROWS,
} from "../data/puzzleData.js";
import { getSectionLayout } from "../puzzle/puzzleLayout.js";

export const VIEW_STATES = { SECTION: "section", ZOOMED_OUT: "zoomed_out" };
const TARGET_FILL = 0.85;
const TARGET_ASPECT = 3 / 2;
const CW = () => (typeof window !== "undefined" ? window.innerWidth : 1200);
const CH = () => (typeof window !== "undefined" ? window.innerHeight : 700);

// The motion.div transform is:  screenPos = puzzlePos * scale + translate
// So: translate = screenPos - puzzlePos * scale
//
// To fit a section (W x H puzzle-pixels) into the screen with padding:
//   scale = min(screenW / sectionW, screenH / sectionH) * padding
//
// To center that section (whose top-left is at puzzleX, puzzleY):
//   translate.x = screenCenterX - (puzzleX + sectionW/2) * scale
//   translate.y = screenCenterY - (puzzleY + sectionH/2) * scale

const SECTION_PAD = 0.82;
const PUZZLE_PAD = 0.94;

function computeSectionView(sectionId) {
  const layout = getSectionLayout();
  const slot = layout[sectionId];
  if (!slot) return null;

  const sectionW = SECTION_COLS * PIECE_SIZE;
  const sectionH = SECTION_ROWS * PIECE_SIZE;

  const { vw, vh } = getVirtualViewport();

  const scale = Math.min(vw / sectionW, vh / sectionH) * SECTION_PAD;

  // top-left of this section in puzzle-space pixels
  const puzzleLeft = slot.col * PIECE_SIZE;
  const puzzleTop = slot.row * PIECE_SIZE;

  // center of section in puzzle-space pixels
  const puzzleCX = puzzleLeft + sectionW / 2;
  const puzzleCY = puzzleTop + sectionH / 2;

  const shiftY = 35;
  const shiftX = 20;
  const isTopRow = slot.row === 0;
  const isBottomRow = slot.row === (NUM_SECTION_ROWS - 1) * SECTION_ROWS;
  const isLeftCol = slot.col === 0;
  const isRightCol = slot.col === (NUM_SECTION_COLS - 1) * SECTION_COLS;
  const yShift = isTopRow ? shiftY : isBottomRow ? -shiftY : 0;
  const xShift = isLeftCol ? shiftX : isRightCol ? -shiftX : 0;

  return {
    scale,
    translate: {
      x: CW() / 2 - puzzleCX * scale + xShift,
      y: CH() / 2 - puzzleCY * scale + yShift,
    },
  };
}

function computePuzzleView() {
  const puzzleW = PUZZLE_COLS * PIECE_SIZE;
  const puzzleH = PUZZLE_ROWS * PIECE_SIZE;
  const { vw, vh } = getVirtualViewport();

  const scale = Math.min(vw / puzzleW, vh / puzzleH) * PUZZLE_PAD;
  return {
    scale,
    translate: {
      x: CW() / 2 - (puzzleW / 2) * scale,
      y: CH() / 2 - (puzzleH / 2) * scale,
    },
  };
}

function getVirtualViewport() {
  let vw = CW();
  let vh = CH();

  const screenAspect = vw / vh;

  if (screenAspect > TARGET_ASPECT) {
    // too wide → clamp width
    vw = vh * TARGET_ASPECT;
  } else {
    // too tall → clamp height
    vh = vw / TARGET_ASPECT;
  }

  return { vw, vh };
}

export function useViewport() {
  const [currentSection, setCurrentSection] = useState("home");
  const [viewState, setViewState] = useState(VIEW_STATES.SECTION);

  const initialView = computeSectionView("home") ?? computePuzzleView();
  const [scale, setScale] = useState(initialView.scale);
  const [translate, setTranslate] = useState(initialView.translate);

  const navigateTo = useCallback((sectionId) => {
    const view = computeSectionView(sectionId);
    if (!view) return;
    setCurrentSection(sectionId);
    setScale(view.scale);
    setTranslate(view.translate);
    setViewState(VIEW_STATES.SECTION);
  }, []);

  const zoomOut = useCallback(() => {
    const view = computePuzzleView();
    setScale(view.scale);
    setTranslate(view.translate);
    setViewState(VIEW_STATES.ZOOMED_OUT);
  }, []);

  const zoomInToSection = useCallback(
    (sectionId) => navigateTo(sectionId),
    [navigateTo],
  );

  // screen = puzzle * scale + translate
  // puzzle = (screen - translate) / scale
  const screenToPuzzle = useCallback(
    (screenX, screenY) => ({
      x: (screenX - translate.x) / scale,
      y: (screenY - translate.y) / scale,
    }),
    [scale, translate],
  );

  return {
    currentSection,
    viewState,
    scale,
    translate,
    navigateTo,
    zoomOut,
    zoomInToSection,
    screenToPuzzle,
    isZoomedOut: viewState === VIEW_STATES.ZOOMED_OUT,
  };
}
