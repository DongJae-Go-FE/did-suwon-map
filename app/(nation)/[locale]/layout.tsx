import { notFound } from "next/navigation";
import { getLocaleHtmlLang, getLocaleLang } from "@/app/(nation)/_lib/seo";
import {
  isSupportedLocale,
  type SupportedLocale,
} from "@/app/(nation)/_lib/content";

type LayoutProps = Readonly<{
  children: React.ReactNode;
  params: Promise<{
    locale: string;
  }>;
}>;

export default async function LocaleLayout({ children, params }: LayoutProps) {
  const { locale } = await params;

  if (!isSupportedLocale(locale)) {
    notFound();
  }

  const supportedLocale = locale as SupportedLocale;

  return (
    <div
      lang={getLocaleLang(supportedLocale)}
      data-locale={supportedLocale}
      aria-label={getLocaleHtmlLang(supportedLocale)}
      className="h-full min-h-0"
    >
      {children}
    </div>
  );
}
