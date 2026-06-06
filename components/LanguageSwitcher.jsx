"use client";

import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { cn } from "@/lib/utils";

export default function LanguageSwitcher({ className, variant = "default", groupLabel = "Language" }) {
  const locale = useLocale();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const switchLocale = (newLocale) => {
    if (newLocale === locale) return;
    document.cookie = `NEXT_LOCALE=${newLocale};path=/;max-age=${365 * 24 * 60 * 60}`;
    startTransition(() => {
      router.refresh();
    });
  };

  const isCompact = variant === "compact";

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className={cn(
        "flex items-center rounded-full border transition-opacity",
        isCompact
          ? "gap-0 border-white/10 bg-white/5"
          : "gap-0 border-white/15 bg-white/5 backdrop-blur-sm",
        isPending && "opacity-60 pointer-events-none",
        className,
      )}
      aria-busy={isPending}
    >
      {/* Announce locale changes to screen readers */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {isPending ? (locale === "en" ? "Switching language" : "Cambiando idioma") : ""}
      </span>
      <button
        onClick={() => switchLocale("en")}
        aria-pressed={locale === "en"}
        aria-label="English"
        lang="en"
        className={cn(
          "font-mono text-xs tracking-wider uppercase transition-colors px-3 py-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
          locale === "en"
            ? "bg-white text-black font-semibold"
            : "text-white/50 hover:text-white",
        )}
      >
        EN
      </button>
      <button
        onClick={() => switchLocale("es")}
        aria-pressed={locale === "es"}
        aria-label="Español"
        lang="es"
        className={cn(
          "font-mono text-xs tracking-wider uppercase transition-colors px-3 py-1.5 rounded-full focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
          locale === "es"
            ? "bg-white text-black font-semibold"
            : "text-white/50 hover:text-white",
        )}
      >
        ES
      </button>
    </div>
  );
}
