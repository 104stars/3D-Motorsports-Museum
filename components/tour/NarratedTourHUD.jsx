"use client";

import { forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Pause,
  Play,
  SkipForward,
  X,
  ChevronRight,
  ChevronLeft,
  ChevronUp,
  RotateCcw,
  Volume2,
  VolumeX,
  BookOpen,
  LayoutList,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useNarratedTour } from "./NarratedTourContext";
import { NARRATION_ROUTE } from "@/lib/tour/narrationRoute";
import { getCarInfo } from "@/lib/tour/carInfo";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function NarratedTourHUD({ onViewDetails }) {
  const [showExitConfirm, setShowExitConfirm] = useState(false);

  const {
    isActive,
    currentStopIndex,
    currentCarInfo,
    currentCarId,
    totalStops,
    tourState,
    subtitleText,
    isNarrating,
    isMuted,
    canGoBack,
    nextStop,
    skipStop,
    pauseNarration,
    resumeNarration,
    deactivateTour,
    restartTour,
    previousStop,
    goToStop,
    replayCurrentStop,
    toggleMute,
  } = useNarratedTour();

  const t = useTranslations("tour.hud");
  const tA11y = useTranslations("tour.a11y");
  const locale = useLocale();
  const exitDialogRef = useRef(null);
  const completionFocusRef = useRef(null);
  const primaryControlRef = useRef(null);
  const muteToggleRef = useRef(null);
  const focusOnStartHandledRef = useRef(false);
  useFocusTrap(exitDialogRef, showExitConfirm);

  useEffect(() => {
    if (tourState === "finished" && completionFocusRef.current) {
      completionFocusRef.current.focus();
    }
  }, [tourState]);

  // Move focus into the HUD the first time the tour reaches an interactive
  // state. Keyboard users would otherwise have to blind-Tab to find controls.
  useEffect(() => {
    if (!isActive) {
      focusOnStartHandledRef.current = false;
      return;
    }
    if (focusOnStartHandledRef.current) return;
    if (tourState !== "narrating" && tourState !== "waiting") return;
    if (showExitConfirm) return;

    const id = requestAnimationFrame(() => {
      // Focus the mute toggle first — tour starts muted by default, so this
      // is the most immediately relevant control for all users.
      (muteToggleRef.current ?? primaryControlRef.current)?.focus();
      focusOnStartHandledRef.current = true;
    });
    return () => cancelAnimationFrame(id);
  }, [isActive, tourState, showExitConfirm]);

  if (!isActive) return null;

  const nextCarId = NARRATION_ROUTE[currentStopIndex + 1];
  const nextCarInfo = nextCarId ? getCarInfo(nextCarId, locale) : null;
  const prevCarId = NARRATION_ROUTE[currentStopIndex - 1];
  const prevCarInfo = prevCarId ? getCarInfo(prevCarId, locale) : null;

  // Tour complete screen
  if (tourState === "finished") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-[70] flex flex-col items-center justify-center bg-neutral-950/90 backdrop-blur-md text-white"
        role="dialog"
        aria-modal="true"
        aria-labelledby="tour-complete-heading"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center"
        >
          <div className="h-px w-12 bg-white/20 mb-8" aria-hidden="true" />
          <h2 id="tour-complete-heading" className="font-serif italic text-4xl md:text-5xl tracking-tight mb-3">
            {t("tourComplete")}
          </h2>
          <p className="text-neutral-400 font-light text-sm tracking-wide mb-10 text-center max-w-sm">
            {t("tourCompleteMessage")}
          </p>
          <div className="flex gap-4">
            <button
              ref={completionFocusRef}
              onClick={deactivateTour}
              className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
            >
              {t("returnToMuseum")}
            </button>
            <button
              onClick={restartTour}
              className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
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
        {/* Left: narrator orb + stop info (visual duplicate of bottom bar — hidden from AT) */}
        <div
          aria-hidden="true"
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
                <TourStopPicker
                  currentStopIndex={currentStopIndex}
                  totalStops={totalStops}
                  locale={locale}
                  onSelectStop={goToStop}
                  className="text-[10px] tracking-widest text-white/40 hover:text-white/60"
                />
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

        {/* SR-only progress indicator (top bar is aria-hidden because it duplicates the bottom bar visually) */}
        <div
          className="sr-only"
          role="progressbar"
          aria-valuenow={currentStopIndex + 1}
          aria-valuemin={1}
          aria-valuemax={totalStops}
          aria-label={tA11y("tourProgress", { current: currentStopIndex + 1, total: totalStops })}
        />

        {/* Right: car list + view details + exit */}
        <div className="flex items-center gap-2">
          <CarListDropdown
            currentStopIndex={currentStopIndex}
            totalStops={totalStops}
            locale={locale}
            onSelectStop={goToStop}
          />
          {onViewDetails && currentCarInfo && (
            <motion.button
              onClick={() => onViewDetails(currentCarId)}
              className={cn(
                "pointer-events-auto p-3 rounded-full",
                "bg-black/40 backdrop-blur-xl text-white/70 hover:text-white hover:bg-black/[0.55]",
                "border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-colors duration-200",
                "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
              )}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={tA11y("viewDetailsFor", { name: currentCarInfo.name })}
            >
              <BookOpen className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
            </motion.button>
          )}
          <motion.button
            onClick={() => setShowExitConfirm(true)}
            className={cn(
              "pointer-events-auto p-3 rounded-full",
              "bg-black/40 backdrop-blur-xl text-white/70 hover:text-white hover:bg-black/[0.55]",
              "border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
            )}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={t("exitTour")}
          >
            <X className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
          </motion.button>
        </div>
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
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-confirm-heading"
          >
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col items-center text-center px-8 max-w-xs mx-4"
              onClick={(e) => e.stopPropagation()}
              ref={exitDialogRef}
            >
              <div className="h-px w-10 bg-white/20 mb-6" aria-hidden="true" />
              <h3 id="exit-confirm-heading" className="font-serif italic text-2xl text-white tracking-tight mb-2">
                {t("exitConfirmTitle")}
              </h3>
              <p className="text-neutral-400 font-light text-sm tracking-wide leading-relaxed mb-8">
                {t("exitConfirmMessage")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowExitConfirm(false)}
                  className="px-6 py-3 rounded-xl bg-white/10 border border-white/20 text-white text-sm font-medium hover:bg-white/20 transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={() => {
                    setShowExitConfirm(false);
                    deactivateTour();
                  }}
                  className="px-6 py-3 rounded-xl bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
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
                <div className="min-w-0" aria-live="polite" aria-atomic="true">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-white/[0.5]">
                    <TourStopPicker
                      currentStopIndex={currentStopIndex}
                      totalStops={totalStops}
                      locale={locale}
                      onSelectStop={goToStop}
                    />
                    {currentCarInfo?.category && (
                      <>
                        <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />
                        <span className="truncate text-blue-300/[0.9]">
                          {currentCarInfo.category}
                        </span>
                      </>
                    )}
                    {isMuted && (
                      <>
                        <span className="h-3.5 w-px bg-white/15" aria-hidden="true" />
                        <span className="flex items-center gap-1 text-amber-300/[0.85]">
                          <VolumeX className="w-3 h-3" strokeWidth={2} aria-hidden="true" />
                          {t("textOnly")}
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
                  <ControlButton
                    ref={muteToggleRef}
                    onClick={toggleMute}
                    icon={isMuted ? VolumeX : Volume2}
                    label={isMuted ? t("unmuteNarrator") : t("muteNarrator")}
                    ariaLabel={tA11y("toggleMuteNarrator")}
                    ariaPressed={isMuted}
                  />

                  {canGoBack && tourState !== "narrating" && (
                    <ControlButton
                      onClick={previousStop}
                      icon={ChevronLeft}
                      label={t("previous")}
                      ariaLabel={
                        prevCarInfo
                          ? tA11y("previousExhibit", { name: prevCarInfo.name })
                          : t("previous")
                      }
                    />
                  )}

                  {canPause && (
                    <ControlButton
                      ref={primaryControlRef}
                      onClick={pauseNarration}
                      icon={Pause}
                      label={t("pause")}
                    />
                  )}
                  {canResume && (
                    <ControlButton
                      ref={primaryControlRef}
                      onClick={resumeNarration}
                      icon={Play}
                      label={t("resume")}
                      emphasis
                    />
                  )}

                  <ControlButton
                    onClick={replayCurrentStop}
                    icon={RotateCcw}
                    label={t("replay")}
                    ariaLabel={
                      currentCarInfo
                        ? tA11y("replayStop", { name: currentCarInfo.name })
                        : t("replay")
                    }
                  />

                  {(canPause || canResume) && (
                    <ControlButton
                      onClick={skipStop}
                      icon={SkipForward}
                      label={t("skip")}
                    />
                  )}

                  {showNext && (
                    <motion.button
                      ref={primaryControlRef}
                      onClick={nextStop}
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={cn(
                        "flex h-12 items-center gap-2 rounded-2xl px-4 md:px-5",
                        "bg-white text-black text-sm font-medium",
                        "shadow-[0_8px_30px_rgba(255,255,255,0.15)]",
                        "hover:bg-white/90 transition-colors",
                        "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
                      )}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      aria-label={
                        currentStopIndex < totalStops - 1
                          ? (nextCarInfo
                              ? `${t("nextExhibit")}: ${nextCarInfo.name}`
                              : t("nextExhibit"))
                          : t("finishTour")
                      }
                    >
                      {currentStopIndex < totalStops - 1 ? t("nextExhibit") : t("finishTour")}
                      <ChevronRight className="w-4 h-4" aria-hidden="true" />
                    </motion.button>
                  )}
                </div>
              </div>

              <div
                className="rounded-[22px] border border-white/[0.06] bg-white/[0.045] px-4 py-3 md:px-5 md:py-4 w-full"
                aria-live="polite"
                aria-atomic="true"
              >
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

// Shared item used by both TourStopPicker and CarListDropdown
function StopListItem({ index, totalStops, carId, info, isCurrent, onSelect, tA11y }) {
  return (
    <DropdownMenuItem
      onSelect={onSelect}
      aria-current={isCurrent ? "true" : undefined}
      aria-label={tA11y("goToStop", { number: index + 1, name: info?.name ?? carId })}
      className={cn(
        "cursor-pointer rounded-lg px-3 py-2 outline-none",
        "text-white focus:bg-white/10 data-[highlighted]:bg-white/10 data-[highlighted]:text-white",
        isCurrent && "bg-white/[0.06]",
      )}
    >
      <span className="flex items-center gap-3 w-full min-w-0">
        {/* Stop number */}
        <span
          className="shrink-0 w-5 font-mono text-[10px] tabular-nums text-right text-white/35 select-none leading-none"
          aria-hidden="true"
        >
          {index + 1}
        </span>
        {/* Car name + category */}
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate font-serif text-sm italic leading-snug">
            {info?.name ?? carId}
          </span>
          {info?.category && (
            <span className="font-mono text-[10px] uppercase tracking-wider text-blue-300/70">
              {info.category}
            </span>
          )}
        </span>
        {/* Current-stop accent dot */}
        {isCurrent && (
          <span className="shrink-0 ml-1 w-1.5 h-1.5 rounded-full bg-blue-400/80" aria-hidden="true" />
        )}
      </span>
    </DropdownMenuItem>
  );
}

// Shared dropdown content styles
const DROPDOWN_CONTENT_CLASS = cn(
  "z-[80] min-w-[15rem] max-h-[min(55vh,22rem)] overflow-y-auto",
  "rounded-xl border border-white/10 bg-black/90 backdrop-blur-xl p-1.5",
  "text-white shadow-[0_16px_40px_rgba(0,0,0,0.5)]",
);

function focusCurrentOnOpen(e) {
  e.preventDefault();
  const current = e.currentTarget?.querySelector('[aria-current="true"]');
  if (current) {
    current.focus();
    current.scrollIntoView({ block: "nearest" });
  }
}

function TourStopPicker({ currentStopIndex, totalStops, locale, onSelectStop, className }) {
  const t = useTranslations("tour.hud");
  const tA11y = useTranslations("tour.a11y");

  const stops = useMemo(
    () =>
      NARRATION_ROUTE.map((carId, index) => ({
        index,
        carId,
        info: getCarInfo(carId, locale),
      })),
    [locale],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex items-center gap-1 rounded-md font-mono uppercase",
            "hover:text-white/80 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
            "transition-colors",
            className,
          )}
          aria-label={tA11y("jumpToStopMenu", { current: currentStopIndex + 1, total: totalStops })}
          aria-haspopup="menu"
        >
          <span aria-hidden="true">
            {t("stop")} {currentStopIndex + 1} / {totalStops}
          </span>
          <ChevronUp className="w-3 h-3 shrink-0 opacity-70" strokeWidth={2} aria-hidden="true" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align="start"
        sideOffset={8}
        aria-label={t("jumpToStop")}
        onOpenAutoFocus={focusCurrentOnOpen}
        className={DROPDOWN_CONTENT_CLASS}
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/40" aria-hidden="true">
          {t("jumpToStop")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {stops.map(({ index, carId, info }) => (
          <StopListItem
            key={carId}
            index={index}
            totalStops={totalStops}
            carId={carId}
            info={info}
            isCurrent={index === currentStopIndex}
            onSelect={() => onSelectStop(index)}
            tA11y={tA11y}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function CarListDropdown({ currentStopIndex, totalStops, locale, onSelectStop }) {
  const t = useTranslations("tour.hud");
  const tA11y = useTranslations("tour.a11y");

  const stops = useMemo(
    () =>
      NARRATION_ROUTE.map((carId, index) => ({
        index,
        carId,
        info: getCarInfo(carId, locale),
      })),
    [locale],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <motion.button
          type="button"
          className={cn(
            "pointer-events-auto p-3 rounded-full",
            "bg-black/40 backdrop-blur-xl text-white/70 hover:text-white hover:bg-black/[0.55]",
            "border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.28)] transition-colors duration-200",
            "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
          )}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label={tA11y("carListMenu", { current: currentStopIndex + 1, total: totalStops })}
          aria-haspopup="menu"
        >
          <LayoutList className="w-5 h-5" strokeWidth={1.5} aria-hidden="true" />
        </motion.button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="bottom"
        align="end"
        sideOffset={8}
        aria-label={t("carList")}
        onOpenAutoFocus={focusCurrentOnOpen}
        className={DROPDOWN_CONTENT_CLASS}
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-mono uppercase tracking-widest text-white/40" aria-hidden="true">
          {t("carList")}
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-white/10" />
        {stops.map(({ index, carId, info }) => (
          <StopListItem
            key={carId}
            index={index}
            totalStops={totalStops}
            carId={carId}
            info={info}
            isCurrent={index === currentStopIndex}
            onSelect={() => onSelectStop(index)}
            tA11y={tA11y}
          />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NarratorOrbIndicator({ isNarrating, isPaused }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="relative w-12 h-12 flex items-center justify-center" aria-hidden="true">
      {/* Outer pulse ring — only when narrating */}
      {isNarrating && !shouldReduceMotion && (
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
          isNarrating && !shouldReduceMotion
            ? { scale: [1, 1.2, 1] }
            : { scale: 1 }
        }
        transition={
          isNarrating && !shouldReduceMotion
            ? { duration: 0.8, repeat: Infinity, ease: "easeInOut" }
            : { duration: 0.3 }
        }
      />
    </div>
  );
}

const ControlButton = forwardRef(function ControlButton(
  { onClick, icon: Icon, label, emphasis = false, ariaLabel, ariaPressed },
  ref,
) {
  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      className={cn(
        "flex h-12 items-center gap-2 rounded-2xl px-3.5 md:px-4",
        "backdrop-blur-xl border transition-colors duration-200",
        "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
        emphasis
          ? "bg-white text-black border-white/70 hover:bg-white/90"
          : "bg-white/10 text-white/[0.82] border-white/10 hover:text-white hover:bg-white/[0.18]",
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={ariaLabel || label}
      aria-pressed={ariaPressed}
    >
      <Icon className="w-4 h-4 shrink-0" strokeWidth={2} aria-hidden="true" />
      <span className="hidden text-sm font-medium md:inline" aria-hidden="true">{label}</span>
    </motion.button>
  );
});
