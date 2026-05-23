"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { Play, HelpCircle, Home, Headphones, ChevronRight } from "lucide-react";
import ControlsHelpModal from "./ControlsHelpModal";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { useFocusTrap } from "@/hooks/useFocusTrap";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const reducedContainerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

const reducedItemVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0 } },
  exit: { opacity: 0, transition: { duration: 0 } },
};

export default function PauseMenu({ isOpen, onResume, onStartTour }) {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);
  const t = useTranslations("tour.pause");
  const dialogRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  useFocusTrap(dialogRef, isOpen && !showHelp);

  const activeContainerVariants = shouldReduceMotion ? reducedContainerVariants : containerVariants;
  const activeItemVariants = shouldReduceMotion ? reducedItemVariants : itemVariants;

  const handleExit = () => {
    router.push("/");
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="pause-menu-heading"
        >
          {/* Cinematic Backdrop */}
          <motion.div
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            aria-hidden="true"
          />

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center" ref={dialogRef}>
            <AnimatePresence mode="wait">
              {showHelp ? (
                <ControlsHelpModal key="help" onBack={() => setShowHelp(false)} />
              ) : (
                <motion.div
                  key="menu"
                  variants={activeContainerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col items-center w-full max-w-md"
                >
                  {/* Decorative line */}
                  <motion.div 
                    variants={activeItemVariants} 
                    className="h-px w-16 bg-white/20 mb-8"
                    aria-hidden="true"
                  />

                  {/* Title */}
                  <motion.h1
                    id="pause-menu-heading"
                    variants={activeItemVariants}
                    className="font-serif italic text-6xl md:text-7xl text-white tracking-tighter mb-12 text-center drop-shadow-2xl"
                  >
                    {t("title")}
                  </motion.h1>

                  {/* Menu Items */}
                  <div className="flex flex-col gap-4 w-full">
                    <PauseMenuItem
                      icon={Play}
                      label={t("resume")}
                      description={t("resumeDesc")}
                      onClick={onResume}
                      variants={activeItemVariants}
                      primary
                    />
                    <PauseMenuItem
                      icon={Headphones}
                      label={t("narratedTour")}
                      description={t("narratedTourDesc")}
                      onClick={onStartTour}
                      variants={activeItemVariants}
                    />
                    <PauseMenuItem
                      icon={HelpCircle}
                      label={t("controls")}
                      description={t("controlsDesc")}
                      onClick={() => setShowHelp(true)}
                      variants={activeItemVariants}
                    />
                    <PauseMenuItem
                      icon={Home}
                      label={t("exit")}
                      description={t("exitDesc")}
                      onClick={handleExit}
                      variants={activeItemVariants}
                      danger
                    />
                  </div>

                  {/* Language Switcher */}
                  <motion.div variants={activeItemVariants} className="mt-10">
                    <LanguageSwitcher />
                  </motion.div>

                  {/* Footer Hint */}
                  <motion.div
                    variants={activeItemVariants}
                    className="mt-6 flex items-center gap-2 text-white/30 text-xs font-mono tracking-widest uppercase"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden="true" />
                    {t("footer")}
                    <span className="w-1 h-1 rounded-full bg-white/30" aria-hidden="true" />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PauseMenuItem({ icon: Icon, label, description, onClick, primary = false, danger = false, variants }) {
  return (
    <motion.button
      variants={variants ?? itemVariants}
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between w-full p-1 pl-1 pr-6 rounded-2xl",
        "transition-colors border border-transparent",
        "hover:bg-white/5 hover:border-white/10",
        "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
      )}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-center gap-6">
        {/* Icon Box */}
        <div className={cn(
          "w-14 h-14 rounded-xl flex items-center justify-center transition-colors",
          primary ? "bg-white text-black" : "bg-white/5 text-white/70 group-hover:text-white group-hover:bg-white/10",
          danger && "group-hover:bg-red-500/10 group-hover:text-red-400"
        )} aria-hidden="true">
          <Icon className="w-6 h-6" strokeWidth={2} />
        </div>

        {/* Text */}
        <div className="flex flex-col items-start text-left">
          <span className={cn(
            "text-lg font-medium tracking-wide transition-colors",
            primary ? "text-white" : "text-neutral-200 group-hover:text-white",
            danger && "group-hover:text-red-400"
          )}>
            {label}
          </span>
          <span className="text-sm text-white/30 font-light group-hover:text-white/50 transition-colors">
            {description}
          </span>
        </div>
      </div>

      {/* Arrow Indicator */}
      <ChevronRight className={cn(
        "w-5 h-5 transition-opacity opacity-0",
        "group-hover:opacity-100",
        primary ? "text-white" : "text-white/50"
      )} aria-hidden="true" />
    </motion.button>
  );
}
