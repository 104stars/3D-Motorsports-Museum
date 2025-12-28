"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Play, HelpCircle, Home, ChevronRight } from "lucide-react";
import ControlsHelpModal from "./ControlsHelpModal";
import { cn } from "@/lib/utils";

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

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
  exit: { opacity: 0, y: 10, transition: { duration: 0.2 } },
};

export default function PauseMenu({ isOpen, onResume }) {
  const router = useRouter();
  const [showHelp, setShowHelp] = useState(false);

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
        >
          {/* Cinematic Backdrop */}
          <motion.div
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Content Container */}
          <div className="relative z-10 w-full max-w-4xl px-6 flex flex-col items-center">
            <AnimatePresence mode="wait">
              {showHelp ? (
                <ControlsHelpModal key="help" onBack={() => setShowHelp(false)} />
              ) : (
                <motion.div
                  key="menu"
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  exit="exit"
                  className="flex flex-col items-center w-full max-w-md"
                >
                  {/* Decorative line */}
                  <motion.div 
                    variants={itemVariants} 
                    className="h-px w-16 bg-white/20 mb-8"
                  />

                  {/* Title */}
                  <motion.h1
                    variants={itemVariants}
                    className="font-serif italic text-6xl md:text-7xl text-white tracking-tighter mb-12 text-center drop-shadow-2xl"
                  >
                    Pausa
                  </motion.h1>

                  {/* Menu Items */}
                  <div className="flex flex-col gap-4 w-full">
                    <PauseMenuItem
                      icon={Play}
                      label="Reanudar"
                      description="Volver al recorrido"
                      onClick={onResume}
                      primary
                    />
                    <PauseMenuItem
                      icon={HelpCircle}
                      label="Controles"
                      description="Guía de movimiento e interacción"
                      onClick={() => setShowHelp(true)}
                    />
                    <PauseMenuItem
                      icon={Home}
                      label="Salir"
                      description="Volver al inicio"
                      onClick={handleExit}
                      danger
                    />
                  </div>

                  {/* Footer Hint */}
                  <motion.div
                    variants={itemVariants}
                    className="mt-12 flex items-center gap-2 text-white/30 text-xs font-mono tracking-widest uppercase"
                  >
                    <span className="w-1 h-1 rounded-full bg-white/30" />
                    Presiona ESC para volver
                    <span className="w-1 h-1 rounded-full bg-white/30" />
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

function PauseMenuItem({ icon: Icon, label, description, onClick, primary = false, danger = false }) {
  return (
    <motion.button
      variants={itemVariants}
      onClick={onClick}
      className={cn(
        "group relative flex items-center justify-between w-full p-1 pl-1 pr-6 rounded-2xl",
        "transition-colors border border-transparent",
        "hover:bg-white/5 hover:border-white/10"
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
        )}>
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
      )} />
    </motion.button>
  );
}
