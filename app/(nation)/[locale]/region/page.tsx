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
    title: content.pages.region.title,
    description: content.pages.region.description,
    pathname: "/region",
    keywords:
      locale === "kr"
        ? ["수원교구 지역 지도", "지역 DID 지도", "성당 위치"]
        : ["Suwon region map", "DID region map", "Catholic locations"],
  });
}

export default async function RegionPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const regionMarkers = getPlacesByCategory("region").map((place) => {
    const localized = getLocalizedPlace(place, locale);

    return {
      id: place.id,
      lat: place.lat,
      lng: place.lng,
      title: localized.title,
      infoLabel: localized.title,
      href: getPlaceHref(locale, "region", place.id),
    };
  });

  return (
    <>
      <PageEnterOverlay color="#e0f2fe" animationClassName="animate-shrink-br" />
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: locale === "kr" ? "수원교구 지역 지도" : "Suwon Diocese Region Map",
            url: absoluteUrl(`/${locale}/region`).toString(),
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
                name: locale === "kr" ? "지역" : "Region",
                item: absoluteUrl(`/${locale}/region`).toString(),
              },
            ],
          },
        ]}
      />
      <section
        aria-labelledby="region-map-title"
        className="flex h-full min-h-0 bg-white"
      >
        <header className="sr-only">
          <h1 id="region-map-title">
            {locale === "kr" ? "수원교구 지역 지도" : "Suwon Diocese Region Map"}
          </h1>
          <p>
            {locale === "kr"
              ? "수원교구 지역별 지도를 확인하고 상세 장소 정보를 열 수 있습니다."
              : "Browse the Suwon Diocese regional map and open place details."}
          </p>
        </header>
        <div className="h-full min-h-0 w-full animate-fade-up">
          <NaverMap
            key={`region-map-${locale}`}
            className="h-full min-h-[calc(100dvh-12rem)] lg:min-h-0"
            center={{ lat: 37.310444562914, lng: 126.98581065993 }}
            markerTitle="천주교 수원교구청"
            markerLabel={locale === "kr" ? "천주교 수원교구 중심" : "Suwon Diocese Center"}
            zoom={12}
            language={locale === "en" ? "en" : "ko"}
            markers={regionMarkers}
          />
        </div>
      </section>
    </>
  );
}
