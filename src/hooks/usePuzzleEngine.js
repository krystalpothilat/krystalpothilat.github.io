import { useState, useCallback, useEffect } from "react";
import {
  snapToHome,
  clampToSection,
  getTotalCompletion,
} from "../puzzle/puzzleUtils.js";
import { SECTIONS, PIECE_SIZE } from "../data/puzzleData.js";
import { buildPuzzlePieces } from "../puzzle/puzzleGeneration.js";

const STORAGE_KEY = `puzzle_portfolio_state_v4_ps${PIECE_SIZE}`;

function loadSaved() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY));
  } catch {
    return null;
  }
}

// Clear any stale keys from previous PIECE_SIZE values on every load
function clearStaleStorage() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith("puzzle_portfolio_state_"))
      .forEach((k) => localStorage.removeItem(k));
  } catch {}
}

function savePieces(pieces) {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(
        pieces.map((p) => ({
          id: p.id,
          x: p.x,
          y: p.y,
          connected: p.connected,
        })),
      ),
    );
  } catch {}
}

export function usePuzzleEngine() {
  const [pieces, setPieces] = useState(() => {
    clearStaleStorage(); // ← wipe everything on every page load
    const base = buildPuzzlePieces();
    const saved = loadSaved(); // will be null since we just cleared, but kept for future
    if (saved) {
      const m = {};
      saved.forEach((s) => {
        m[s.id] = s;
      });
      return base.map((p) => {
        // Only restore position for free pieces — never override locked/connected
        if (m[p.id] && !p.locked && !p.connected) {
          return {
            ...p,
            x: m[p.id].x,
            y: m[p.id].y,
            connected: m[p.id].connected,
          };
        }
        return p;
      });
    }
    return base;
  });

  const [dragging, setDragging] = useState(null);
  // justSnapped: set to pieceId when a snap occurs, cleared after the click event fires
  const [justSnapped, setJustSnapped] = useState(null);
  const [completedSections, setCompletedSections] = useState(new Set());

  useEffect(() => {
    savePieces(pieces);
    const newCompleted = new Set();
    const m = new Map();
    pieces.forEach((p) => {
      if (p.sectionId === "__gap__") return;
      if (!m.has(p.sectionId)) m.set(p.sectionId, { total: 0, done: 0 });
      if (!p.locked) {
        m.get(p.sectionId).total++;
        if (p.connected) m.get(p.sectionId).done++;
      }
    });
    m.forEach((v, id) => {
      if (v.total > 0 && v.done === v.total) newCompleted.add(id);
    });
    setCompletedSections(newCompleted);
  }, [pieces]);

  // Clear justSnapped after one event loop tick — enough for the click to read it
  useEffect(() => {
    if (justSnapped) {
      const t = setTimeout(() => setJustSnapped(null), 300);
      return () => clearTimeout(t);
    }
  }, [justSnapped]);

  const startDrag = useCallback(
    (pieceId, clientX, clientY, screenToPuzzle) => {
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece || piece.locked || piece.connected) return;
      const wp = screenToPuzzle
        ? screenToPuzzle(clientX, clientY)
        : { x: clientX, y: clientY };
      setDragging({
        pieceId,
        offsetX: wp.x - piece.x,
        offsetY: wp.y - piece.y,
      });
    },
    [pieces],
  );

  const moveDrag = useCallback(
    (clientX, clientY, screenToPuzzle) => {
      if (!dragging) return;
      const wp = screenToPuzzle
        ? screenToPuzzle(clientX, clientY)
        : { x: clientX, y: clientY };
      setPieces((prev) =>
        prev.map((p) => {
          if (p.id !== dragging.pieceId) return p;
          return clampToSection({
            ...p,
            x: wp.x - dragging.offsetX,
            y: wp.y - dragging.offsetY,
          });
        }),
      );
    },
    [dragging],
  );

  const endDrag = useCallback(() => {
    if (!dragging) return;
    const { pieceId } = dragging;
    setDragging(null);
    setPieces((prev) =>
      prev.map((p) => {
        if (p.id !== pieceId) return p;
        const snapped = snapToHome(p);
        if (snapped.connected && !p.connected) {
          // Mark as just-snapped so the click handler ignores this event
          setJustSnapped(pieceId);
        }
        return snapped;
      }),
    );
  }, [dragging]);

  const resetPuzzle = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setPieces(buildPuzzlePieces());
  }, []);

  return {
    pieces,
    dragging,
    startDrag,
    moveDrag,
    endDrag,
    resetPuzzle,
    completedSections,
    totalCompletion: getTotalCompletion(pieces),
    justSnapped,
  };
}
