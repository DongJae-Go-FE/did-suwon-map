export type SupportedLocale = "kr" | "en";

type LocaleContent = {
  title: string;
  cards: Array<{
    title: string;
    description: string;
    href: string;
    cta: string;
    tag: string;
    imageUrl: string;
    imageClassName: string;
    transitionColor: string;
    enterAnimation: "animate-shrink-br" | "animate-shrink-tl";
  }>;
  pages: {
    region: {
      title: string;
      description: string;
    };
    sanctuary: {
      title: string;
      description: string;
    };
    info: {
      title: string;
      description: string;
    };
  };
};

const localeContent: Record<SupportedLocale, LocaleContent> = {
  kr: {
    title: "DID MAP SUWON",
    cards: [
      {
        title: "지역",
        description: "지역별 DID 지도를 확인합니다.",
        href: "/kr/region",
        cta: "이동하기",
        tag: "Region",
        imageUrl: "https://picsum.photos/seed/region/800/600",
        imageClassName:
          "bg-gradient-to-br from-[#3C9BD5]/20 via-blue-50/30 to-white border-blue-100",
        transitionColor: "#e0f2fe",
        enterAnimation: "animate-shrink-br",
      },
      {
        title: "성지",
        description: "성지 중심 DID 지도를 확인합니다.",
        href: "/kr/sanctuary",
        cta: "이동하기",
        tag: "Sanctuary",
        imageUrl: "https://picsum.photos/seed/sanctuary/800/600",
        imageClassName:
          "bg-gradient-to-br from-[#52B8E8]/20 via-blue-50/30 to-white border-blue-100",
        transitionColor: "#e0f2fe",
        enterAnimation: "animate-shrink-tl",
      },
    ],
    pages: {
      region: {
        title: "지역 페이지",
        description: "지역별 DID 지도를 구성할 페이지입니다.",
      },
      sanctuary: {
        title: "성지 페이지",
        description: "성지 DID 지도를 구성할 페이지입니다.",
      },
      info: {
        title: "소식 및 정보",
        description: "공지사항, 소셜미디어, 공식 사이트 정보를 제공합니다.",
      },
    },
  },
  en: {
    title: "DID MAP SUWON",
    cards: [
      {
        title: "Region",
        description: "Browse the DID map by region.",
        href: "/en/region",
        cta: "Open",
        tag: "Region",
        imageUrl: "https://picsum.photos/seed/region/800/600",
        imageClassName:
          "bg-gradient-to-br from-[#3C9BD5]/20 via-blue-50/30 to-white border-blue-100",
        transitionColor: "#e0f2fe",
        enterAnimation: "animate-shrink-br",
      },
      {
        title: "Sanctuary",
        description: "Browse the DID map by sanctuary.",
        href: "/en/sanctuary",
        cta: "Open",
        tag: "Sanctuary",
        imageUrl: "https://picsum.photos/seed/sanctuary/800/600",
        imageClassName:
          "bg-gradient-to-br from-[#52B8E8]/20 via-blue-50/30 to-white border-blue-100",
        transitionColor: "#e0f2fe",
        enterAnimation: "animate-shrink-tl",
      },
    ],
    pages: {
      region: {
        title: "Region Page",
        description: "This page will contain the region DID map.",
      },
      sanctuary: {
        title: "Sanctuary Page",
        description: "This page will contain the sanctuary DID map.",
      },
      info: {
        title: "News & Info",
        description: "Announcements, social media, and official site information.",
      },
    },
  },
};

export function isSupportedLocale(locale: string): locale is SupportedLocale {
  return locale === "kr" || locale === "en";
}

export function getLocaleContent(locale: string) {
  return localeContent[(isSupportedLocale(locale) ? locale : "kr") as SupportedLocale];
}

export const supportedLocales: SupportedLocale[] = ["kr", "en"];
