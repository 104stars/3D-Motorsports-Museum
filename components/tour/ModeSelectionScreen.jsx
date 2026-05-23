"use client";

import { useRef } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Compass, Headphones, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15, delayChildren: 0.3 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.4, ease: "easeInOut" },
  },
};

const reducedContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 28 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

export default function ModeSelectionScreen({ isVisible, onFreeRoam, onNarratedTour }) {
  const t = useTranslations("tour.modeSelection");
  const tA11y = useTranslations("tour.a11y");
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  useFocusTrap(containerRef, isVisible);

  const activeContainerVariants = shouldReduceMotion ? reducedContainerVariants : containerVariants;
  const activeItemVariants = shouldReduceMotion ? reducedItemVariants : itemVariants;

  return (
    <AnimatePresence mode="wait">
      {isVisible && (
        <motion.div
          key="mode-select"
          ref={containerRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="mode-select-heading"
          variants={activeContainerVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[99] flex flex-col items-center justify-center bg-neutral-950 text-white"
        >
          {/* Top accent line */}
          <motion.div variants={activeItemVariants} className="h-px w-16 bg-white/20 mb-10" aria-hidden="true" />

          {/* Heading */}
          <motion.h1
            id="mode-select-heading"
            variants={activeItemVariants}
            className="font-serif italic text-5xl md:text-7xl tracking-tighter text-center mb-4 drop-shadow-2xl"
          >
            {t("title")}
          </motion.h1>

          <motion.p
            variants={activeItemVariants}
            className="text-neutral-400 font-light text-base md:text-lg tracking-wide mb-14 text-center max-w-md"
          >
            {t("subtitle")}
          </motion.p>

          {/* Mode cards */}
          <motion.div
            variants={activeItemVariants}
            className="flex flex-col md:flex-row gap-5 w-full max-w-2xl px-6"
          >
            <ModeCard
              icon={Compass}
              title={t("freeRoam")}
              description={t("freeRoamDesc")}
              enterLabel={t("enter")}
              onClick={onFreeRoam}
              ariaDescription={tA11y("freeRoamMouseNote")}
            />
            <ModeCard
              icon={Headphones}
              title={t("narratedTour")}
              description={t("narratedTourDesc")}
              enterLabel={t("enter")}
              onClick={onNarratedTour}
              accent
            />
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={activeItemVariants}
            className="mt-14 flex items-center gap-2 text-white/20 text-xs font-mono tracking-widest uppercase"
          >
            <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
            {t("footer")}
            <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ModeCard({ icon: Icon, title, description, enterLabel, onClick, accent = false, ariaDescription }) {
  const descId = ariaDescription ? `mode-card-desc-${title.replace(/\s+/g, "-")}` : undefined;
  return (
    <motion.button
      onClick={onClick}
      aria-describedby={descId}
      className={cn(
        "group relative flex-1 flex flex-col items-start text-left p-8 rounded-2xl",
        "border transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
        accent
          ? "border-white/20 bg-white/5 hover:bg-white/10 hover:border-white/30"
          : "border-white/10 bg-transparent hover:bg-white/5 hover:border-white/20",
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {ariaDescription && (
        <span id={descId} className="sr-only">{ariaDescription}</span>
      )}
      {/* Icon */}
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors",
          accent
            ? "bg-white text-black"
            : "bg-white/5 text-white/70 group-hover:bg-white/10 group-hover:text-white",
        )}
        aria-hidden="true"
      >
        <Icon className="w-6 h-6" strokeWidth={1.5} />
      </div>

      {/* Text */}
      <h3 className="text-xl font-medium tracking-wide mb-2">{title}</h3>
      <p className="text-sm text-neutral-400 font-light leading-relaxed mb-6">
        {description}
      </p>

      {/* CTA hint */}
      <div className="mt-auto flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-white/40 group-hover:text-white/70 transition-colors">
        {enterLabel}
        <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </div>
    </motion.button>
  );
}
