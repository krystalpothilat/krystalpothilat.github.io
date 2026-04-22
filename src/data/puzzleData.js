// PUZZLE CONFIG — size, boundaries

import home from "./sections/home.json";
import experience from "./sections/experience.json";
import projects from "./sections/projects.json";
import extracurriculars from "./sections/extracurriculars.json";

export const PIECE_SIZE = 150;

// Section size in pieces
export const SECTION_COLS = 12;
export const SECTION_ROWS = 8;

// Total puzzle size
export const PUZZLE_COLS = SECTION_COLS * 3;
export const PUZZLE_ROWS = SECTION_ROWS * 2;

export const IMAGE_TOTAL_W = PUZZLE_COLS * PIECE_SIZE;
export const IMAGE_TOTAL_H = PUZZLE_ROWS * PIECE_SIZE;

// SECTIONS — imported JSONs

export const SECTIONS = {
  home,
  experience,
  projects,
  extracurriculars,
  fun1: {
    id: "fun1",
    label: "Puzzle Zone",
    puzzleCol: 24,
    puzzleRow: 0,
    pureFun: true,
    pieces: [],
    details: {},
  },
  fun2: {
    id: "fun2",
    label: "Puzzle Zone",
    puzzleCol: 24,
    puzzleRow: 8,
    pureFun: true,
    pieces: [],
    details: {},
  },
};
