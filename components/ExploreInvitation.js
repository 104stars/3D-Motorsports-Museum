"use client";

import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import LetterSwapForward from "@/components/fancy/text/letter-swap-forward-anim";

export default function ExploreInvitation() {
  const t = useTranslations("explore");

  return (
    <section
      id="tour"
      aria-labelledby="tour-heading"
      className="relative isolate overflow-hidden bg-neutral-950"
    >
      {/* Top gradient blend from FeaturedExhibits */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-neutral-950 to-transparent z-10"
      />

      {/* Full-bleed image */}
      <div className="relative w-full min-h-[75vh] lg:min-h-[85vh]">
        <Image
          src="/4.webp"
          alt={t("imageAlt")}
          fill
          className="object-cover brightness-[0.55]"
          priority={false}
        />

        {/* Gradient overlays */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-transparent z-10"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-neutral-950/80 via-transparent to-transparent z-10"
        />

        {/* Content */}
        <div className="relative z-20 flex flex-col justify-end h-full min-h-[75vh] lg:min-h-[85vh] px-6 md:px-12 lg:px-20 pb-20 lg:pb-28">
          <div className="max-w-7xl mx-auto w-full scroll-mt-100">
            <p className="text-neutral-400 text-sm tracking-[0.2em] uppercase font-light mb-5">
              {t("eyebrow")}
            </p>

            <h2 id="tour-heading" className="text-5xl md:text-6xl lg:text-7xl font-light font-sans bg-gradient-to-r from-neutral-50 to-neutral-300 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(133,133,133,0.3)] mb-6 max-w-3xl leading-tight">
              {t("titlePre")}
              <span>{t("titleAccent")}</span>
            </h2>

            <p className="text-neutral-300 text-lg md:text-xl font-extralight max-w-xl mb-10 leading-relaxed">
              {t("description")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full h-12 px-8 text-base font-semibold tracking-wide bg-white text-neutral-950 shadow-[0_18px_45px_-25px_rgba(255,255,255,0.85)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_24px_55px_-25px_rgba(255,255,255,0.9)] focus-visible:ring-white/40 focus-visible:ring-offset-0"
              >
                <Link href="/tour" className="flex items-center justify-center gap-3 text-current">
                  <LetterSwapForward label={t("cta")} reverse={true} triggerParentHover={true}>
                    {t("cta")}
                  </LetterSwapForward>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom fade into page end */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-neutral-950 to-transparent z-10"
      />
    </section>
  );
}
