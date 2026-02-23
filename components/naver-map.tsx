"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { cn } from "@/lib/utils";
import { PlaceMarker, LocationMarker } from "./map-markers";

type NaverLatLngLike = {
  lat: () => number;
  lng: () => number;
};

type NaverMapInstance = {
  setCenter: (center: NaverLatLngLike) => void;
  panTo?: (center: NaverLatLngLike) => void;
};

type NaverMarkerInstance = {
  setPosition: (position: NaverLatLngLike) => void;
};

type NaverMapsGlobal = {
  maps: {
    Map: new (
      element: HTMLElement,
      options: {
        center: NaverLatLngLike;
        zoom: number;
        zoomControl?: boolean;
        zoomControlOptions?: {
          position: number;
        };
      },
    ) => NaverMapInstance;
    Marker: new (options: {
      position: NaverLatLngLike;
      map: NaverMapInstance;
      title?: string;
      icon?: {
        content: string | HTMLElement;
        size?: { width: number; height: number };
        anchor?: { x: number; y: number };
      };
    }) => NaverMarkerInstance;
    InfoWindow: new (options: {
      content: string;
    }) => {
      open: (map: NaverMapInstance, marker: NaverMarkerInstance) => void;
    };
    LatLng: new (lat: number, lng: number) => NaverLatLngLike;
    Event: {
      addListener: (
        target: NaverMarkerInstance,
        eventName: "click",
        handler: () => void,
      ) => void;
    };
    Position: {
      TOP_RIGHT: number;
    };
  };
};

declare global {
  interface Window {
    naver?: NaverMapsGlobal;
    __naverMapsSdkLanguage?: "ko" | "en";
  }
}

type NaverMapProps = {
  className?: string;
  center: {
    lat: number;
    lng: number;
  };
  markerTitle: string;
  markerLabel?: string;
  zoom?: number;
  language?: "ko" | "en";
  markers?: Array<{
    id: string;
    lat: number;
    lng: number;
    title: string;
    href: string;
    infoLabel?: string;
  }>;
};

function createMarkerElement(label: string): HTMLDivElement {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<PlaceMarker label={label} />);
  return container;
}

function createLocationMarkerElement(): HTMLDivElement {
  const container = document.createElement("div");
  const root = createRoot(container);
  root.render(<LocationMarker />);
  return container;
}

