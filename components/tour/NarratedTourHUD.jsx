"use client";

import { motion, AnimatePresence } from "motion/react";
import {
  Pause,
  Play,
  SkipForward,
  X,
  ChevronRight,
} from "lucide-react";
import { useNarratedTour } from "./NarratedTourContext";
import { cn } from "@/lib/utils";

export default function NarratedTourHUD() {
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
            Tour Complete
          </h2>
          <p className="text-neutral-400 font-light text-sm tracking-wide mb-10 text-center max-w-sm">
            Thank you for experiencing the Motorsports Museum collection.
          </p>
          <div className="flex gap-4">
            <button
              onClick={deactivateTour}
              className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
            >
              Return to Museum
            </button>
            <button
              onClick={restartTour}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors"
            >
              Restart Tour
            </button>
          </div>
        </motion.div>
      </motion.div>
    );
  }

  const canPause = tourState === "narrating";
  const canResume = tourState === "paused";
  const showNext = tourState === "waiting";

  return (
    <div className="fixed inset-0 z-[65] pointer-events-none">
      {/* Top bar */}
      <div className="absolute top-0 inset-x-0 p-6 flex items-start justify-between pointer-events-auto">
        {/* Left: narrator orb + stop info */}
        <div className="flex items-center gap-4">
          <NarratorOrbIndicator isNarrating={isNarrating} isPaused={tourState === "paused"} />

          {/* Stop info */}
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                Stop {currentStopIndex + 1} / {totalStops}
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
              <h3 className="text-white font-serif italic text-lg tracking-tight mt-0.5">
                {currentCarInfo.name}
              </h3>
            )}
          </div>
        </div>

        {/* Right: exit */}
        <motion.button
          onClick={deactivateTour}
          className={cn(
            "p-2.5 rounded-full",
            "bg-black/20 backdrop-blur-md text-white/50 hover:text-white hover:bg-black/40",
            "border border-white/10 transition-colors duration-200",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Exit tour"
        >
          <X className="w-5 h-5" strokeWidth={1.5} />
        </motion.button>
      </div>

      {/* Bottom bar: controls + subtitles */}
      <div className="absolute bottom-0 inset-x-0 p-6 flex flex-col items-center gap-4 pointer-events-auto">
        {/* Subtitle */}
        <AnimatePresence mode="wait">
          {subtitleText && (
            <motion.div
              key={subtitleText.slice(0, 30)}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl text-center"
            >
              <p className="text-white/80 text-sm md:text-base font-light leading-relaxed bg-black/40 backdrop-blur-md rounded-xl px-6 py-3 border border-white/5">
                {subtitleText}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center gap-3">
          {/* Pause / Resume */}
          {canPause && (
            <ControlButton
              onClick={pauseNarration}
              icon={Pause}
              label="Pause"
            />
          )}
          {canResume && (
            <ControlButton
              onClick={resumeNarration}
              icon={Play}
              label="Resume"
            />
          )}

          {/* Skip */}
          {(canPause || canResume) && (
            <ControlButton
              onClick={skipStop}
              icon={SkipForward}
              label="Skip"
            />
          )}

          {/* Next (shown when narration is done) */}
          {showNext && (
            <motion.button
              onClick={nextStop}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className={cn(
                "flex items-center gap-2 px-5 py-2.5 rounded-xl",
                "bg-white text-black text-sm font-medium",
                "hover:bg-white/90 transition-colors",
              )}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {currentStopIndex < totalStops - 1 ? "Next Exhibit" : "Finish Tour"}
              <ChevronRight className="w-4 h-4" />
            </motion.button>
          )}
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

function ControlButton({ onClick, icon: Icon, label }) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "p-3 rounded-xl",
        "bg-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-white/20",
        "border border-white/10 transition-colors duration-200",
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <Icon className="w-4 h-4" strokeWidth={2} />
    </motion.button>
  );
}
