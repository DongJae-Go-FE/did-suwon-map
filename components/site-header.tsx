"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

type Locale = "kr" | "en";

function getLocaleFromPathname(pathname: string): Locale | null {
  const [, first] = pathname.split("/");

  if (first === "kr" || first === "en") {
    return first;
  }

  return null;
}

function buildLocaleHref(pathname: string, targetLocale: Locale) {
  const locale = getLocaleFromPathname(pathname);

  if (!locale) {
    return `/${targetLocale}`;
  }

  return pathname.replace(`/${locale}`, `/${targetLocale}`);
}

function getSectionFromPathname(pathname: string): "home" | "region" | "sanctuary" | "info" | null {
  const segments = pathname.split("/").filter(Boolean);

  if (segments.length === 0) return null;
  if (segments.length === 1) return "home";
  if (segments[1] === "region") return "region";
  if (segments[1] === "sanctuary") return "sanctuary";
  if (segments[1] === "info") return "info";

  return null;
}

export default function SiteHeader() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const currentSection = getSectionFromPathname(pathname);

  const isLocalePage = currentLocale !== null;

  return (
    <header className="sticky top-0 z-50 border-b border-blue-100 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logo.svg"
            alt="DID MAP SUWON"
            width={120}
            height={40}
            className="h-10"
          />
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {isLocalePage ? (
            <nav
              aria-label={currentLocale === "kr" ? "주요 메뉴" : "Primary menu"}
              className="hidden items-center gap-1 rounded-full bg-blue-50 p-1 sm:flex"
            >
              <Link
                href={`/${currentLocale}`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  currentSection === "home"
                    ? "bg-white text-[#2D509F] shadow-sm"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                {currentLocale === "kr" ? "메인" : "Home"}
              </Link>
              <Link
                href={`/${currentLocale}/region`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  currentSection === "region"
                    ? "bg-white text-[#2D509F] shadow-sm"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                {currentLocale === "kr" ? "지역" : "Region"}
              </Link>
              <Link
                href={`/${currentLocale}/sanctuary`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  currentSection === "sanctuary"
                    ? "bg-white text-[#2D509F] shadow-sm"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                {currentLocale === "kr" ? "성지" : "Sanctuary"}
              </Link>
              <Link
                href={`/${currentLocale}/info`}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  currentSection === "info"
                    ? "bg-white text-[#2D509F] shadow-sm"
                    : "text-slate-700 hover:bg-white"
                }`}
              >
                {currentLocale === "kr" ? "소식" : "Info"}
              </Link>
            </nav>
          ) : null}

          <nav
            aria-label={currentLocale === "kr" ? "언어 선택" : "Language switcher"}
            className="flex items-center gap-1 rounded-full border border-blue-100 bg-white p-1"
          >
            <Link
              href={buildLocaleHref(pathname, "kr")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentLocale === "kr"
                  ? "bg-[#2D509F] text-white"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              KR
            </Link>
            <Link
              href={buildLocaleHref(pathname, "en")}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                currentLocale === "en"
                  ? "bg-[#2D509F] text-white"
                  : "text-slate-700 hover:bg-blue-50"
              }`}
            >
              EN
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
