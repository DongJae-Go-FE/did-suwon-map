"use client";

import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import { cn } from "@/lib/utils";

type PlaceImageSliderProps = {
  title: string;
  className?: string;
};

const sampleImages = [
  { src: "/place-samples/sample-1.jpg", alt: "Sample image 1" },
  { src: "/place-samples/sample-2.jpeg", alt: "Sample image 2" },
  { src: "/place-samples/sample-3.jpeg", alt: "Sample image 3" },
];

export default function PlaceImageSlider({
  title,
  className,
}: PlaceImageSliderProps) {
  return (
    <div
      className={cn(
        "min-w-0 overflow-hidden rounded-2xl border border-blue-100 bg-white",
        className,
      )}
    >
      <Swiper
        modules={[Pagination, Navigation]}
        pagination={{ clickable: true }}
        navigation
        className="place-swiper h-80 w-full min-w-0 sm:h-96 lg:h-full"
      >
        {sampleImages.map((image, index) => (
          <SwiperSlide key={`${image.src}-${index}`}>
            <div className="relative h-full w-full bg-blue-50/20">
              <Image
                src={image.src}
                alt={`${title} ${image.alt}`}
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/35 to-transparent" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
