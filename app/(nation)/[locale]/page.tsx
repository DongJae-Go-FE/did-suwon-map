import type { Metadata } from "next";
import { notFound } from "next/navigation";
import TransitionLink from "@/components/transition-link";
import SiteFooter from "@/components/site-footer";
import Image from "next/image";
import JsonLd from "@/components/json-ld";
import { absoluteUrl, buildPageMetadata } from "@/app/(nation)/_lib/seo";

import {
  getLocaleContent,
  isSupportedLocale,
  supportedLocales,
} from "../_lib/content";

type PageProps = {
  params: Promise<{
    locale: string;
  }>;
};

export function generateStaticParams() {
  return supportedLocales.map((locale) => ({ locale }));
}

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
    title: content.title,
    description:
      locale === "kr"
        ? "수원교구 지역 지도, 성지 지도, 소식 및 정보 페이지로 이동합니다."
        : "Navigate to Suwon Diocese region map, sanctuary map, and news/info pages.",
    pathname: "/",
    keywords:
      locale === "kr"
        ? ["수원교구", "지역 지도", "성지 지도", "DID MAP"]
        : ["Suwon Diocese", "region map", "sanctuary map", "DID MAP"],
  });
}

export default async function NationHomePage({ params }: PageProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const content = getLocaleContent(locale);
  const basePath = `/${locale}`;

  return (
    <>
      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: content.title,
            url: absoluteUrl(basePath).toString(),
            inLanguage: locale === "kr" ? "ko-KR" : "en-US",
            description:
              locale === "kr"
                ? "수원교구 DID MAP 메인 페이지"
                : "Suwon Diocese DID MAP home page",
          },
          {
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: content.title,
                item: absoluteUrl(basePath).toString(),
              },
            ],
          },
        ]}
      />
      <section
        aria-labelledby="nation-home-title"
        className="flex min-h-full items-center justify-center bg-linear-to-br from-blue-50/40 to-white px-4 py-6 sm:px-6 sm:py-8"
      >
        <div className="mx-auto w-full max-w-6xl">
          <header className="mb-8 flex items-center justify-center gap-3 text-center sm:mb-10 sm:gap-4">
            <Image
              src="/logo2.svg"
              alt="Logo"
              width={60}
              height={60}
              className="h-12 w-12 sm:h-15 sm:w-15"
            />
            <h1
              id="nation-home-title"
              className="text-3xl font-bold text-slate-900 sm:text-4xl"
            >
              {content.title}
            </h1>
          </header>

          <nav
            aria-label={locale === "kr" ? "주요 섹션 이동" : "Primary sections"}
            className="grid gap-5 md:grid-cols-2"
          >
            {content.cards.map((card) => (
              <TransitionLink
                key={card.href}
                href={card.href}
                transitionColor={card.transitionColor}
                className="group rounded-2xl border border-blue-100 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3C9BD5]"
              >
                <article className="flex min-h-36 flex-col justify-between gap-4">
                  <div>
                    <div
                      className={`relative mb-5 flex h-56 items-end overflow-hidden rounded-xl border p-4 sm:h-64 ${card.imageClassName}`}
                    >
                      <Image
                        src={card.imageUrl}
                        alt={card.title}
                        fill
                        className="object-cover opacity-60"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/10 to-transparent" />
                    </div>
                    <div className="mb-2 inline-block rounded-full bg-[#3C9BD5]/10 px-3 py-1 text-xs font-semibold text-[#2D509F]">
                      {card.tag}
                    </div>
                    <h2 className="mt-2 text-xl font-semibold text-slate-900">
                      {card.title}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      {card.description}
                    </p>
                  </div>

                  <span className="text-sm font-semibold text-[#2D509F] transition group-hover:translate-x-1">
                    {card.cta} →
                  </span>
                </article>
              </TransitionLink>
            ))}
          </nav>
        </div>
      </section>
      <SiteFooter mobileInline />
    </>
  );
}
