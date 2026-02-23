"use client";

import type { PlaceCategory } from "@/app/(nation)/_lib/places";
import PlaceImageSlider from "@/components/place-image-slider";
import PlaceMapLinks from "@/components/place-map-links";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

type PlaceDetailContentProps = {
  locale: "kr" | "en";
  category: PlaceCategory;
  title: string;
  description: string;
  address: string;
  lat: number;
  lng: number;
};

export default function PlaceDetailContent({
  locale,
  category,
  title,
  description,
  address,
  lat,
  lng,
}: PlaceDetailContentProps) {
  const router = useRouter();

  return (
    <article className="flex h-full flex-col gap-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex items-center gap-2 self-start text-sm font-medium text-slate-600 transition-colors hover:text-[#2D509F] cursor-pointer"
      >
        <ArrowLeft className="h-5 w-5" />
        {locale === "kr" ? "뒤로가기" : "Back"}
      </button>

      <div className="grid min-w-0 flex-1 gap-5 lg:grid-cols-[1.35fr_0.65fr] xl:grid-cols-[1.45fr_0.55fr]">
        <div className="min-w-0 lg:h-full">
          <PlaceImageSlider title={title} className="lg:h-full" />
        </div>

        <section
          aria-labelledby="place-detail-title"
          className="min-w-0 space-y-4 lg:h-full lg:overflow-y-auto lg:pr-1"
        >
          <header className="shrink-0">
            <p className="text-xs font-semibold tracking-wide text-[#2D509F]">
              {category.toUpperCase()}
            </p>
            <h1
              id="place-detail-title"
              className="mt-2 text-xl font-bold text-slate-900 sm:text-2xl"
            >
              {title}
            </h1>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              {description}
            </p>
          </header>

          <section className="shrink-0 rounded-xl border border-blue-100 bg-blue-50/30 p-4">
            <p className="text-xs font-semibold text-[#2D509F]">
              {locale === "kr" ? "주소" : "Address"}
            </p>
            <p className="mt-1 text-sm text-slate-800">{address}</p>
            <p className="mt-2 text-xs text-slate-500">
              {lat.toFixed(6)}, {lng.toFixed(6)}
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              {locale === "kr"
                ? "이 구간에는 장소 소개, 방문 안내, 운영 시간, 예약 방법, 유의사항 등의 상세 정보를 추가할 예정입니다. 현재는 샘플 텍스트가 표시됩니다."
                : "This section is reserved for place details such as visiting guide, opening hours, reservation instructions, and notes. Sample text is currently shown."}
            </p>
          </section>

          <section className="shrink-0 rounded-xl border border-blue-100 bg-white p-4 mb-4">
            <p className="mb-3 text-xs font-semibold text-[#2D509F]">
              {locale === "kr" ? "바로가기" : "Quick Links"}
            </p>
            <PlaceMapLinks locale={locale} title={title} lat={lat} lng={lng} />
          </section>
        </section>
      </div>
    </article>
  );
}
