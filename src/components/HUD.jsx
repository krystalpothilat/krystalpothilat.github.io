import React, { useState } from "react";
import { SECTIONS } from "../data/puzzleData.js";
import styles from "../styles/HUD.module.css";

export default function HUD({
  currentSection,
  isZoomedOut,
  onZoomOut,
  onNavigate,
  totalCompletion,
  completedSections,
  onUnlockAll,
  onReset,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const section = SECTIONS[currentSection];
  const pct = Math.round(totalCompletion * 100);

  return (
    <>
      <div className={styles.topBar}>
        <div className={styles.sectionName}>
          {isZoomedOut ? "Puzzle View" : section?.label || ""}
        </div>

        <div className={styles.controls}>
          <div
            className={styles.completionPill}
            style={{
              color:
                pct === 100 ? "rgba(80,200,120,0.9)" : "rgba(255,255,255,0.4)",
              border: `1px solid ${pct === 100 ? "rgba(80,200,120,0.4)" : "rgba(255,255,255,0.1)"}`,
            }}
          >
            {pct === 100 ? "🧩 Complete!" : `${pct}% solved`}
          </div>

          <button
            onClick={isZoomedOut ? () => onNavigate(currentSection) : onZoomOut}
            className={styles.zoomButton}
            title={isZoomedOut ? "Zoom back in" : "See full puzzle"}
          >
            {isZoomedOut ? "⊙ Zoom In" : "⊕ Full Puzzle"}
          </button>

          <button
            onClick={onReset}
            className={`${styles.resetButton}`}
            title="Reset — positionOffset all pieces back"
          >
            ↺ Reset
          </button>

          <div className={styles.menuContainer}>
            <button
              onClick={() => setShowMenu((v) => !v)}
              className={styles.menuButton}
            >
              ⋯
            </button>
            {showMenu && (
              <div className={styles.menuDropdown}>
                <MenuSection label="Navigate">
                  {Object.values(SECTIONS)
                    .filter((s) => !s.pureFun)
                    .map((s) => (
                      <MenuItem
                        key={s.id}
                        label={s.label}
                        done={completedSections.has(s.id)}
                        onClick={() => {
                          onNavigate(s.id);
                          setShowMenu(false);
                        }}
                      />
                    ))}
                </MenuSection>
                <div
                  style={{
                    height: 1,
                    background: "rgba(255,255,255,0.08)",
                    margin: "4px 0",
                  }}
                />
                <MenuSection label="Puzzle">
                  <MenuItem
                    label="🔓 Unlock all pieces"
                    onClick={() => {
                      onUnlockAll();
                      setShowMenu(false);
                    }}
                  />
                  <MenuItem
                    label="↺ Reset puzzle"
                    onClick={() => {
                      onReset();
                      setShowMenu(false);
                    }}
                    danger
                  />
                </MenuSection>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div
          className={styles.bottomBarFill}
          style={{
            width: `${pct}%`,
            background:
              pct === 100
                ? "linear-gradient(90deg, #50C878, #00CED1)"
                : "linear-gradient(90deg, #4A90E2, #7B68EE)",
          }}
        />
      </div>

      <div className={styles.tooltip}>
        {isZoomedOut
          ? "click a section to zoom in"
          : "drag ● pieces to solve · click tiles to explore"}
      </div>
    </>
  );
}

function MenuSection({ label, children }) {
  return (
    <div className={styles.menuSection}>
      <div className={styles.menuSectionLabel}>{label}</div>
      {children}
    </div>
  );
}

function MenuItem({ label, onClick, done, danger }) {
  const classNames = [styles.menuItem];
  if (done) classNames.push(styles.done);
  if (danger) classNames.push(styles.danger);

  return (
    <button
      onClick={onClick}
      className={classNames.join(" ")}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
      }
      onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
    >
      {done && <span style={{ fontSize: 10 }}>✓</span>}
      {label}
    </button>
  );
}
