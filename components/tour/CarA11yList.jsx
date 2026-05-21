"use client";

import { useLocale, useTranslations } from "next-intl";
import { CAR_CONFIGS } from "@/lib/tour/carConfig";
import { getCarInfo } from "@/lib/tour/carInfo";
import { announceA11y } from "./A11yAnnouncer";

/**
 * Visually-hidden accessible list of car exhibits.
 *
 * Screen reader and keyboard-only users cannot interact with the 3D canvas
 * directly (raycasting requires mouse-driven pointer lock). This component
 * mirrors every car in CAR_CONFIGS as a focusable HTML <button> so AT users
 * can tab through exhibits and activate them with Enter/Space — opening the
 * same CarInformationPanel that mouse users get.
 *
 * Rendered outside the WebGL canvas. Becomes visible briefly on focus so
 * sighted keyboard users get an indicator of which exhibit they're on.
 */
export default function CarA11yList({ onSelect, disabled }) {
  const locale = useLocale();
  const t = useTranslations("tour.a11y");

  if (disabled) return null;

  const handleActivate = (id, name) => {
    onSelect?.(id);
    announceA11y(t("openingExhibit", { name }));
  };

  return (
    <nav data-a11y-list aria-label={t("exhibitList")} className="sr-only focus-within:not-sr-only fixed top-4 left-4 z-[55]">
      <ul className="bg-black/90 backdrop-blur-md rounded-2xl p-4 border border-white/10 flex flex-col gap-2 max-w-sm">
        <li className="text-xs font-mono uppercase tracking-widest text-white/50 mb-1">
          {t("exhibitListHeading")}
        </li>
        {CAR_CONFIGS.map((car) => {
          const info = getCarInfo(car.id, locale);
          const name = info?.name || car.name;
          const category = info?.category || "";
          const description = info?.tagline || "";
          return (
            <li key={car.id}>
              <button
                type="button"
                onClick={() => handleActivate(car.id, name)}
                className="w-full text-left px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none transition-colors"
                aria-label={t("viewExhibit", { name, category })}
                aria-describedby={`a11y-car-desc-${car.id}`}
              >
                <span className="block font-serif italic text-white text-sm">
                  {name}
                </span>
                {category && (
                  <span className="block font-mono text-[10px] uppercase tracking-wider text-blue-300/80 mt-0.5">
                    {category}
                  </span>
                )}
                <span id={`a11y-car-desc-${car.id}`} className="sr-only">
                  {description}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
