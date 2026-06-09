"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import {
  Landmark,
  Move,
  MousePointer2,
  Eye,
  MousePointerClick,
  Layers,
  Pause,
  ChevronLeft,
  ChevronRight,
  Check,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import Kbd from "@/components/tour/Kbd";

const TITLE_ID = "freeroam-onboarding-title";
const BODY_ID = "freeroam-onboarding-body";

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } },
};

const reducedOverlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

const stepVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 320, damping: 30 } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.2, ease: "easeIn" } },
};

const reducedStepVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

export default function FreeRoamOnboarding({ isVisible, onComplete }) {
  const t = useTranslations("tour.onboarding");
  const containerRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const [stepIndex, setStepIndex] = useState(0);

  useFocusTrap(containerRef, isVisible);

  // Restart from the first step whenever the onboarding is (re)opened so it
  // never resumes on a stale step from a previous visit.
  useEffect(() => {
    if (isVisible) setStepIndex(0);
  }, [isVisible]);

  const steps = buildSteps(t);
  const total = steps.length;
  const isFirst = stepIndex === 0;
  const isLast = stepIndex === total - 1;
  const current = steps[stepIndex];

  const handleNext = useCallback(() => {
    if (isLast) {
      onComplete();
    } else {
      setStepIndex((i) => i + 1);
    }
  }, [isLast, onComplete]);

  const handleBack = useCallback(() => {
    setStepIndex((i) => Math.max(0, i - 1));
  }, []);

  // Escape skips the tutorial — a standard dismissal affordance for a modal.
  // It can't collide with the in-game pause shortcut: that one is suppressed
  // while the onboarding is showing.
  useEffect(() => {
    if (!isVisible) return;
    const onKeyDown = (e) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        onComplete();
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isVisible, onComplete]);

  const activeOverlayVariants = shouldReduceMotion ? reducedOverlayVariants : overlayVariants;
  const activeStepVariants = shouldReduceMotion ? reducedStepVariants : stepVariants;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          key="freeroam-onboarding"
          role="dialog"
          aria-modal="true"
          aria-labelledby={TITLE_ID}
          aria-describedby={BODY_ID}
          variants={activeOverlayVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-neutral-950 text-white"
        >
          {/* Subtle vignette to add depth without competing with content. */}
          <div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]"
            aria-hidden="true"
          />

          {/* Per-step progress is announced politely to screen readers. The
              dialog's own label covers the first step on open, so this only
              fires on subsequent step changes. */}
          <p className="sr-only" role="status" aria-live="polite">
            {t("stepStatus", { current: stepIndex + 1, total, title: current.title })}
          </p>

          <div
            ref={containerRef}
            className="relative z-10 flex w-full max-w-xl flex-col px-6 py-10 md:py-12"
          >
            {/* Header: step counter (visual only — SR users get the status above) */}
            <div
              className="mb-8 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/30"
              aria-hidden="true"
            >
              <span>{String(stepIndex + 1).padStart(2, "0")}</span>
              <span className="h-px flex-1 bg-white/10" />
              <span>{String(total).padStart(2, "0")}</span>
            </div>

            {/* Step body */}
            <AnimatePresence mode="wait">
              <motion.div
                key={current.id}
                variants={activeStepVariants}
                initial="hidden"
                animate="show"
                exit="exit"
                className="min-h-[19rem]"
              >
                <div
                  className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-white"
                  aria-hidden="true"
                >
                  <current.icon className="h-6 w-6" strokeWidth={1.5} />
                </div>

                <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
                  {current.eyebrow}
                </p>

                <h2
                  id={TITLE_ID}
                  className="mb-4 text-3xl font-semibold tracking-tight text-white md:text-4xl"
                >
                  {current.title}
                </h2>

                <p id={BODY_ID} className="max-w-prose text-base font-light leading-relaxed text-neutral-400">
                  {current.body}
                </p>

                {current.visual && <div className="mt-8">{current.visual}</div>}
              </motion.div>
            </AnimatePresence>

            {/* Footer: navigation */}
            <div className="mt-10 flex items-center justify-between gap-4">
              <button
                type="button"
                onClick={handleBack}
                disabled={isFirst}
                className={cn(
                  "flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wide transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60",
                  isFirst
                    ? "pointer-events-none opacity-0"
                    : "text-white/60 hover:bg-white/5 hover:text-white",
                )}
                aria-hidden={isFirst}
                tabIndex={isFirst ? -1 : undefined}
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                {t("back")}
              </button>

              {/* Progress dots — decorative; the status region conveys progress. */}
              <div className="flex items-center gap-2" aria-hidden="true">
                {steps.map((s, i) => (
                  <span
                    key={s.id}
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === stepIndex ? "w-6 bg-white" : "w-1.5 bg-white/20",
                    )}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={handleNext}
                className={cn(
                  "flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold tracking-wide text-black transition-colors hover:bg-white/90",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
                )}
              >
                {isLast ? t("finish") : t("next")}
                {isLast ? (
                  <Check className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                )}
              </button>
            </div>

            {/* Skip — underlined text, not a styled button */}
            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={onComplete}
                className="rounded text-xs font-mono uppercase tracking-[0.2em] text-white/60 underline underline-offset-4 transition-colors hover:text-white focus-visible:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                {t("skip")}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Builds the ordered onboarding steps. Kept as a plain function so the icon and
 * translated copy live next to the per-step visual markup.
 */
function buildSteps(t) {
  return [
    {
      id: "welcome",
      icon: Landmark,
      eyebrow: t("welcome.eyebrow"),
      title: t("welcome.title"),
      body: t("welcome.body"),
    },
    {
      id: "movement",
      icon: Move,
      eyebrow: t("movement.eyebrow"),
      title: t("movement.title"),
      body: t("movement.body"),
      visual: <MovementVisual t={t} />,
    },
    {
      id: "interact",
      icon: Eye,
      eyebrow: t("interact.eyebrow"),
      title: t("interact.title"),
      body: t("interact.body"),
      visual: <InteractVisual t={t} />,
    },
    {
      id: "pause",
      icon: Pause,
      eyebrow: t("pause.eyebrow"),
      title: t("pause.title"),
      body: t("pause.body"),
      visual: <PauseVisual t={t} />,
    },
    {
      id: "ready",
      icon: Check,
      eyebrow: t("ready.eyebrow"),
      title: t("ready.title"),
      body: t("ready.body"),
    },
  ];
}

function MovementVisual({ t }) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <ControlRow label={t("movement.move")}>
          <Kbd>W</Kbd>
          <Kbd>A</Kbd>
          <Kbd>S</Kbd>
          <Kbd>D</Kbd>
        </ControlRow>
        <ControlRow label={t("movement.look")}>
          <span className="flex items-center gap-2 text-xs text-white/50">
            <MousePointer2 className="h-4 w-4" aria-hidden="true" />
            {t("movement.lookDesc")}
          </span>
        </ControlRow>
        <ControlRow label={t("movement.run")}>
          <Kbd wide>Shift</Kbd>
        </ControlRow>
        <ControlRow label={t("movement.jump")}>
          <Kbd wide>Space</Kbd>
        </ControlRow>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="mb-4 flex items-center gap-2">
          <Layers className="h-4 w-4 text-white/60" aria-hidden="true" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            {t("movement.floorsTitle")}
          </span>
        </div>
        <ol className="space-y-2.5">
          <FloorItem index="3" label={t("movement.floor3")} />
          <FloorItem index="2" label={t("movement.floor2")} />
          <FloorItem index="1" label={t("movement.floor1")} />
        </ol>
      </div>
    </div>
  );
}

