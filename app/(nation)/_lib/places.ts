import type { SupportedLocale } from "./content";

export type PlaceCategory = "region" | "sanctuary";

export type Place = {
  id: string;
  category: PlaceCategory;
  lat: number;
  lng: number;
  name: {
    kr: string;
    en: string;
  };
  summary: {
    kr: string;
    en: string;
  };
  address: {
    kr: string;
    en: string;
  };
};

export const PLACES: Place[] = [
  {
    id: "suwon-diocese-center",
    category: "region",
    lat: 37.310444562914,
    lng: 126.98581065993,
    name: {
      kr: "천주교 수원교구청",
      en: "Catholic Diocese of Suwon Center",
    },
    summary: {
      kr: "수원교구 지역 안내의 중심 지점입니다.",
      en: "Central point for the Suwon Diocese regional map.",
    },
    address: {
      kr: "경기 수원시 장안구 이목로 39",
      en: "39 Imok-ro, Jangan-gu, Suwon-si, Gyeonggi-do",
    },
  },
  {
    id: "suwon-sanctuary-center",
    category: "sanctuary",
    lat: 37.310444562914,
    lng: 126.98581065993,
    name: {
      kr: "수원교구 성지 안내 중심",
      en: "Suwon Diocese Sanctuary Guide Center",
    },
    summary: {
      kr: "성지 지도를 위한 기준 지점입니다.",
      en: "Reference point for the sanctuary map.",
    },
    address: {
      kr: "경기 수원시 장안구 이목로 39",
      en: "39 Imok-ro, Jangan-gu, Suwon-si, Gyeonggi-do",
    },
  },
];

export function getPlacesByCategory(category: PlaceCategory) {
  return PLACES.filter((place) => place.category === category);
}

export function getPlaceById(id: string) {
  return PLACES.find((place) => place.id === id) ?? null;
}

export function getPlaceHref(
  locale: SupportedLocale,
  category: PlaceCategory,
  placeId: string,
) {
  return `/${locale}/${category}/places/${placeId}`;
}

export function getLocalizedPlace(place: Place, locale: SupportedLocale) {
  return {
    ...place,
    title: place.name[locale],
    description: place.summary[locale],
    addressText: place.address[locale],
  };
}

export function getCategoryBackHref(locale: SupportedLocale, category: PlaceCategory) {
  return `/${locale}/${category}`;
}
