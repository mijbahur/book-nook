import { HeroSlider } from "@/components/home/hero-slider";
import { HowItWorks } from "@/components/home/how-it-works";
import {
    NewArrivals,
    NewArrivalsSkeleton,
} from "@/components/home/new-arrivals";
import { TopCategories } from "@/components/home/top-categories";
import { Suspense } from "react";

export default function Home() {
    return (
        <div>
            <HeroSlider />
            <Suspense fallback={<NewArrivalsSkeleton />}>
                <NewArrivals />
            </Suspense>
            <HowItWorks />
            <TopCategories />
        </div>
    );
}
