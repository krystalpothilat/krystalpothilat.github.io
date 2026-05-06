import React from "react";
import DetailOverlay from "./overlays/DetailOverlay.jsx";
import ComingSoon from "./overlays/ComingSoon.jsx";

export default function OverlayManager({ overlay, setOverlay }) {
  if (!overlay) return null;

  const close = () => setOverlay(null);

  switch (overlay.type) {
    case "DETAIL":
      return (
        <DetailOverlay
          detailsId={overlay.data.detailsId}
          section={overlay.data.section}
          onClose={close}
        />
      );

    case "COMING_SOON":
      return <ComingSoon onClose={close} />;

    default:
      return null;
  }
}
