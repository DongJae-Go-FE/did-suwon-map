import Link from "next/link";
import { ExternalLink, Globe, MapPinned, Navigation } from "lucide-react";

type PlaceMapLinksProps = {
  title: string;
  lat: number;
  lng: number;
  locale: "kr" | "en";
  className?: string;
};

export default function PlaceMapLinks({
  title,
  lat,
  lng,
  locale,
  className,
}: PlaceMapLinksProps) {
  const googleMapHref = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const appleMapHref = `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(title)}`;
  const siteHref = "https://www.catholic.or.kr";

  return (
    <div className={className}>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href={googleMapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-blue-50/30"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#3C9BD5]/20 text-[#2D509F]">
            <MapPinned className="h-4 w-4" />
          </span>
          <span>{locale === "kr" ? "구글맵" : "Google Maps"}</span>
          <ExternalLink className="h-4 w-4 text-slate-500" />
        </Link>

        <Link
          href={appleMapHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-blue-50/30"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-200 text-slate-700">
            <Navigation className="h-4 w-4" />
          </span>
          <span>{locale === "kr" ? "애플맵" : "Apple Maps"}</span>
          <ExternalLink className="h-4 w-4 text-slate-500" />
        </Link>

        <Link
          href={siteHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-blue-100 px-3 py-2 text-sm font-medium text-slate-800 hover:bg-blue-50/30"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Globe className="h-4 w-4" />
          </span>
          <span>{locale === "kr" ? "사이트 연결" : "Website"}</span>
          <ExternalLink className="h-4 w-4 text-slate-500" />
        </Link>
      </div>
    </div>
  );
}
