import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Noto_Sans } from "next/font/google";
import SiteFooter from "@/components/site-footer";
import SiteHeader from "@/components/site-header";
import MobileBottomNav from "@/components/mobile-bottom-nav";
import JsonLd from "@/components/json-ld";
import { SITE_NAME, getBaseUrl } from "@/app/(nation)/_lib/seo";
import "swiper/css/bundle";
import "./globals.css";

const notoSans = Noto_Sans({ variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: getBaseUrl(),
  applicationName: SITE_NAME,
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Suwon Diocese DID map for region, sanctuary, and information pages in Korean and English.",
  keywords: [
    "DID MAP",
    "Suwon Diocese",
    "Catholic Diocese of Suwon",
    "suwon map",
    "sanctuary map",
    "성지 지도",
    "수원교구",
  ],
  alternates: {
    canonical: "/",
    languages: {
      "ko-KR": "/kr",
      "en-US": "/en",
      "x-default": "/kr",
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description:
      "Explore Suwon Diocese regions, sanctuaries, and announcements in Korean and English.",
    url: "/",
    images: [
      {
        url: "/logo2.svg",
        alt: SITE_NAME,
      },
    ],
  },
  twitter: {
    card: "summary",
    title: SITE_NAME,
    description:
      "Explore Suwon Diocese regions, sanctuaries, and announcements in Korean and English.",
    images: ["/logo2.svg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#ffffff",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const baseUrl = getBaseUrl().toString().replace(/\/$/, "");

  return (
    <html lang="ko" className={notoSans.variable}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: SITE_NAME,
            url: baseUrl,
            inLanguage: ["ko-KR", "en-US"],
          }}
        />
        <div className="grid h-dvh min-h-dvh grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden pb-16 lg:pb-0">
          <SiteHeader />
          <main id="main-content" className="w-full min-h-0 overflow-y-auto">
            {children}
          </main>
          <SiteFooter />
          <MobileBottomNav />
        </div>
      </body>
    </html>
  );
}
