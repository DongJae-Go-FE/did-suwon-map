"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MapPin, Church, Bell } from "lucide-react";

type Locale = "kr" | "en";

function getLocaleFromPathname(pathname: string): Locale | null {
  const [, first] = pathname.split("/");

  if (first === "kr" || first === "en") {
    return first;
  }

  return null;
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

export default function MobileBottomNav() {
  const pathname = usePathname();
  const currentLocale = getLocaleFromPathname(pathname);
  const currentSection = getSectionFromPathname(pathname);

  const isLocalePage = currentLocale !== null;

  if (!isLocalePage) return null;

  const navItems = [
    {
      section: "home",
      href: `/${currentLocale}`,
      icon: Home,
      labelKr: "메인",
      labelEn: "Home",
    },
    {
      section: "region",
      href: `/${currentLocale}/region`,
      icon: MapPin,
      labelKr: "지역",
      labelEn: "Region",
    },
    {
      section: "sanctuary",
      href: `/${currentLocale}/sanctuary`,
      icon: Church,
      labelKr: "성지",
      labelEn: "Sanctuary",
    },
    {
      section: "info",
      href: `/${currentLocale}/info`,
      icon: Bell,
      labelKr: "소식",
      labelEn: "Info",
    },
  ];

  return (
    <nav
      aria-label={currentLocale === "kr" ? "하단 메뉴" : "Bottom navigation"}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-blue-100 bg-white/95 backdrop-blur lg:hidden"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentSection === item.section;
          const label = currentLocale === "kr" ? item.labelKr : item.labelEn;

          return (
            <Link
              key={item.section}
              href={item.href}
              className={`flex flex-1 flex-col items-center justify-center gap-1 rounded-lg py-2 transition ${
                isActive
                  ? "text-[#2D509F] font-semibold"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
