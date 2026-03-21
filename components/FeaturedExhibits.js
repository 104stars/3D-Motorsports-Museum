"use client";

import { ExhibitCard } from "@/components/ui/ExhibitCard";
import { useTranslations } from "next-intl";

export default function FeaturedExhibits() {
  const t = useTranslations("exhibits");

  const exhibits = [
    { id: 1, key: "f1", image: "/1.webp" },
    { id: 2, key: "lemans", image: "/2.webp" },
    { id: 3, key: "rally", image: "/3.webp" },
  ];

  return (
    <section className="relative isolate overflow-hidden bg-neutral-950 pt-52 pb-24 px-6 md:px-12 lg:px-20">
      {/* Top blend gradient into hero */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-950 to-transparent z-0"
      />
      {/* Subtle background grid + vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(85%_90%_at_50%_10%,black,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      {/* Section Heading */}
      <div className="max-w-7xl mx-auto mb-12">
        <h2 className="text-5xl md:text-6xl font-light mb-3 font-sans bg-gradient-to-r from-neutral-50 to-neutral-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(133,133,133,0.25)]">
          {t("title")}
        </h2>

        <p className="text-neutral-400 text-lg font-light max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {exhibits.map((exhibit) => (
          <ExhibitCard
            key={exhibit.id}
            title={t(`cards.${exhibit.key}.title`)}
            description={t(`cards.${exhibit.key}.description`)}
            image={exhibit.image}
            tags={[t(`cards.${exhibit.key}.tags.0`), t(`cards.${exhibit.key}.tags.1`)]}
          />
        ))}
      </div>
    </section>
  );
}
