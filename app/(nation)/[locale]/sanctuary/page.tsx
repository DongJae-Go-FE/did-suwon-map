import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NaverMap from "@/components/naver-map";
import PageEnterOverlay from "@/components/page-enter-overlay";
import JsonLd from "@/components/json-ld";
import { absoluteUrl, buildPageMetadata } from "@/app/(nation)/_lib/seo";
import {
  getLocalizedPlace,
  getPlaceHref,
  getPlacesByCategory,
} from "@/app/(nation)/_lib/places";

import { getLocaleContent, isSupportedLocale } from "../../_lib/content";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const content = getLocaleContent(locale);

  return buildPageMetadata({
    locale,
    title: content.pages.sanctuary.title,
    description: content.pages.sanctuary.description,
    pathname: "/sanctuary",
    keywords:
      locale === "kr"
        ? ["수원교구 성지 지도", "성지 DID 지도", "성지 순례"]
        : ["Suwon sanctuary map", "DID sanctuary map", "pilgrimage"],
  });
}

export default async function SanctuaryPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const sanctuaryMarkers = getPlacesByCategory("sanctuary").map((place) => {
    const localized = getLocalizedPlace(place, locale);

    return {
      id: place.id,
      lat: place.lat,
      lng: place.lng,
      title: localized.title,
      infoLabel: localized.title,
      href: getPlaceHref(locale, "sanctuary", place.id),
    };
  });

  return (
    <>
      <PageEnterOverlay
        color="#e0f2fe"
        animationClassName="animate-shrink-tl"
      />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: locale === "kr" ? "수원교구 성지 지도" : "Suwon Diocese Sanctuary Map",
            url: absoluteUrl(`/${locale}/sanctuary`).toString(),
            inLanguage: locale === "kr" ? "ko-KR" : "en-US",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "DID MAP SUWON",
                item: absoluteUrl(`/${locale}`).toString(),
              },
              {
                "@type": "ListItem",
                position: 2,
                name: locale === "kr" ? "성지" : "Sanctuary",
                item: absoluteUrl(`/${locale}/sanctuary`).toString(),
              },
            ],
          },
        ]}
      />
      <section
        aria-labelledby="sanctuary-map-title"
        className="flex h-full min-h-0 bg-white"
      >
        <header className="sr-only">
          <h1 id="sanctuary-map-title">
            {locale === "kr" ? "수원교구 성지 지도" : "Suwon Diocese Sanctuary Map"}
          </h1>
          <p>
            {locale === "kr"
              ? "수원교구 성지 지도를 확인하고 성지 상세 정보를 열 수 있습니다."
              : "Browse the Suwon Diocese sanctuary map and open sanctuary details."}
          </p>
        </header>
        <div className="h-full min-h-0 w-full animate-fade-up">
          <NaverMap
            key={`sanctuary-map-${locale}`}
            className="h-full min-h-[calc(100dvh-12rem)] lg:min-h-0"
            center={{ lat: 37.310444562914, lng: 126.98581065993 }}
            markerTitle="천주교 수원교구청"
            markerLabel={
              locale === "kr" ? "천주교 수원교구 중심" : "Suwon Diocese Center"
            }
            zoom={12}
            language={locale === "en" ? "en" : "ko"}
            markers={sanctuaryMarkers}
          />
        </div>
      </section>
    </>
  );
}
