import React, { useEffect, useState } from "react";
import styles from "../../styles/ComingSoon.module.css";

export default function ComingSoon({ data, onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 250); // keep this short (UI feedback, not long exit)
  };

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") handleClose();
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

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

        {/* TEXT ONLY CONTENT */}
        <div className={styles.content}>
          <h2 className={styles.title}>Coming soon!</h2>
        </div>
      </div>
    </div>
  );
}
