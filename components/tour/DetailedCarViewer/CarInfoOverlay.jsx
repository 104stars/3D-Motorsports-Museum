"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { getCarInfo } from "@/lib/tour/carInfo";
import { cn } from "@/lib/utils";

/**
 * Toggleable info panel overlaying the DetailedCarViewer.
 * Shows car name, year, category, historic summary, and top specs.
 */
export default function CarInfoOverlay({ carId }) {
  const t = useTranslations("carInfo");
  const locale = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const carInfo = useMemo(() => (carId ? getCarInfo(carId, locale) : null), [carId, locale]);

  if (!carInfo) return null;

  const topSpecs = useMemo(() => {
    const { engine, power, weight } = carInfo.technical;
    return [
      { label: t("engine"), value: engine },
      { label: t("power"), value: power },
      { label: t("weight"), value: weight },
    ];
  }, [carInfo, t]);

  return (
    <>
      {/* Toggle button */}
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className={cn(
            "absolute top-8 left-8 z-50 p-2.5",
            "rounded-full bg-black/20 backdrop-blur-md",
            "text-black/50 hover:text-black hover:bg-black/30",
            "border border-black/10",
            "transition-colors duration-200",
          )}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Show car information"
        >
          <Info className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>
      )}

      {/* Info panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            className={cn(
              "absolute top-8 left-8 z-50 w-80 max-h-[calc(100vh-6rem)]",
              "rounded-2xl overflow-hidden",
              "bg-black/60 backdrop-blur-xl border border-white/10",
              "text-white shadow-2xl",
            )}
          >
            {/* Header */}
            <div className="flex items-start justify-between p-5 pb-3">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-mono text-[10px] text-blue-400 uppercase tracking-widest bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
                    {carInfo.category}
                  </span>
                  <span className="font-mono text-[10px] text-white/40">{carInfo.year}</span>
                </div>
                <h3 className="font-serif italic text-xl tracking-tight">{carInfo.name}</h3>
                <p className="text-xs text-white/40 font-light mt-0.5">{carInfo.tagline}</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                aria-label="Close info panel"
              >
                <X className="w-4 h-4" strokeWidth={1.5} />
              </button>
            </div>

            {/* Divider */}
            <div className="mx-5 h-px bg-white/10" />

            {/* Scrollable body */}
            <div className="p-5 pt-4 overflow-y-auto max-h-[50vh] custom-scrollbar space-y-5">
              {/* History summary (first paragraph) */}
              <div>
                <h4 className="font-sans text-[10px] uppercase tracking-wider text-white/40 mb-2">
                  {t("history")}
                </h4>
                <p className="text-sm text-white/70 font-light leading-relaxed">
                  {carInfo.historic.content.split("\n\n")[0]}
                </p>
              </div>

              {/* Top specs */}
              <div>
                <h4 className="font-sans text-[10px] uppercase tracking-wider text-white/40 mb-2">
                  {t("keySpecs")}
                </h4>
                <div className="space-y-1.5">
                  {topSpecs.map(({ label, value }) => (
                    <div key={label} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-[11px] text-white/40 uppercase tracking-wider">{label}</span>
                      <span className="text-xs text-white/80 font-mono">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fun fact */}
              {carInfo.facts?.[0] && (
                <div>
                  <h4 className="font-sans text-[10px] uppercase tracking-wider text-white/40 mb-2">
                    {t("didYouKnow")}
                  </h4>
                  <p className="text-sm text-white/60 font-light leading-relaxed italic">
                    "{carInfo.facts[0]}"
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