export default function NaverMap({
  className,
  center,
  markerTitle,
  markerLabel,
  zoom = 11,
  language = "ko",
  markers = [],
}: NaverMapProps) {
  const router = useRouter();
  const mapElementRef = useRef<HTMLDivElement | null>(null);
  const initializedRef = useRef(false);
  const markerNavigatingRef = useRef(false);
  const locationMarkerRef = useRef<NaverMarkerInstance | null>(null);
  const locationWatchIdRef = useRef<number | null>(null);
  const [isSdkReady, setIsSdkReady] = useState(
    () =>
      typeof window !== "undefined" &&
      Boolean(window.naver?.maps) &&
      window.__naverMapsSdkLanguage === language,
  );

  const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;

  const sdkSrc = useMemo(() => {
    if (!clientId) return "";
    return `https://oapi.map.naver.com/openapi/v3/maps.js?ncpKeyId=${clientId}&language=${language}`;
  }, [clientId, language]);

  useEffect(() => {
    if (!clientId) {
      return;
    }

    if (window.naver?.maps && window.__naverMapsSdkLanguage === language) {
      return;
    }

    let cancelled = false;

    document
      .querySelectorAll<HTMLScriptElement>('script[data-naver-maps-sdk="true"]')
      .forEach((script) => script.remove());

    delete window.naver;
    window.__naverMapsSdkLanguage = undefined;

    const script = document.createElement("script");
    script.src = sdkSrc;
    script.async = true;
    script.dataset.naverMapsSdk = "true";

    script.onload = () => {
      if (cancelled) return;
      window.__naverMapsSdkLanguage = language;
      setIsSdkReady(true);
    };

    script.onerror = () => {
      if (cancelled) return;
      setIsSdkReady(false);
    };

    document.head.appendChild(script);

    return () => {
      cancelled = true;
    };
  }, [clientId, language, sdkSrc]);

  useEffect(() => {
    if (!isSdkReady || initializedRef.current || !mapElementRef.current) {
      return;
    }

    const naver = window.naver;

    if (!naver?.maps) {
      return;
    }

    const mapCenter = new naver.maps.LatLng(center.lat, center.lng);

    const map = new naver.maps.Map(mapElementRef.current, {
      center: mapCenter,
      zoom,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.TOP_RIGHT,
      },
    });

    if (markers.length === 0) {
      const marker = new naver.maps.Marker({
        position: mapCenter,
        map,
        title: markerTitle,
      });

      if (markerLabel) {
        const infoWindow = new naver.maps.InfoWindow({
          content: `<div style="padding:8px 10px;font-size:12px;font-weight:600;white-space:nowrap;">${markerLabel}</div>`,
        });

        infoWindow.open(map, marker);
      }
    }

    for (const item of markers) {
      const markerPosition = new naver.maps.LatLng(item.lat, item.lng);
      const markerElement = createMarkerElement(item.infoLabel || item.title);

      const placeMarker = new naver.maps.Marker({
        position: markerPosition,
        map,
        title: item.title,
        icon: {
          content: markerElement,
          anchor: { x: 0, y: 0 },
        },
      });

      naver.maps.Event.addListener(placeMarker, "click", () => {
        if (markerNavigatingRef.current) {
          return;
        }

        markerNavigatingRef.current = true;

        if (typeof map.panTo === "function") {
          map.panTo(markerPosition);
        } else {
          map.setCenter(markerPosition);
        }

        window.setTimeout(() => {
          router.push(item.href);
          markerNavigatingRef.current = false;
        }, 360);
      });
    }

    if (navigator.geolocation) {
      const updateCurrentLocation = (position: GeolocationPosition) => {
        const currentLatLng = new naver.maps.LatLng(
          position.coords.latitude,
          position.coords.longitude,
        );

        const shouldCenterToCurrentLocation =
          typeof window !== "undefined" &&
          window.matchMedia("(max-width: 1023px)").matches;

        if (shouldCenterToCurrentLocation) {
          if (typeof map.panTo === "function") {
            map.panTo(currentLatLng);
          } else {
            map.setCenter(currentLatLng);
          }
        }

        if (locationMarkerRef.current) {
          locationMarkerRef.current.setPosition(currentLatLng);
        } else {
          const locationMarkerElement = createLocationMarkerElement();
          locationMarkerRef.current = new naver.maps.Marker({
            position: currentLatLng,
            map,
            title: language === "ko" ? "현재 위치" : "Current Location",
            icon: {
              content: locationMarkerElement,
              size: { width: 24, height: 24 },
              anchor: { x: 12, y: 12 },
            },
          });
        }
      };

      navigator.geolocation.getCurrentPosition(
        updateCurrentLocation,
        () => {
          // Keep default center when location access fails or is denied.
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 0,
        },
      );

      locationWatchIdRef.current = navigator.geolocation.watchPosition(
        updateCurrentLocation,
        () => {
          // Keep default center when location access fails or is denied.
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 5000,
        },
      );
    }

    initializedRef.current = true;

    return () => {
      if (locationWatchIdRef.current !== null) {
        navigator.geolocation.clearWatch(locationWatchIdRef.current);
        locationWatchIdRef.current = null;
      }
    };
  }, [
    center.lat,
    center.lng,
    isSdkReady,
    language,
    markerLabel,
    markerTitle,
    markers,
    router,
    zoom,
  ]);

  if (!clientId) {
    return (
      <div
        className={cn(
          "flex min-h-64 items-center justify-center rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700",
          className,
        )}
      >
        `NEXT_PUBLIC_NAVER_CLIENT_ID`가 설정되지 않았습니다.
      </div>
    );
  }

  return (
    <div className={cn("relative overflow-hidden bg-white", className)}>
      <div ref={mapElementRef} className="h-full w-full" />
      {!isSdkReady ? (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-blue-50/60 text-sm font-medium text-[#2D509F]">
          네이버 지도 불러오는 중...
        </div>
      ) : null}
    </div>
  );
}
