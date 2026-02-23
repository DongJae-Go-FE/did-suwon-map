"use client";

import { useRouter } from "next/navigation";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

type PlaceDetailModalProps = {
  backHref: string;
  children: ReactNode;
  footer?: ReactNode;
};

export default function PlaceDetailModal({
  backHref,
  children,
  footer,
}: PlaceDetailModalProps) {
  const router = useRouter();
  const dragStartYRef = useRef<number | null>(null);
  const dragStartOffsetRef = useRef(0);
  const [isMobile, setIsMobile] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(max-width: 767px)").matches,
  );
  const [mobileSnap, setMobileSnap] = useState<"mid" | "full">("mid");
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const mobileSheetHeight = useMemo(
    () => (mobileSnap === "full" ? "92dvh" : "78dvh"),
    [mobileSnap],
  );

  const navigateAway = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(backHref);
  };

  const handleClose = () => {
    navigateAway();
  };

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (window.history.length > 1) {
          router.back();
          return;
        }

        router.push(backHref);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [backHref, router]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const onChange = (event: MediaQueryListEvent) => {
      setIsMobile(event.matches);
    };

    mediaQuery.addEventListener("change", onChange);
    return () => mediaQuery.removeEventListener("change", onChange);
  }, []);

  const handleSheetPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    dragStartYRef.current = event.clientY;
    dragStartOffsetRef.current = dragOffset;
    setIsDragging(true);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handleSheetPointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isMobile || dragStartYRef.current === null) return;

    const deltaY = event.clientY - dragStartYRef.current;
    const nextOffset = Math.max(
      -140,
      Math.min(220, dragStartOffsetRef.current + deltaY),
    );
    setDragOffset(nextOffset);
  };

  const handleSheetPointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (!isMobile || dragStartYRef.current === null) return;

    event.currentTarget.releasePointerCapture(event.pointerId);

    const finalOffset = dragOffset;
    dragStartYRef.current = null;
    dragStartOffsetRef.current = 0;
    setIsDragging(false);

    if (finalOffset > 140) {
      handleClose();
      return;
    }

    if (finalOffset > 60) {
      setMobileSnap("mid");
      setDragOffset(0);
      return;
    }

    if (finalOffset < -60) {
      setMobileSnap("full");
      setDragOffset(0);
      return;
    }

    setDragOffset(0);
  };

  return (
    <div
      className={cn(
        "fixed inset-0 z-120 flex",
        isMobile
          ? "items-end justify-stretch p-0"
          : "items-center justify-center p-4 sm:p-6",
      )}
    >
      <button
        type="button"
        aria-label="Close dialog"
        className={cn(
          "absolute inset-0 cursor-pointer bg-black/45",
          isMobile && "animate-sheet-backdrop",
        )}
        onClick={handleClose}
      />

      <div
        className={cn(
          "relative z-10 flex min-w-0 flex-col overflow-hidden border border-blue-100 bg-white shadow-2xl",
          isMobile
            ? "w-full rounded-t-2xl rounded-b-none border-b-0 animate-sheet-up"
            : "h-[86vh] w-[96vw] max-h-235 max-w-7xl rounded-2xl",
        )}
        style={
          isMobile
            ? ({
                height: mobileSheetHeight,
                transform:
                  dragOffset !== 0
                    ? `translateY(${Math.max(0, dragOffset)}px)`
                    : undefined,
                transition: !isDragging
                  ? "height 220ms ease, transform 220ms ease"
                  : "none",
                willChange: "transform,height",
              } satisfies CSSProperties)
            : undefined
        }
      >
        {isMobile ? (
          <div
            className="flex cursor-grab touch-none justify-center px-4 pt-3 pb-2 active:cursor-grabbing"
            onPointerDown={handleSheetPointerDown}
            onPointerMove={handleSheetPointerMove}
            onPointerUp={handleSheetPointerUp}
            onPointerCancel={handleSheetPointerUp}
          >
            <span className="h-1.5 w-12 rounded-full bg-blue-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]" />
          </div>
        ) : null}

        <div className="flex items-center justify-between gap-3 border-b border-blue-100 px-5 py-4 sm:px-6">
          <p className="text-sm font-semibold text-[#2D509F]">Place Detail</p>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg p-2 text-slate-600 transition-colors hover:bg-blue-50 hover:text-[#2D509F] cursor-pointer"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto p-5 sm:p-6 lg:overflow-hidden">
          <div className="h-full min-h-0">{children}</div>
        </div>
        {footer ? (
          <div className="border-t border-blue-100 px-5 py-4 sm:px-6">
            <div className={cn("flex", isMobile ? "justify-stretch" : "justify-end")}>
              <div className={isMobile ? "w-full" : undefined}>{footer}</div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
