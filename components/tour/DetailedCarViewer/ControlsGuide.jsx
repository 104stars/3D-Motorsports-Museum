"use client";

import { MousePointer2, Move, ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

const CONTROL_ITEMS = [
  { id: "rotate", icon: MousePointer2, hint: "LMB" },
  { id: "pan", icon: Move, hint: "RMB" },
  { id: "zoom", icon: ZoomIn, hint: "SCROLL" },
];

export default function ControlsGuide({ tourMode = false }) {
  const t = useTranslations("carViewer");

  return (
    <motion.div
      aria-hidden="true"
      className={cn(
        "z-50 pointer-events-none select-none",
        "rounded-2xl border border-white/10 bg-black/30 backdrop-blur-xl",
        "shadow-[0_16px_40px_rgba(0,0,0,0.2)]",
        tourMode
          ? "absolute left-4 top-1/2 hidden -translate-y-1/2 md:flex"
          : "absolute bottom-8 left-8 flex",
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <div className="flex flex-col gap-3 p-3.5">
        {CONTROL_ITEMS.map(({ id, icon: Icon, hint }) => (
          <div key={id} className="flex items-center gap-3 text-white/[0.88]">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/[0.08]">
              <Icon className="h-3.5 w-3.5" />
            </div>
            <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-white/[0.82]">
              {t(id)}
            </span>
            <span className="ml-auto text-[10px] font-mono uppercase tracking-wider text-white/[0.42]">
              {hint}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

