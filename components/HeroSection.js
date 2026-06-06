"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

export default function HeroSection() {
  const t = useTranslations("hero");
  const videoRef = useRef(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches && videoRef.current) {
      videoRef.current.pause();
    }
  }, []);

  return (
    <section
      className="relative h-screen w-full overflow-hidden bg-black"
      aria-labelledby="hero-heading"
    >
      {/* Background Video — decorative, no content value */}
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        suppressHydrationWarning
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/landingVideo.mp4" type="video/mp4" />
      </video>

      {/* Dark Overlay */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-neutral-950 from-0% to-neutral-950/10 to-100%" />

      {/* Hero Content */}
      <div className="relative z-10 flex flex-col justify-end h-full text-left pl-30 pb-26">
        <h1 id="hero-heading" className="text-4xl md:text-5xl font-sans italic font-light text-white mb-6 max-w-xl leading-tight">
          {t("headlinePre")}
          <span className="font-serif italic">{t("headlineAccent")}</span>
        </h1>

        <p className="text-lg md:text-xl mb-8 max-w-lg text-neutral-200 font-sans font-extralight">
          {t("subtitle")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            asChild
            size="lg"
            className="rounded-full h-12 px-8 text-base font-semibold tracking-wide bg-white text-neutral-950 shadow-[0_18px_45px_-25px_rgba(255,255,255,0.85)] transition-transform duration-300 motion-safe:hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_24px_55px_-25px_rgba(255,255,255,0.9)] focus-visible:ring-white/40 focus-visible:ring-offset-0"
          >
            <Link href="/tour" className="flex items-center justify-center gap-3 text-current">
              <LetterSwapForward label={t("ctaTour")} reverse={true} triggerParentHover={true}>
                {t("ctaTour")}
              </LetterSwapForward>
            </Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="ghost"
            className="rounded-full h-12 px-8 text-base font-semibold tracking-wide border border-white/25 bg-white/5 text-white/80 backdrop-blur-sm shadow-none transition-colors duration-300 hover:bg-white/10 hover:text-white focus-visible:ring-white/30 focus-visible:ring-offset-0"
          >
            <a
              href="#about"
              aria-label={t("ctaLearnLabel")}
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById("about");
                if (!el) return;
                el.scrollIntoView({ behavior: "smooth" });
                el.setAttribute("tabindex", "-1");
                el.focus({ preventScroll: true });
              }}
              className="flex items-center justify-center gap-2 text-current"
            >
              {t("ctaLearn")}
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
