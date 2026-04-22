import React, { useEffect } from "react";
import { DETAILS } from "../data/puzzleData.js";
import styles from "../styles/DetailOverlay.module.css";

export default function DetailOverlay({ detailId, onClose }) {
  const detail = DETAILS[detailId];

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  if (!detail) return null;

  const tagColors = [
    "#4A90E2",
    "#7B68EE",
    "#50C878",
    "#FF6B6B",
    "#FFD700",
    "#FF8C00",
    "#00CED1",
  ];

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          className={styles.closeButton}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "rgba(255,255,255,0.4)")
          }
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <div className={styles.headerMeta}>
            {detail.period}
            {detail.location ? ` · ${detail.location}` : ""}
          </div>
          <h2 className={styles.headerTitle}>{detail.title}</h2>
          <div className={styles.headerCompany}>{detail.company}</div>
        </div>

        <div className={styles.divider} />

        {/* Bullets */}
        <ul className={styles.bulletList}>
          {detail.bullets.map((b, i) => (
            <li key={i} className={styles.bulletItem}>
              <span className={styles.bulletIcon}>▸</span>
              <span>{b}</span>
            </li>
          ))}
        </ul>

        {/* Tags */}
        {detail.tags && (
          <div className={styles.tags}>
            {detail.tags.map((tag, i) => (
              <span
                key={tag}
                className={styles.tag}
                style={{
                  color: tagColors[i % 7],
                  background: `${tagColors[i % 7]}18`,
                  border: `1px solid ${tagColors[i % 7]}40`,
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Link */}
        {detail.link && (
          <a
            href={detail.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.9)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
            }
          >
            ↗ Visit link
          </a>
        )}
      </div>
    </div>
  );
}
