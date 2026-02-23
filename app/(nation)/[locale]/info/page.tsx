import type { Metadata } from "next";
import InfoPageClient from "@/components/info-page-client";
import JsonLd from "@/components/json-ld";
import SiteFooter from "@/components/site-footer";
import { absoluteUrl, buildPageMetadata } from "@/app/(nation)/_lib/seo";
import {
  getLocaleContent,
  isSupportedLocale,
} from "@/app/(nation)/_lib/content";

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
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const content = getLocaleContent(locale);

  return buildPageMetadata({
    locale,
    title: content.pages.info.title,
    description: content.pages.info.description,
    pathname: "/info",
    keywords:
      locale === "kr"
        ? ["공지사항", "수원교구 소식", "정보 페이지"]
        : ["announcements", "Suwon Diocese news", "info page"],
  });
}

export default async function InfoPage({ params }: PageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    return <InfoPageClient locale="kr" />;
  }

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: getLocaleContent(locale).pages.info.title,
            url: absoluteUrl(`/${locale}/info`).toString(),
            inLanguage: locale === "kr" ? "ko-KR" : "en-US",
            description: getLocaleContent(locale).pages.info.description,
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
                name: locale === "kr" ? "소식" : "Info",
                item: absoluteUrl(`/${locale}/info`).toString(),
              },
            ],
          },
        ]}
      />
      <InfoPageClient locale={locale} />
      <SiteFooter mobileInline />
    </>
  );
}
