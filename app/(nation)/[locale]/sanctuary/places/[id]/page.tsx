import type { Metadata } from "next";
import { notFound } from "next/navigation";
import JsonLd from "@/components/json-ld";
import PlaceDetailContent from "@/components/place-detail-content";
import {
  getLocalizedPlace,
  getPlaceById,
} from "@/app/(nation)/_lib/places";
import { isSupportedLocale } from "@/app/(nation)/_lib/content";
import { absoluteUrl, buildPageMetadata } from "@/app/(nation)/_lib/seo";

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, id } = await params;

  if (!isSupportedLocale(locale)) {
    return {
      robots: { index: false, follow: false },
    };
  }

  const place = getPlaceById(id);
  if (!place || place.category !== "sanctuary") {
    return {
      robots: { index: false, follow: false },
    };
  }

  const localized = getLocalizedPlace(place, locale);

  return buildPageMetadata({
    locale,
    title: localized.title,
    description: localized.description,
    pathname: `/sanctuary/places/${id}`,
    keywords:
      locale === "kr"
        ? ["수원교구", "성지 상세", localized.title]
        : ["Suwon Diocese", "sanctuary detail", localized.title],
  });
}

export default async function SanctuaryPlaceDetailPage({ params }: PageProps) {
  const { locale, id } = await params;

  if (!isSupportedLocale(locale)) notFound();

  const place = getPlaceById(id);
  if (!place || place.category !== "sanctuary") notFound();

  const localized = getLocalizedPlace(place, locale);

  return (
    <>
      <JsonLd
        data={[
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
              {
                "@type": "ListItem",
                position: 3,
                name: localized.title,
                item: absoluteUrl(`/${locale}/sanctuary/places/${id}`).toString(),
              },
            ],
          },
          {
            "@context": "https://schema.org",
            "@type": "Place",
            name: localized.title,
            description: localized.description,
            address: localized.addressText,
            geo: {
              "@type": "GeoCoordinates",
              latitude: place.lat,
              longitude: place.lng,
            },
            url: absoluteUrl(`/${locale}/sanctuary/places/${id}`).toString(),
          },
        ]}
      />
      <section aria-label={localized.title} className="h-full bg-white">
        <div className="h-full px-4 py-6 sm:px-6 lg:px-8">
          <PlaceDetailContent
            locale={locale}
            category={place.category}
            title={localized.title}
            description={localized.description}
            address={localized.addressText}
            lat={place.lat}
            lng={place.lng}
          />
        </div>
      </section>
    </>
  );
}
