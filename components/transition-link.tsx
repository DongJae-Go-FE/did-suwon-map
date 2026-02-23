"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type CSSProperties,
  type MouseEvent,
  type PropsWithChildren,
  useState,
} from "react";

type TransitionLinkProps = PropsWithChildren<{
  href: string;
  className?: string;
  transitionColor: string;
}>;

type OverlayState = {
  color: string;
  originX: number;
  originY: number;
  href: string;
} | null;

const CARD_TRANSITION_FLAG = "did-map:card-transition";

export default function TransitionLink({
  href,
  className,
  transitionColor,
  children,
}: TransitionLinkProps) {
  const router = useRouter();
  const [overlay, setOverlay] = useState<OverlayState>(null);

  const navigateWithTransition = (nextHref: string) => {
    if (typeof document !== "undefined" && document.startViewTransition) {
      document.startViewTransition(() => {
        router.push(nextHref);
      });
      return;
    }

    router.push(nextHref);
  };

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (
      e.defaultPrevented ||
      e.button !== 0 ||
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey
    ) {
      return;
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reducedMotion) {
      e.preventDefault();
      navigateWithTransition(href);
      return;
    }

    e.preventDefault();

    const rect = e.currentTarget.getBoundingClientRect();
    const originX = ((rect.left + rect.width / 2) / window.innerWidth) * 100;
    const originY = ((rect.top + rect.height / 2) / window.innerHeight) * 100;

    setOverlay({
      color: transitionColor,
      originX,
      originY,
      href,
    });
  };

  return (
    <>
      <Link href={href} className={className} onClick={handleClick}>
        {children}
      </Link>
      {overlay ? (
        <div
          className="pointer-events-none fixed inset-0 z-100 animate-expand-full"
          onAnimationEnd={() => {
            sessionStorage.setItem(CARD_TRANSITION_FLAG, "1");
            navigateWithTransition(overlay.href);
          }}
          style={
            {
              backgroundColor: overlay.color,
              "--origin-x": `${overlay.originX}%`,
              "--origin-y": `${overlay.originY}%`,
              willChange: "clip-path",
            } as CSSProperties
          }
          aria-hidden="true"
        />
      ) : null}
    </>
  );
}
