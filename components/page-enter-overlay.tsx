"use client";

import { type CSSProperties, useEffect, useState } from "react";

type PageEnterOverlayProps = {
  color: string;
  animationClassName: "animate-shrink-br" | "animate-shrink-tl";
};

const CARD_TRANSITION_FLAG = "did-map:card-transition";

export default function PageEnterOverlay({
  color,
  animationClassName,
}: PageEnterOverlayProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    const shouldShow = sessionStorage.getItem(CARD_TRANSITION_FLAG) === "1";

    if (shouldShow) {
      sessionStorage.removeItem(CARD_TRANSITION_FLAG);
    }

    return shouldShow;
  });

  useEffect(() => {
    if (!visible) {
      return;
    }

    const timer = window.setTimeout(() => setVisible(false), 650);
    return () => window.clearTimeout(timer);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className={`pointer-events-none fixed inset-0 z-90 ${animationClassName}`}
      style={{ backgroundColor: color } as CSSProperties}
      aria-hidden="true"
    />
  );
}
