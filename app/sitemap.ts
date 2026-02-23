import type { MetadataRoute } from "next";
import { PLACES } from "@/app/(nation)/_lib/places";
import { getBaseUrl } from "@/app/(nation)/_lib/seo";
import { supportedLocales } from "@/app/(nation)/_lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = getBaseUrl();
  const routes = [
    "/",
    ...supportedLocales.flatMap((locale) => [
      `/${locale}`,
      `/${locale}/region`,
      `/${locale}/sanctuary`,
      `/${locale}/info`,
      ...PLACES.map((place) => `/${locale}/${place.category}/places/${place.id}`),
    ]),
  ];

  return routes.map((path) => ({
    url: new URL(path, baseUrl).toString(),
    lastModified: new Date(),
    changeFrequency: path.includes("/places/") ? "weekly" : "daily",
    priority:
      path === "/"
        ? 1
        : path === "/kr" || path === "/en"
          ? 0.9
          : path.includes("/places/")
            ? 0.7
            : 0.8,
  }));
}

