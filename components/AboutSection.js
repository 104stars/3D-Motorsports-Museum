"use client";

import { useTranslations } from "next-intl";
import { motion, useReducedMotion } from "motion/react";
import { Box, ChevronRight, Compass, Eye, Gauge, Headphones } from "lucide-react";

const controlKeys = ["W", "A", "S", "D"];
const specBars = [
  { key: "engine", value: "V12", width: "72%" },
  { key: "power", value: "750 HP", width: "86%" },
];

export default function AboutSection() {
  const t = useTranslations("about");
  const modeT = useTranslations("tour.modeSelection");
  const carT = useTranslations("carInfo");
  const shouldReduceMotion = useReducedMotion();

  const cards = [
    {
      key: "modes",
      icon: Headphones,
      className: "lg:col-span-2",
      visual: (
        <TourModesVisual
          labels={[modeT("narratedTour"), modeT("freeRoam")]}
          descriptions={[modeT("narratedTourDesc"), modeT("freeRoamDesc")]}
        />
      ),
    },
    {
      key: "movement",
      icon: Compass,
      visual: <KeyboardVisual />,
    },
    {
      key: "interaction",
      icon: Eye,
      visual: <InteractionVisual panelLabel={t("visuals.panel")} infoLabel={t("visuals.infoLabel")} />,
    },
    {
      key: "viewer",
      icon: Box,
      visual: <CubeVisual />,
    },
    {
      key: "details",
      icon: Gauge,
      visual: (
        <SpecsVisual
          specs={specBars.map((spec) => ({
            ...spec,
            label: carT(spec.key),
          }))}
        />
      ),
    },
  ];

  const containerVariants = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.1 },
        },
      };

  const cardVariants = shouldReduceMotion
    ? { hidden: {}, visible: {} }
    : {
        hidden: { y: 40, opacity: 0 },
        visible: {
          y: 0,
          opacity: 1,
          transition: { type: "spring", stiffness: 100, damping: 15 },
        },
      };

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden bg-neutral-950 pt-32 pb-40 px-6 md:px-12 lg:px-20 scroll-mt-28"
    >
      {/* Top blend gradient from ExploreInvitation */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-neutral-950 to-transparent z-10"
      />

      {/* Subtle background grid + vignette */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 [mask-image:radial-gradient(85%_90%_at_50%_50%,black,transparent)]"
      >
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:32px_32px]" />
      </div>

      {/* Section Heading */}
      <div className="max-w-7xl mx-auto mb-16 text-center md:text-left">
        <p className="text-neutral-400 text-sm tracking-[0.2em] uppercase font-light mb-4">
          {t("eyebrow")}
        </p>
        <h2 className="text-5xl md:text-6xl font-light mb-4 font-sans bg-gradient-to-r from-neutral-50 to-neutral-300 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(133,133,133,0.25)]">
          {t("titlePre")}
          <span className="font-serif italic">{t("titleAccent")}</span>
        </h2>
        <p className="text-neutral-400 text-lg font-light max-w-2xl">
          {t("subtitle")}
        </p>
      </div>

      {/* Bento Grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {cards.map(({ key, icon: Icon, className = "", visual }) => (
          <motion.div
            key={key}
            variants={cardVariants}
            className={`${className} min-h-[300px] bg-neutral-900/30 backdrop-blur-md border border-white/10 hover:border-white/20 hover:shadow-[0_0_50px_rgba(255,255,255,0.02)] transition-all duration-500 rounded-3xl p-8 flex flex-col justify-between overflow-hidden relative group`}
          >
            <div aria-hidden="true" className="absolute -right-10 -top-10 w-40 h-40 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-all duration-500" />

            <div className="relative z-10">
              <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-white/5 border border-white/10 mb-6 text-white group-hover:scale-110 motion-safe:group-hover:scale-110 transition-transform duration-300">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-regular text-white mb-3 font-sans">
                {t(`cards.${key}.title`)}
              </h3>
              <p className="text-neutral-400 text-sm md:text-base font-light leading-relaxed max-w-xl">
                {t(`cards.${key}.description`)}
              </p>
            </div>

            <div className="relative z-10 mt-8">{visual}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
}

function TourModesVisual({ labels, descriptions }) {
  const icons = [Headphones, Compass];
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {labels.map((mode, index) => {
        const Icon = icons[index];
        return (
          <div
            key={mode}
            className="rounded-2xl border border-white/10 bg-black/25 p-5 flex flex-col gap-3"
          >
            <div className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-neutral-300">
              <Icon className="w-4 h-4" aria-hidden="true" />
            </div>
            <div>
              <div className="text-white text-sm font-medium mb-1">{mode}</div>
              <div className="text-neutral-500 text-xs leading-relaxed">{descriptions[index]}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function KeyboardVisual() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div className="rounded-2xl bg-black/30 border border-white/5 p-4 shadow-inner" aria-hidden="true">
      <div className="grid grid-cols-4 gap-2">
        {controlKeys.map((key, index) => (
          <motion.div
            key={key}
            animate={
              shouldReduceMotion
                ? {}
                : {
                    backgroundColor: ["rgba(255,255,255,0.05)", "rgba(255,255,255,0.18)", "rgba(255,255,255,0.05)"],
                    scale: [1, 0.96, 1],
                  }
            }
            transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 2, delay: index * 0.25 }}
            className="h-11 border border-white/20 rounded-lg flex items-center justify-center text-xs font-mono text-white font-medium"
          >
            {key}
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-3 gap-2 mt-2 text-[10px] font-mono uppercase tracking-wider text-neutral-400">
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">Shift</div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">Space</div>
        <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-center">R</div>
      </div>
    </div>
  );
}

function InteractionVisual({ panelLabel, infoLabel }) {
  return (
    <div aria-hidden="true" className="flex items-center gap-4 rounded-2xl bg-black/30 border border-white/5 p-4 shadow-inner">
      <div className="shrink-0 h-12 w-12 rounded-2xl border border-white/20 bg-white/5 flex items-center justify-center">
        <Eye className="w-5 h-5 text-white" aria-hidden="true" />
      </div>

      <ChevronRight className="shrink-0 w-4 h-4 text-white/25" aria-hidden="true" />

      <div className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3">
        <div className="text-[10px] font-mono uppercase tracking-widest text-neutral-500 mb-1">{infoLabel}</div>
        <div className="text-sm font-medium text-white">{panelLabel}</div>
      </div>
    </div>
  );
}

function CubeVisual() {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div aria-hidden="true" className="flex items-center justify-center h-24 rounded-2xl bg-black/30 border border-white/5 shadow-inner">
      <div className="w-12 h-12 relative [perspective:400px]">
        <motion.div
          animate={shouldReduceMotion ? {} : { rotateX: [0, 360], rotateY: [0, 360] }}
          transition={shouldReduceMotion ? {} : { repeat: Infinity, duration: 6, ease: "linear" }}
          className="w-full h-full relative [transform-style:preserve-3d]"
        >
          <div className="absolute inset-0 border border-white/40 bg-white/5 [transform:translateZ(24px)]" />
          <div className="absolute inset-0 border border-white/40 bg-white/5 [transform:rotateY(180deg)_translateZ(24px)]" />
          <div className="absolute inset-0 border border-white/40 bg-white/5 [transform:rotateY(-90deg)_translateZ(24px)]" />
          <div className="absolute inset-0 border border-white/40 bg-white/5 [transform:rotateY(90deg)_translateZ(24px)]" />
          <div className="absolute inset-0 border border-white/40 bg-white/5 [transform:rotateX(90deg)_translateZ(24px)]" />
          <div className="absolute inset-0 border border-white/40 bg-white/5 [transform:rotateX(-90deg)_translateZ(24px)]" />
        </motion.div>
      </div>
    </div>
  );
}

function SpecsVisual({ specs }) {
  const shouldReduceMotion = useReducedMotion();
  return (
    <div aria-hidden="true" className="flex flex-col gap-3 bg-black/30 border border-white/5 rounded-2xl p-4 shadow-inner">
      {specs.map((spec, index) => (
        <div key={spec.key}>
          <div className="flex justify-between text-xs font-mono text-neutral-400 mb-1">
            <span>{spec.label}</span>
            <span className="text-white">{spec.value}</span>
          </div>
          <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: shouldReduceMotion ? spec.width : 0 }}
              whileInView={shouldReduceMotion ? {} : { width: spec.width }}
              transition={shouldReduceMotion ? {} : { duration: 1.2, ease: "easeOut", delay: index * 0.15 }}
              className="h-full bg-white/75 rounded-full"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
