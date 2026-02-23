import { notFound } from "next/navigation";
import PlaceDetailContent from "@/components/place-detail-content";
import PlaceDetailModal from "@/components/place-detail-modal";
import {
  getCategoryBackHref,
  getLocalizedPlace,
  getPlaceById,
} from "@/app/(nation)/_lib/places";
import { isSupportedLocale } from "@/app/(nation)/_lib/content";

type PageProps = {
  params: Promise<{
    locale: string;
    id: string;
  }>;
};

export default async function SanctuaryPlaceDetailModalPage({
  params,
}: PageProps) {
  const { locale, id } = await params;

  if (!isSupportedLocale(locale)) notFound();

  const place = getPlaceById(id);
  if (!place || place.category !== "sanctuary") notFound();

  const localized = getLocalizedPlace(place, locale);

  return (
    <PlaceDetailModal backHref={getCategoryBackHref(locale, "sanctuary")}>
      <PlaceDetailContent
        locale={locale}
        category={place.category}
        title={localized.title}
        description={localized.description}
        address={localized.addressText}
        lat={place.lat}
        lng={place.lng}
      />
    </PlaceDetailModal>
  );
}
