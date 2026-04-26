import React, { useEffect } from "react";
import styles from "../styles/DetailOverlay.module.css";

export default function DetailOverlay({ detailsId, section, onClose }) {
  const detail = section?.details?.[detailsId];
  const isProfile = detail?.type === "profile";

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

        {/* HEADER (shared) */}
        <div style={{ marginBottom: "24px" }}>
          <div className={styles.headerMeta}>
            {detail.period}
            {detail.location ? ` · ${detail.location}` : ""}
          </div>

          <h2 className={styles.headerTitle}>{detail.title}</h2>

          <div className={styles.headerCompany}>{detail.company}</div>
        </div>

        <div className={styles.divider} />

        {/* PROFILE MODE */}
        {isProfile ? (
          <div
            style={{ display: "flex", gap: "18px", alignItems: "flex-start" }}
          >
            {detail.image && (
              <img
                src={detail.image}
                alt="profile"
                style={{
                  width: 110,
                  height: 110,
                  borderRadius: "16px",
                  objectFit: "cover",
                  border: "1px solid rgba(255,255,255,0.15)",
                }}
              />
            )}

            <div>
              {detail.bio && (
                <p style={{ color: "rgba(255,255,255,0.8)", lineHeight: 1.5 }}>
                  {detail.bio}
                </p>
              )}

              {detail.highlights && (
                <ul className={styles.bulletList}>
                  {detail.highlights.map((h, i) => (
                    <li key={i} className={styles.bulletItem}>
                      <span className={styles.bulletIcon}>▸</span>
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        ) : (
          /* NORMAL WORK MODE */
          <>
            <ul className={styles.bulletList}>
              {detail.bullets?.map((b, i) => (
                <li key={i} className={styles.bulletItem}>
                  <span className={styles.bulletIcon}>▸</span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

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

            {detail.link && (
              <a
                href={detail.link}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.link}
              >
                ↗ Visit link
              </a>
            )}
          </>
        )}
      </div>
    </div>
  );
}
