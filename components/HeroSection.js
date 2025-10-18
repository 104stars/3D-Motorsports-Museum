"use client";

import { Button } from "@/components/ui/button";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

export default function HeroSection() {
  return (
    <section className="relative h-screen w-full overflow-hidden">
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
        <h1 className="text-6xl  font-sans font-light  text-white mb-6 max-w-3xl leading-tight">
          Where Legends of the Track{" "}
          <span className="font-serif italic">Come to Life</span>
        </h1>

        <p className="text-2xl mb-8 max-w-2xl text-neutral-200 font-sans font-extralight">
          Experience the thrill of motorsport legends inside an interactive
          digital space.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            variant="ghost"
            size="lg"
            className="rounded-full text-white border hover:bg-white/10 hover:text-white"
          >
            <a href="#" className="text-white hover:text-white">Learn more</a>
          </Button>
          <Button
            asChild
            size="lg"
            className="bg-white text-black rounded-full hover:bg-white/90"
          >
            <a href="#">
              <LetterSwapForward label="Start tour" reverse={true}>
                Start tour
              </LetterSwapForward>
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
