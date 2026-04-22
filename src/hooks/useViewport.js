import { useState, useCallback } from "react";
import {
  SECTIONS,
  PIECE_SIZE,
  SECTION_COLS,
  SECTION_ROWS,
  PUZZLE_COLS,
  PUZZLE_ROWS,
} from "../data/puzzleData.js";

export const VIEW_STATES = { SECTION: "section", ZOOMED_OUT: "zoomed_out" };

const CW = () => (typeof window !== "undefined" ? window.innerWidth : 1200);
const CH = () => (typeof window !== "undefined" ? window.innerHeight : 700);

// Scale so the section viewport fills ~88% of the screen
function sectionScale() {
  const sw = CW() / (SECTION_COLS * PIECE_SIZE);
  const sh = CH() / (SECTION_ROWS * PIECE_SIZE);
  return Math.min(sw, sh) * 0.9;
}

// Scale so the WHOLE puzzle fits on screen with padding
function puzzleScale() {
  const sw = CW() / (PUZZLE_COLS * PIECE_SIZE);
  const sh = CH() / (PUZZLE_ROWS * PIECE_SIZE);
  return Math.min(sw, sh) * 0.88;
}

// Translate so the given section is centered
function sectionTranslate(sectionId, scale) {
  const section = SECTIONS[sectionId];
  if (!section) return { x: 0, y: 0 };
  const centerX =
    section.puzzleCol * PIECE_SIZE + (SECTION_COLS * PIECE_SIZE) / 2;
  const centerY =
    section.puzzleRow * PIECE_SIZE + (SECTION_ROWS * PIECE_SIZE) / 2;
  return {
    x: CW() / 2 - centerX * scale, // screen space: no division
    y: CH() / 2 - centerY * scale,
  };
}

function puzzleTranslate(scale) {
  return {
    x: CW() / 2 - ((PUZZLE_COLS * PIECE_SIZE) / 2) * scale,
    y: CH() / 2 - ((PUZZLE_ROWS * PIECE_SIZE) / 2) * scale,
  };
}

export function useViewport() {
  const [currentSection, setCurrentSection] = useState("home");
  const [viewState, setViewState] = useState(VIEW_STATES.SECTION);
  const [scale, setScale] = useState(() => sectionScale());
  const [translate, setTranslate] = useState(() =>
    sectionTranslate("home", sectionScale()),
  );

  const navigateTo = useCallback((sectionId) => {
    if (!SECTIONS[sectionId]) return;
    const s = sectionScale();
    setCurrentSection(sectionId);
    setScale(s);
    setTranslate(sectionTranslate(sectionId, s));
    setViewState(VIEW_STATES.SECTION);
  }, []);

  const zoomOut = useCallback(() => {
    const s = puzzleScale();
    setScale(s);
    setTranslate(puzzleTranslate(s));
    setViewState(VIEW_STATES.ZOOMED_OUT);
  }, []);

  const zoomInToSection = useCallback(
    (sectionId) => {
      navigateTo(sectionId);
    },
    [navigateTo],
  );

  // Screen → puzzle coordinate conversion (for drag)
  const screenToPuzzle = useCallback(
    (screenX, screenY) => ({
      x: screenX / scale - translate.x,
      y: screenY / scale - translate.y,
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
