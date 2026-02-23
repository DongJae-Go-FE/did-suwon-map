"use client";

import { useState } from "react";
import { Bell, ExternalLink, Facebook, Instagram } from "lucide-react";
import Link from "next/link";
import AnnouncementDialog from "@/components/announcement-dialog";

type InfoPageClientProps = {
  locale: string;
};

type Announcement = {
  id: number;
  title: string;
  date: string;
  preview: string;
  content?: string;
};

export default function InfoPageClient({ locale }: InfoPageClientProps) {
  const isKorean = locale === "kr";
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);

  const announcements: Announcement[] = [
    {
      id: 1,
      title: isKorean ? "2024년 성지순례 일정 안내" : "2024 Pilgrimage Schedule",
      date: "2024-03-15",
      preview: isKorean
        ? "올해 성지순례 일정이 확정되었습니다. 자세한 내용을 확인하세요."
        : "This year's pilgrimage schedule has been confirmed. Check the details.",
      content: isKorean
        ? "2024년 성지순례 일정이 확정되었습니다. 본당별 접수 일정과 준비물 안내는 추후 추가 공지될 예정입니다. 참가를 희망하시는 분들은 소속 본당 사무실로 문의해 주세요."
        : "The 2024 pilgrimage schedule has been confirmed. Parish registration dates and preparation details will be announced soon. Please contact your parish office if you wish to participate.",
    },
    {
      id: 2,
      title: isKorean ? "수원교구 새 소식" : "Suwon Diocese News",
      date: "2024-03-10",
      preview: isKorean
        ? "수원교구의 최근 소식과 행사 안내입니다."
        : "Recent news and events from Suwon Diocese.",
      content: isKorean
        ? "수원교구의 최근 행사 일정과 주요 소식을 안내드립니다. 지역별 행사 정보는 지도 화면과 함께 순차적으로 업데이트됩니다."
        : "Here are the latest events and major news from the Suwon Diocese. Region-specific event information will be updated progressively alongside the map view.",
    },
    {
      id: 3,
      title: isKorean ? "DID MAP 사용 가이드" : "DID MAP User Guide",
      date: "2024-03-05",
      preview: isKorean
        ? "DID MAP을 효과적으로 사용하는 방법을 안내합니다."
        : "Guide on how to use DID MAP effectively.",
      content: isKorean
        ? "지도에서 지역 또는 성지를 선택하면 상세 정보를 확인할 수 있으며, 모바일에서는 하단 패널로 정보가 표시됩니다. 검색과 필터 기능은 다음 업데이트에서 제공될 예정입니다."
        : "Select a region or sanctuary on the map to view details. On mobile, information appears in a bottom panel. Search and filter features will be added in a future update.",
    },
  ];

  return (
    <section
      aria-labelledby="info-page-title"
      className="flex min-h-full flex-col bg-linear-to-br from-blue-50/40 to-white px-4 pt-6 pb-10 sm:px-6 lg:h-full lg:pb-6"
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col lg:h-full">
        <header>
          <h1
            id="info-page-title"
            className="mb-6 text-center text-2xl font-bold text-slate-900 sm:text-3xl"
          >
            {isKorean ? "소식 및 정보" : "News & Info"}
          </h1>
        </header>

        <div className="grid gap-6 overflow-visible lg:flex-1 lg:grid-cols-3 lg:overflow-hidden">
          <section
            aria-labelledby="announcement-section-title"
            className="flex flex-col lg:col-span-2"
          >
            <header className="mb-3 flex items-center gap-2">
              <Bell className="h-5 w-5 text-[#2D509F]" />
              <h2
                id="announcement-section-title"
                className="text-xl font-bold text-slate-900"
              >
                {isKorean ? "공지사항" : "Announcements"}
              </h2>
            </header>
            <ul className="space-y-3 overflow-visible pr-0 lg:flex-1 lg:overflow-y-auto lg:pr-2">
              {announcements.map((announcement) => (
                <li key={announcement.id}>
                  <article
                    role="button"
                    tabIndex={0}
                    aria-label={`${announcement.title} ${isKorean ? "상세 보기" : "Open details"}`}
                    onClick={() => setSelectedAnnouncement(announcement)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        event.preventDefault();
                        setSelectedAnnouncement(announcement);
                      }
                    }}
                    className="cursor-pointer rounded-xl border border-blue-100 bg-white p-4 shadow-sm transition hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2D509F]/40"
                  >
                    <header className="mb-2 flex items-start justify-between gap-4">
                      <h3 className="text-base font-semibold text-slate-900">
                        {announcement.title}
                      </h3>
                      <time
                        dateTime={announcement.date}
                        className="shrink-0 text-xs text-slate-500"
                      >
                        {announcement.date}
                      </time>
                    </header>
                    <p className="text-sm text-slate-600">
                      {announcement.preview}
                    </p>
                    <p className="mt-2 text-sm font-medium text-[#2D509F]">
                      {isKorean ? "자세히 보기" : "Read more"} →
                    </p>
                  </article>
                </li>
              ))}
            </ul>
          </section>

          <aside
            aria-label={isKorean ? "소셜 및 외부 링크" : "Social and external links"}
            className="flex flex-col space-y-4 overflow-visible pr-0 lg:overflow-y-auto lg:pr-2"
          >
            <section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <header className="mb-3 flex items-center gap-2">
                <Instagram className="h-5 w-5 text-[#E4405F]" />
                <h3 className="text-base font-semibold text-slate-900">
                  Instagram
                </h3>
              </header>
              <p className="mb-3 text-xs text-slate-600">
                {isKorean
                  ? "수원교구의 최신 소식을 인스타그램에서 만나보세요."
                  : "Follow us on Instagram for the latest updates."}
              </p>
              <Link
                href="https://www.instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-linear-to-r from-[#f09433] via-[#e6683c] to-[#dc2743] px-3 py-1.5 text-xs font-medium text-white transition hover:opacity-90"
              >
                <Instagram className="h-3 w-3" />
                {isKorean ? "팔로우하기" : "Follow"}
                <ExternalLink className="h-3 w-3" />
              </Link>

              <div className="mt-3 grid grid-cols-3 gap-1.5">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg bg-linear-to-br from-blue-100 to-blue-50"
                  />
                ))}
              </div>
            </section>

            <section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <header className="mb-3 flex items-center gap-2">
                <Facebook className="h-5 w-5 text-[#1877F2]" />
                <h3 className="text-base font-semibold text-slate-900">
                  Facebook
                </h3>
              </header>
              <p className="mb-3 text-xs text-slate-600">
                {isKorean
                  ? "페이스북에서 더 많은 소식을 확인하세요."
                  : "Check out more updates on Facebook."}
              </p>
              <Link
                href="https://www.facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-[#1877F2] px-3 py-1.5 text-xs font-medium text-white transition hover:bg-[#166FE5]"
              >
                <Facebook className="h-3 w-3" />
                {isKorean ? "페이지 방문" : "Visit Page"}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </section>

            <section className="rounded-xl border border-blue-100 bg-white p-4 shadow-sm">
              <h3 className="mb-2 text-base font-semibold text-slate-900">
                {isKorean ? "공식 웹사이트" : "Official Website"}
              </h3>
              <p className="mb-3 text-xs text-slate-600">
                {isKorean
                  ? "천주교 수원교구 공식 웹사이트를 방문하세요."
                  : "Visit the official Suwon Diocese website."}
              </p>
              <Link
                href="https://www.casuwon.or.kr/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-blue-100 px-3 py-1.5 text-xs font-medium text-[#2D509F] transition hover:bg-blue-50"
              >
                {isKorean ? "사이트 방문" : "Visit Site"}
                <ExternalLink className="h-3 w-3" />
              </Link>
            </section>
          </aside>
        </div>
      </div>

      <AnnouncementDialog
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        isKorean={isKorean}
      />
    </section>
  );
}
