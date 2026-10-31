"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { buttonVariants } from "@/components/ui/button";
import { heroSlides } from "@/components/home/hero-slides";

import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function HeroSliderSwiper() {
    return (
        <Swiper
            modules={[Autoplay, EffectFade, Navigation, Pagination]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            loop
            autoplay={{ delay: 6000, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            navigation
            className="hero-swiper h-[min(78vh,680px)] min-h-130 w-full"
        >
            {heroSlides.map((slide, index) => (
                <SwiperSlide key={slide.title}>
                    <div className="relative flex h-full items-center overflow-hidden">
                        <Image
                            src={slide.image}
                            alt={slide.alt}
                            fill
                            priority={index === 0}
                            sizes="100vw"
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-linear-to-r from-black/80 via-black/50 to-black/10" />
                        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                            <div className="max-w-2xl space-y-5 text-white">
                                <p className="text-xs font-semibold tracking-[0.3em] text-white/75 uppercase">
                                    {slide.eyebrow}
                                </p>
                                <h1 className="font-heading text-4xl leading-[1.05] font-bold text-balance sm:text-5xl lg:text-6xl">
                                    {slide.title}
                                </h1>
                                <p className="max-w-xl text-base leading-7 text-white/85 sm:text-lg">
                                    {slide.text}
                                </p>
                                <Link
                                    href="/books"
                                    className={buttonVariants({
                                        size: "lg",
                                        className:
                                            "mt-2 h-11 rounded-full px-6 text-base shadow-lg shadow-black/20",
                                    })}
                                >
                                    Browse Books
                                    <ArrowRight
                                        className="size-4"
                                        aria-hidden="true"
                                    />
                                </Link>
                            </div>
                        </div>
                    </div>
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
