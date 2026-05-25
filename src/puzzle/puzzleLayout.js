import {
  generateSectionLayout,
  getSectionOverrides,
} from "./puzzleGeneration.js";

let cachedLayout = null;
let cachedOverrides = null;

export function getSectionLayout() {
  if (!cachedLayout) {
    cachedLayout = generateSectionLayout();
    cachedOverrides = null; // bust overrides whenever layout regenerates
  }
  return cachedLayout;
}

export function getOverrides(layout) {
  if (!cachedOverrides) {
    cachedOverrides = getSectionOverrides(layout);
  }
  return cachedOverrides;
}

export function resetSectionLayout() {
  cachedLayout = null;
  cachedOverrides = null;
}
