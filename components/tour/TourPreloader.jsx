"use client";

import { useEffect, useRef, useState } from "react";
import { useGLTF } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";
import { getHighQualityModelUrl } from "@/lib/tour/carConfig";
import { NARRATION_ROUTE } from "@/lib/tour/narrationRoute";

/**
 * Preloads the first two tour stops from Supabase, then calls onReady.
 * Shows a minimal loading UI while models download.
 */
export default function TourPreloader({ isActive, onReady }) {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const hasCalledReady = useRef(false);

  useEffect(() => {
    if (!isActive || hasCalledReady.current) return;

    setIsLoading(true);
    setProgress(0);

    const urls = [0, 1]
      .map((i) => NARRATION_ROUTE[i])
      .map((id) => getHighQualityModelUrl(id))
      .filter(Boolean);

    let loaded = 0;

    const promises = urls.map(
      (url) =>
        new Promise((resolve) => {
          try {
            useGLTF.preload(url);
            // useGLTF.preload is fire-and-forget; we use a fetch check as a heuristic
            fetch(url, { method: "HEAD" })
              .then(() => {
                loaded++;
                setProgress(Math.round((loaded / urls.length) * 100));
                resolve();
              })
              .catch(() => {
                loaded++;
                setProgress(Math.round((loaded / urls.length) * 100));
                resolve();
              });
          } catch {
            loaded++;
            setProgress(Math.round((loaded / urls.length) * 100));
            resolve();
          }
        }),
    );

    Promise.all(promises).then(() => {
      // Small delay to let the three.js cache settle
      setTimeout(() => {
        hasCalledReady.current = true;
        setIsLoading(false);
        onReady?.();
      }, 600);
    });
  }, [isActive, onReady]);

  // Reset when deactivated
  useEffect(() => {
    if (!isActive) {
      hasCalledReady.current = false;
      setIsLoading(false);
      setProgress(0);
    }
  }, [isActive]);

  return (
    <AnimatePresence>
      {isActive && isLoading && (
        <motion.div
          key="tour-preloader"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[98] flex flex-col items-center justify-center bg-neutral-950 text-white"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center"
          >
            <div className="h-px w-12 bg-white/20 mb-8" />

            <h2 className="font-serif italic text-3xl md:text-4xl tracking-tight mb-3">
              Preparing your tour
            </h2>
            <p className="text-neutral-500 text-sm font-mono tracking-wider uppercase mb-10">
              Loading exhibits...
            </p>

            {/* Progress bar */}
            <div className="w-64 h-px bg-white/10 relative overflow-hidden rounded-full">
              <motion.div
                className="absolute inset-y-0 left-0 bg-white/80"
                initial={{ width: "0%" }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              />
            </div>

            <p className="mt-4 text-xs font-mono text-white/30">{progress}%</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
