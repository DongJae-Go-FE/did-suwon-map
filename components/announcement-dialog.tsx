"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

type Announcement = {
  id: number;
  title: string;
  date: string;
  preview: string;
  content?: string;
};

type AnnouncementDialogProps = {
  announcement: Announcement | null;
  onClose: () => void;
  isKorean: boolean;
};

export default function AnnouncementDialog({
  announcement,
  onClose,
  isKorean,
}: AnnouncementDialogProps) {
  useEffect(() => {
    if (announcement) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [announcement]);

  useEffect(() => {
    if (!announcement) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [announcement, onClose]);

  if (!announcement) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={isKorean ? "공지사항 상세" : "Announcement detail"}
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-blue-100 bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 flex items-start justify-between border-b border-blue-100 bg-white p-6">
          <div className="flex-1 pr-8">
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {announcement.title}
            </h2>
            <p className="mt-2 text-sm text-slate-500">{announcement.date}</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
            aria-label={isKorean ? "닫기" : "Close"}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="prose prose-slate max-w-none">
            <p className="text-slate-700 leading-relaxed">
              {announcement.content || announcement.preview}
            </p>

            {!announcement.content && (
              <div className="mt-6 rounded-lg bg-blue-50 p-4 text-sm text-slate-600">
                {isKorean
                  ? "상세 내용이 준비 중입니다."
                  : "Detailed content is being prepared."}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
