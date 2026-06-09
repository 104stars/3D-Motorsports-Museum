"use client";

import { motion } from "motion/react";
import { ChevronLeft, Move, MousePointer2, Eye, Orbit } from "lucide-react";
import { useTranslations } from "next-intl";
import Kbd from "@/components/tour/Kbd";

export default function ControlsHelpModal({ onBack }) {
  const t = useTranslations("tour.controls");

  return (
    <motion.div
      className="w-full max-w-3xl"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {/* Header — back control, then an onboarding-style eyebrow + title. */}
      <div className="mb-8">
        <button
          type="button"
          onClick={onBack}
          autoFocus
          className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium tracking-wide text-white/60 transition-colors hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
        >
          <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          {t("back")}
        </button>
        <p className="mb-2 font-mono text-xs uppercase tracking-[0.2em] text-white/50">
          {t("eyebrow")}
        </p>
        <h2
          id="controls-help-heading"
          className="text-3xl font-semibold tracking-tight text-white md:text-4xl"
        >
          {t("title")}
        </h2>
      </div>

      {/* Every section is visible at once so the reference can be scanned rather
          than paged through. The grid is focusable + arrow-scrollable so the
          content stays reachable by keyboard if it overflows on short screens. */}
      <div
        className="grid max-h-[60vh] gap-4 overflow-y-auto rounded-2xl pr-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/30 sm:grid-cols-2"
        tabIndex={0}
        role="group"
        aria-label={t("title")}
      >
        <ControlCard icon={Move} title={t("movement.title")}>
          <Row label={t("movement.move")}>
            <Kbd>W</Kbd>
            <Kbd>A</Kbd>
            <Kbd>S</Kbd>
            <Kbd>D</Kbd>
          </Row>
          <Row label={t("movement.run")}>
            <Kbd wide>Shift</Kbd>
          </Row>
          <Row label={t("movement.jump")}>
            <Kbd wide>Space</Kbd>
          </Row>
          <Row label={t("movement.resetPosition")}>
            <Kbd>R</Kbd>
          </Row>
        </ControlCard>

        <ControlCard icon={MousePointer2} title={t("camera.title")}>
          <Row label={t("camera.freeLook")}>
            <span className="flex items-center gap-2 text-xs text-white/60">
              <MousePointer2 className="h-4 w-4" aria-hidden="true" />
              {t("camera.lookHint")}
            </span>
          </Row>
          <Row label={t("camera.pauseMenu")}>
            <Kbd wide>Esc</Kbd>
            <span className="px-0.5 font-mono text-xs text-white/40" aria-hidden="true">
              /
            </span>
            <Kbd>P</Kbd>
          </Row>
        </ControlCard>

        <ControlCard icon={Eye} title={t("interaction.title")}>
          <p className="text-sm font-light leading-relaxed text-neutral-400">
            {t("interaction.subtitle")}
          </p>
          <div className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3">
            <span
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white"
              aria-hidden="true"
            >
              <Eye className="h-4 w-4" />
            </span>
            <p className="text-sm leading-relaxed text-neutral-300">
              {t.rich("interaction.interestIndicatorDesc", {
                strong: (chunks) => <strong className="font-semibold text-white">{chunks}</strong>,
              })}
            </p>
          </div>
        </ControlCard>

        <ControlCard icon={Orbit} title={t("detailedView.title")}>
          <Row label={t("detailedView.rotate")}>
            <Gesture>{t("detailedView.leftDrag")}</Gesture>
          </Row>
          <Row label={t("detailedView.move")}>
            <Gesture>{t("detailedView.rightDrag")}</Gesture>
          </Row>
          <Row label={t("detailedView.zoom")}>
            <Gesture>{t("detailedView.scroll")}</Gesture>
          </Row>
          <Row label={t("detailedView.closeView")}>
            <Kbd wide>Esc</Kbd>
          </Row>
          <p className="text-xs leading-relaxed text-neutral-500">
            {t.rich("detailedView.cursorNote", {
              strong: (chunks) => <strong className="font-semibold text-neutral-300">{chunks}</strong>,
            })}
          </p>
        </ControlCard>
      </div>
    </motion.div>
  );
}

function ControlCard({ icon: Icon, title, children }) {
  return (
    <section className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-5">
      <div className="mb-4 flex items-center gap-3">
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white"
          aria-hidden="true"
        >
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-white">{title}</h3>
      </div>
      <div className="flex flex-col gap-2.5">{children}</div>
    </section>
  );
}

function Row({ label, children }) {
  // flex-wrap so a long localized label drops the controls to their own line
  // instead of overflowing the card; shrink-0 keeps the keys at natural size.
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
      <span className="text-sm text-neutral-300">{label}</span>
      <div className="flex shrink-0 items-center gap-1.5">{children}</div>
    </div>
  );
}

/** A mouse gesture chip — deliberately flatter than {@link Kbd} so it reads as
 *  an action rather than a key. */
function Gesture({ children }) {
  return (
    <span className="flex h-9 items-center rounded-lg border border-white/10 bg-white/5 px-3 font-mono text-xs text-white/70">
      {children}
    </span>
  );
}
