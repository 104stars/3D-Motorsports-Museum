"use client";

import { MousePointer2, Move, ZoomIn } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";

export default function ControlsGuide() {
  const t = useTranslations("carViewer");
  return (
    <motion.div 
      className="absolute bottom-8 left-8 z-50 flex flex-col gap-3 pointer-events-none select-none bg-white/40 backdrop-blur-md p-4 rounded-xl border border-white/50 shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.5, duration: 0.4 }}
    >
      <div className="flex items-center gap-3 text-neutral-800">
        <div className="w-6 h-6 rounded bg-white/60 flex items-center justify-center border border-white/50">
          <MousePointer2 className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-medium tracking-wide uppercase">{t("rotate")}</span>
        <span className="text-[10px] text-neutral-500 ml-auto font-mono">LMB</span>
      </div>

      <div className="flex items-center gap-3 text-neutral-800">
        <div className="w-6 h-6 rounded bg-white/60 flex items-center justify-center border border-white/50">
          <Move className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-medium tracking-wide uppercase">{t("pan")}</span>
        <span className="text-[10px] text-neutral-500 ml-auto font-mono">RMB</span>
      </div>

      <div className="flex items-center gap-3 text-neutral-800">
        <div className="w-6 h-6 rounded bg-white/60 flex items-center justify-center border border-white/50">
          <ZoomIn className="w-3.5 h-3.5" />
        </div>
        <span className="text-xs font-medium tracking-wide uppercase">{t("zoom")}</span>
        <span className="text-[10px] text-neutral-500 ml-auto font-mono">SCROLL</span>
      </div>
    </motion.div>
  );
}

