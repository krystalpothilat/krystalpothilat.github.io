import React, { useEffect, useState } from "react";
import styles from "../../styles/DetailOverlay.module.css";

import githubLogo from "../../imgs/github_logo.jpg";
import linkedinLogo from "../../imgs/linkedin_logo.jpg";
import linkIcon from "../../imgs/link.jpg";
import fileIcon from "../../imgs/file.jpg";
import mailIcon from "../../imgs/mail.jpg";

export default function DetailOverlay({ detailsId, section, onClose }) {
  const detail = section?.details?.[detailsId];
  const isProfile = detail?.type === "profile";
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  };

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
    <div
      className={`${styles.overlay} ${isClosing ? styles.fadeOut : ""}`}
      onClick={handleClose}
    >
      <div
        className={`${styles.container} ${isClosing ? styles.zoomOut : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button onClick={handleClose} className={styles.closeButton}>
          ✕
        </button>

        {/* HEADER */}
        <div className={styles.headerRow}>
          <div>
            <h2 className={styles.headerTitle}>{detail.title}</h2>

            <div className={styles.headerCompany}>{detail.company}</div>

            <div className={styles.headerMeta}>
              <span>{detail.period}</span>
              <span>{detail.location}</span>
            </div>

            <div className={styles.headerIcons}>
              {detail.links?.github && (
                <a
                  href={detail.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={githubLogo} className={styles.icon} alt="GitHub" />
                </a>
              )}
              {detail.links?.linkedin && (
                <a
                  href={detail.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={linkedinLogo}
                    className={styles.icon}
                    alt="LinkedIn"
                  />
                </a>
              )}

              {detail.links?.link && (
                <a
                  href={detail.links.link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img
                    src={linkIcon}
                    className={styles.icon}
                    alt="Project Link"
                  />
                </a>
              )}
              {detail.links?.email && (
                <a href={`mailto:${detail.links.email}`}>
                  <img src={mailIcon} className={styles.icon} alt="Email me!" />
                </a>
              )}
              {detail.links?.resume && (
                <a
                  href={detail.links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={fileIcon} className={styles.icon} alt="Resume" />
                </a>
              )}
            </div>
          </div>

          {detail.logo && (
            <img
              src={detail.logo}
              alt="company logo"
              className={styles.companyLogo}
            />
          )}
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
                className={styles.profileImage}
              />
            )}

            <div>
              {detail.bio && <p className={styles.bio}>{detail.bio}</p>}

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
            {detail.description && (
              <div className={styles.bulletItem}>{detail.description}</div>
            )}
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
          </>
        )}
      </div>
    </div>
  );
}