function FloorItem({ index, label }) {
  return (
    <li className="flex items-center gap-3">
      <span
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/5 font-mono text-[11px] text-white/50"
        aria-hidden="true"
      >
        {index}
      </span>
      <span className="text-sm text-neutral-300">{label}</span>
    </li>
  );
}

function InteractVisual({ t }) {
  const steps = [
    { icon: MousePointerClick, label: t("interact.step1") },
    { icon: Eye, label: t("interact.step2") },
    { icon: MousePointer2, label: t("interact.step3") },
  ];
  return (
    <div className="space-y-5">
      <ol className="grid grid-cols-3 gap-3">
        {steps.map((s, i) => (
          <li
            key={i}
            className="flex flex-col items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 text-center"
          >
            <span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-white"
              aria-hidden="true"
            >
              <s.icon className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="text-xs leading-snug text-neutral-300">{s.label}</span>
          </li>
        ))}
      </ol>
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm leading-relaxed text-neutral-400">
        {t("interact.panelNote")}
      </div>
    </div>
  );
}

function PauseVisual({ t }) {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-center gap-4">
        <Kbd wide>Esc</Kbd>
        <span className="font-mono text-xs uppercase tracking-widest text-white/50">
          {t("pause.or")}
        </span>
        <Kbd>P</Kbd>
      </div>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          {t("pause.optionsTitle")}
        </p>
        <ul className="space-y-2 text-sm text-neutral-300">
          <PauseOption>{t("pause.optResume")}</PauseOption>
          <PauseOption>{t("pause.optTour")}</PauseOption>
          <PauseOption>{t("pause.optControls")}</PauseOption>
          <PauseOption>{t("pause.optLanguage")}</PauseOption>
          <PauseOption>{t("pause.optExit")}</PauseOption>
        </ul>
      </div>
    </div>
  );
}

function PauseOption({ children }) {
  return (
    <li className="flex items-center gap-2.5">
      <span className="h-1 w-1 shrink-0 rounded-full bg-white/40" aria-hidden="true" />
      {children}
    </li>
  );
}

function ControlRow({ label, children }) {
  // A long label (e.g. "Desplazarse") plus a fixed-width key group can exceed a
  // narrow grid cell. flex-wrap lets the keys drop to their own line instead of
  // overflowing the card; shrink-0 keeps the keys themselves from squashing.
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
      <span className="text-sm text-neutral-300">{label}</span>
      <div className="flex shrink-0 items-center gap-1.5">{children}</div>
    </div>
  );
}
