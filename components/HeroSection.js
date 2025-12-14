"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-black">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/landingVideo.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 from-0% to-neutral-950/10 to-100%" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-end h-full text-left pl-30 pb-26">
        <h1 className="text-4xl md:text-5xl font-sans italic font-light text-white mb-6 max-w-xl leading-tight">
          Where Legends of the Track{" "}
          <span className="font-serif italic">Come to Life</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 max-w-lg text-neutral-200 font-sans font-extralight">
          Experience the thrill of motorsport legends inside an interactive
          digital space.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full h-12 px-8 text-base font-semibold tracking-wide bg-white text-neutral-950 shadow-[0_18px_45px_-25px_rgba(255,255,255,0.85)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_24px_55px_-25px_rgba(255,255,255,0.9)] focus-visible:ring-white/40 focus-visible:ring-offset-0"
          >
            <Link href="/tour" className="flex items-center justify-center gap-3 text-current">
              <LetterSwapForward label="Start tour" reverse={true} triggerParentHover={true}>
                Start tour
              </LetterSwapForward>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full h-12 px-8 text-base font-semibold tracking-wide border border-white/25 bg-white/5 text-white/80 backdrop-blur-sm shadow-none transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:ring-white/30 focus-visible:ring-offset-0"
          >
            <a href="#" className="flex items-center justify-center gap-2 text-current">
              Learn more
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
