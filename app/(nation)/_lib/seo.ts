import type { Metadata } from "next";
import type { SupportedLocale } from "./content";

export const SITE_NAME = "DID MAP SUWON";

const LOCALE_LABEL: Record<SupportedLocale, string> = {
  kr: "ko-KR",
  en: "en-US",
};

export function getBaseUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";

  try {
    return new URL(raw);
  } catch {
    return new URL("http://localhost:3000");
  }
}

export function getLocaleLang(locale: SupportedLocale) {
  return locale === "kr" ? "ko" : "en";
}

export function getLocaleHtmlLang(locale: SupportedLocale) {
  return LOCALE_LABEL[locale];
}

export function absoluteUrl(path: string) {
  return new URL(path, getBaseUrl());
}

function localizedPath(locale: SupportedLocale, pathname: string) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export function buildLocaleAlternates(pathname: string) {
  const krPath = localizedPath("kr", pathname);
  const enPath = localizedPath("en", pathname);

  return {
    canonical: krPath,
    languages: {
      "ko-KR": krPath,
      "en-US": enPath,
      "x-default": krPath,
    },
  } satisfies Metadata["alternates"];
}

type BuildPageMetadataArgs = {
  locale: SupportedLocale;
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
};

export function buildPageMetadata({
  locale,
  title,
  description,
  pathname,
  keywords,
}: BuildPageMetadataArgs): Metadata {
  const path = localizedPath(locale, pathname);
  const imageUrl = absoluteUrl("/logo2.svg").toString();

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: path,
      languages: buildLocaleAlternates(pathname).languages,
    },
    openGraph: {
      type: "website",
      locale: locale === "kr" ? "ko_KR" : "en_US",
      url: path,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: imageUrl,
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: [imageUrl],
    },
  };
}

