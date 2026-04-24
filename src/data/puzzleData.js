// PUZZLE CONFIG — size, boundaries

import home from "./sections/home.json";
import experience from "./sections/experience.json";
import projects from "./sections/projects.json";
import extracurriculars from "./sections/extracurriculars.json";
import puzzleZone from "./sections/puzzleZone.json";

export const PIECE_SIZE = 350;

export const NUM_SECTION_COLS = 3;
export const NUM_SECTION_ROWS = 2;

// Section size in pieces
export const SECTION_COLS = 9;
export const SECTION_ROWS = 7;

// Total puzzle size (num rows + cols)
export const PUZZLE_COLS = SECTION_COLS * NUM_SECTION_COLS;
export const PUZZLE_ROWS = SECTION_ROWS * NUM_SECTION_ROWS;

export const IMAGE_TOTAL_W = PUZZLE_COLS * PIECE_SIZE;
export const IMAGE_TOTAL_H = PUZZLE_ROWS * PIECE_SIZE;

// SECTIONS — imported JSONs

export const SECTIONS = {
  home,
  experience,
  projects,
  extracurriculars,
  puzzleZone,
};
