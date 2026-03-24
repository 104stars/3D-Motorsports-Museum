"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Pause,
  Play,
  SkipForward,
  X,
  ChevronRight,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useNarratedTour } from "./NarratedTourContext";
import { cn } from "@/lib/utils";

export default function NarratedTourHUD() {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const {
    isActive,
    currentStopIndex,
    currentCarInfo,
    totalStops,
    tourState,
    subtitleText,
    isNarrating,
    nextStop,
    skipStop,
    pauseNarration,
    resumeNarration,
    deactivateTour,
    restartTour,
  } = useNarratedTour();

  const t = useTranslations("tour.hud");

  if (!isActive) return null;

  // Tour complete screen
  if (tourState === "finished") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-md text-white"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="h-px w-12 bg-white/20 mb-8" />
          <h2 className="font-serif italic text-4xl md:text-5xl tracking-tight mb-3">
            {t("tourComplete")}
          </h2>
          <p className="text-neutral-400 font-light text-sm tracking-wide mb-10 text-center max-w-sm">
            {t("tourCompleteMessage")}
          </p>
          <div className="flex gap-4">
            <button
              onClick={deactivateTour}
              className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              {t("returnToMuseum")}
            </button>
            <button
              onClick={restartTour}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              {t("restartTour")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const canPause = tourState === "narrating";
  const canResume = tourState === "paused";
  const showNext = tourState === "waiting";
  const progress = totalStops > 0 ? ((currentStopIndex + 1) / totalStops) * 100 : 0;

  return (
    <div className="fixed inset-0 z-[65] pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 p-4 md:p-6 flex items-start justify-between gap-4">
        {/* Left: narrator orb + stop info */}
        <div
          className={cn(
            "pointer-events-auto max-w-[min(30rem,calc(100vw-7rem))]",
            "rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl",
            "px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.35)]",
          )}
        >
          <div className="flex items-center gap-4">
            <NarratorOrbIndicator isNarrating={isNarrating} isPaused={tourState === "paused"} />

            {/* Stop info */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                  {t("stop")} {currentStopIndex + 1} / {totalStops}
                </span>
                {currentCarInfo && (
                  <>
                    <div className="w-px h-3 bg-white/20" />
                    <span className="font-mono text-[10px] text-blue-400/80 uppercase tracking-widest">
                      {currentCarInfo.category}
                    </span>
                  </>
                )}
              </div>
              {currentCarInfo && (
                <h3 className="truncate text-white font-serif italic text-lg tracking-tight mt-0.5">
                  {currentCarInfo.name}
                </h3>
              )}
            </div>
          </div>
          <div className="mt-3 h-px w-full bg-white/10 overflow-hidden rounded-full">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-blue-400/70 via-blue-300/80 to-white/70"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.35, ease: "easeOut" }}
            />
          </div>
        </div>

        {/* Right: exit */}
        <motion.button
          onClick={() => setShowExitConfirm(true)}
          className={cn(
            "pointer-events-auto p-3 rounded-full",
            "bg-black/40 backdrop-blur-xl text-white/70 hover:text-white hover:bg-black/[0.55]",
            "border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-colors duration-200",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Exit tour"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Exit confirmation modal */}
      <AnimatePresence>
        {showExitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-neutral-950/80 backdrop-blur-md pointer-events-auto"
            onClick={() => setShowExitConfirm(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center px-8 max-w-xs mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="h-px w-10 bg-white/20 mb-6" />
              <h3 className="font-serif italic text-2xl text-white tracking-tight mb-2">
                {t("exitConfirmTitle")}
              </h3>
              <p className="text-neutral-400 font-light text-sm tracking-wide leading-relaxed mb-8">
                {t("exitConfirmMessage")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    deactivateTour();
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
                >
                  {t("exitTour")}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom bar: controls + subtitles */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 via-black/25 to-transparent" />
        <div className="relative px-4 pb-4 md:px-6 md:pb-6">
          <div
            className={cn(
              "pointer-events-auto mx-auto w-full max-w-[min(96vw,1800px)]",
              "rounded-[28px] border border-white/10 bg-black/70 backdrop-blur-2xl",
              "shadow-[0_24px_80px_rgba(0,0,0,0.45)]",
              "px-4 py-4 md:px-6 md:py-5",
            )}
          >
            <div className="flex flex-col gap-4 md:gap-5">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/[0.5]">
                    <span>{t("stop")} {currentStopIndex + 1} / {totalStops}</span>
                    {currentCarInfo?.category && (
                      <>
                        <span className="h-3.5 w-px bg-white/15" />
                        <span className="truncate text-blue-300/[0.9]">
                          {currentCarInfo.category}
                        </span>
                      </>
                    )}
                  </div>
                  {currentCarInfo && (
                    <p className="mt-1.5 truncate font-serif text-xl italic tracking-tight text-white/[0.95] md:text-2xl">
                      {currentCarInfo.name}
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-2 md:justify-end md:gap-3">
                  {canPause && (
                    <ControlButton
                      onClick={pauseNarration}
                      icon={Pause}
                      label={t("pause")}
                    />
                  )}
                  {canResume && (
                    <ControlButton
                      onClick={resumeNarration}
                      icon={Play}
                      label={t("resume")}
                      emphasis
                    />
                  )}

                  {(canPause || canResume) && (
                    <ControlButton
                      onClick={skipStop}
                      icon={SkipForward}
                      label={t("skip")}
                    />
                  )}

                  {showNext && (
                    <motion.button
                      onClick={nextStop}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "flex h-12 items-center gap-2 rounded-2xl px-4 md:px-5",
                        "bg-white text-black text-sm font-medium",
                        "shadow-[0_8px_30px_rgba(255,255,255,0.15)]",
                        "hover:bg-white/90 transition-colors",
                      )}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                    >
                      {currentStopIndex < totalStops - 1 ? t("nextExhibit") : t("finishTour")}
                      <ChevronRight className="w-4 h-4" />
                    </motion.button>
                  )}
                </div>
              </div>

              <div className="rounded-[22px] border border-white/[0.06] bg-white/[0.045] px-4 py-3 md:px-5 md:py-4 w-full">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={subtitleText ? subtitleText.slice(0, 40) : `${currentStopIndex}-${tourState}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28 }}
                    className="min-h-[4.5rem] md:min-h-[5rem] flex items-center w-full"
                  >
                    <p className="w-full text-sm font-light leading-7 text-white/90 md:text-base md:leading-8">
                      {subtitleText || ""}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function NarratorOrbIndicator({ isNarrating, isPaused }) {
  return (
    <div className="relative w-12 h-12 flex items-center justify-center">
      {/* Outer pulse ring — only when narrating */}
      {isNarrating && (
        <motion.div
          className="absolute inset-0 rounded-full bg-blue-400/20"
          animate={{ scale: [1, 1.6, 1], opacity: [0.4, 0, 0.4] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
      )}

      {/* Middle glow ring */}
      <div
        className={cn(
          "absolute inset-1 rounded-full transition-all duration-500",
          isNarrating
            ? "bg-blue-400/15 shadow-[0_0_20px_4px_rgba(96,165,250,0.3)]"
            : isPaused
              ? "bg-blue-400/8"
              : "bg-white/5",
        )}
      />

      {/* Core orb */}
      <motion.div
        className={cn(
          "relative w-5 h-5 rounded-full transition-colors duration-300",
          isNarrating
            ? "bg-blue-400 shadow-[0_0_12px_2px_rgba(96,165,250,0.6)]"
            : isPaused
              ? "bg-blue-400/50"
              : "bg-white/20",
        )}
        animate={
          isNarrating
            ? { scale: [1, 1.2, 1] }
            : { scale: 1 }
        }
        transition={
          isNarrating
            ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      />
    </div>
  );
}

function ControlButton({ onClick, icon: Icon, label, emphasis = false }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "flex h-12 items-center gap-2 rounded-2xl px-3.5 md:px-4",
        "backdrop-blur-xl border transition-colors duration-200",
        emphasis
          ? "bg-white text-black border-white/70 hover:bg-white/90"
          : "bg-white/10 text-white/[0.82] border-white/10 hover:text-white hover:bg-white/[0.18]",
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={2} />
      <span className="hidden text-sm font-medium md:inline">{label}</span>
    </motion.button>
  );
}
