"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";

type SiteFooterProps = {
  mobileInline?: boolean;
};

export default function SiteFooter({ mobileInline = false }: SiteFooterProps) {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "kr";
  const isKorean = locale === "kr";

  return (
    <footer
      className={
        mobileInline
          ? "mb-20 border-t border-blue-100 bg-white lg:hidden"
          : "hidden border-t border-blue-100 bg-white lg:block"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-4 text-sm text-slate-600 sm:px-6 md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col items-start gap-2">
          <Image
            src="/logo.svg"
            alt="DID MAP SUWON"
            width={100}
            height={32}
            className="h-8"
          />

          <p className="text-xs text-slate-500">
            {isKorean
              ? "Copyright (C) 2020, 천주교 수원교구청. All rights Reserved."
              : "Copyright (C) 2020, Catholic Diocese of Suwon. All rights Reserved."}
          </p>
        </div>

        <div className="space-y-2">
          <address className="not-italic text-xs leading-5 text-slate-600 sm:text-sm flex flex-col gap-y-0.5">
            <p>
              {isKorean
                ? "천주교 수원교구 주소: 경기 수원시 장안구 이목로 39"
                : "Address: 39 Imok-ro, Jangan-gu, Suwon-si, Gyeonggi-do"}
            </p>
            <p>E-mail: masterforce999@naver.com</p>
            <p>Tel: 1212121212</p>
          </address>
        </div>
      </div>
    </footer>
  );
}
