"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { heroSlides } from "@/components/home/hero-slides";

const HeroSliderSwiper = dynamic(
    () =>
        import("@/components/home/hero-slider-swiper").then(
            (module) => module.HeroSliderSwiper,
        ),
    { ssr: false, loading: () => <HeroFallback /> },
);

function HeroFallback() {
    const slide = heroSlides[0];

    return (
        <div className="relative flex h-[min(78vh,680px)] min-h-130 w-full items-center overflow-hidden">
            <Image
                src={slide.image}
                alt={slide.alt}
                fill
                priority
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
                        <ArrowRight className="size-4" aria-hidden="true" />
                    </Link>
                </div>
            </div>
        </div>
    );
}

export function HeroSlider() {
    return (
        <section className="relative">
            <HeroSliderSwiper />
        </section>
    );
}
