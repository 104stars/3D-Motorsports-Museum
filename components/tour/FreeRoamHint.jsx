"use client";

import { useTranslations } from "next-intl";

export default function FreeRoamHint({ isVisible }) {
  const t = useTranslations("tour.freeRoamHud");

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
      <span
        className="text-white/30 text-xs font-mono tracking-widest uppercase"
        aria-label={t("pauseHintA11y")}
      >
        <span aria-hidden="true">
          {t("pressEsc")}{" "}
          <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 mx-0.5 text-neutral-400 normal-case tracking-normal">
            {t("escKey")}
          </kbd>{" "}
          {t("toOpenPauseMenu")}
        </span>
      </span>
    </div>
  );
}
