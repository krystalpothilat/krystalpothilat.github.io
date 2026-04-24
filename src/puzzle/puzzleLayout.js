import {
  generateSectionLayout,
  getSectionOverrides,
} from "./puzzleGeneration.js";

let cachedLayout = null;
let cachedOverrides = null;

export function getSectionLayout() {
  if (!cachedLayout) {
    cachedLayout = generateSectionLayout();
  }
  return cachedLayout;
}

export function getOverrides() {
  if (!cachedOverrides) {
    cachedOverrides = getSectionOverrides();
  }
  return cachedOverrides;
}

export function resetSectionLayout() {
  cachedLayout = null;
  cachedOverrides = null;
}
