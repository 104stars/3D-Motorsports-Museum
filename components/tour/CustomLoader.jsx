"use client";

import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import { useProgress } from "@react-three/drei";
import { motion, AnimatePresence } from "motion/react";

/**
 * Full-screen loader with smooth, monotonic progress (0→100).
 * Redesigned with Swiss-style aesthetics and Framer Motion animations.
 */
export default function CustomLoader({ onComplete }) {
  const { active, progress, loaded, total, item } = useProgress();
  const [visible, setVisible] = useState(true);
  // Rendered percent (integer). Keep a separate float ref for smooth easing
  // without forcing React re-renders at 60fps.
  const [pct, setPct] = useState(0);
  const pctRef = useRef(0);
  const displayPctRef = useRef(0);

  // Use refs to track monotonic target and previous active state
  const targetPctRef = useRef(0);
  const wasActiveRef = useRef(false);
  const rafRef = useRef(null);
  const loadStartTimeRef = useRef(null);
  const isAnimatingRef = useRef(false);
  const hasCompletedInitialLoadRef = useRef(false); // Track if initial load cycle is complete
  const minDisplayTime = 2000; // Minimum 2 seconds display time
  const postLoadDelay = 1200; // 1.2 seconds after 100% before exit

  // Helper to start animation loop if needed
  const startAnimationLoop = useCallback(() => {
    if (!visible || rafRef.current) return;

    const animate = () => {
      if (!visible || !isAnimatingRef.current) {
        rafRef.current = null;
        return;
      }

      const target = targetPctRef.current;
      const prev = displayPctRef.current;
      const diff = target - prev;

      // Close enough - snap to target and stop animating
      if (Math.abs(diff) < 0.1) {
        displayPctRef.current = target;
        const nextPct = Math.floor(target);
        if (nextPct !== pctRef.current) {
          pctRef.current = nextPct;
          setPct(nextPct);
        }
        isAnimatingRef.current = false;
        rafRef.current = null;
        return;
      }

      // Smooth easing toward target (float-only)
      const easingFactor = 0.12;
      const next = prev + diff * easingFactor;
      displayPctRef.current = next;

      // Only re-render when the visible integer changes
      const nextPct = Math.floor(next);
      if (nextPct !== pctRef.current) {
        pctRef.current = nextPct;
        setPct(nextPct);
      }

      if (Math.abs(target - next) < 0.1) {
        displayPctRef.current = target;
        const finalPct = Math.floor(target);
        if (finalPct !== pctRef.current) {
          pctRef.current = finalPct;
          setPct(finalPct);
        }
        isAnimatingRef.current = false;
        rafRef.current = null;
      }

      // Only continue if still animating and visible
      if (isAnimatingRef.current && visible) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };

    rafRef.current = requestAnimationFrame(animate);
  }, [visible]);

  // Update targetPct monotonically based on real progress
  useEffect(() => {
    // Ignore new loading sessions if we've already completed the initial load
    if (hasCompletedInitialLoadRef.current) {
      return;
    }

    // New loading session started - reset (only for initial load)
    if (active && !wasActiveRef.current) {
      targetPctRef.current = 0;
      displayPctRef.current = 0;
      pctRef.current = 0;
      setPct(0);
      setVisible(true);
      loadStartTimeRef.current = Date.now();
      isAnimatingRef.current = true;
    }

    // Loading finished - snap target to 100
    if (!active && wasActiveRef.current) {
      targetPctRef.current = 100;
      isAnimatingRef.current = true;
    }

    // While active, only allow targetPct to increase
    if (active) {
      const realPct = Math.min(100, Math.max(0, progress));
      const newTarget = Math.max(targetPctRef.current, realPct);
      if (newTarget !== targetPctRef.current) {
        targetPctRef.current = newTarget;
        isAnimatingRef.current = true;
      }
    }

    wasActiveRef.current = active;
    
    // Restart animation if needed
    if (isAnimatingRef.current && visible) {
      startAnimationLoop();
    }
  }, [active, progress, visible, startAnimationLoop]);

  // Animate displayPct toward targetPct using rAF with smoother easing
  // Only runs when visible and needs animation
  useEffect(() => {
    if (!visible) {
      // Stop animation when not visible
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      isAnimatingRef.current = false;
      return;
    }

    // Start animation if needed
    if (isAnimatingRef.current) {
      startAnimationLoop();
    }

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [visible, startAnimationLoop]);

  // Trigger exit when loading is effectively done, with minimum display time
  useEffect(() => {
    // Don't trigger exit if we've already completed initial load
    if (hasCompletedInitialLoadRef.current) {
      return;
    }

    const hasTotal = (total ?? 0) > 0;
    const effectivelyDone = hasTotal ? loaded >= total : !active;

    if (effectivelyDone && pct >= 99) {
      const elapsed = loadStartTimeRef.current 
        ? Date.now() - loadStartTimeRef.current 
        : 0;
      const remainingTime = Math.max(0, minDisplayTime - elapsed);
      
      // Wait for minimum display time + post-load delay
      const timeout = setTimeout(() => {
        setVisible(false);
        hasCompletedInitialLoadRef.current = true;
        onComplete?.();
      }, remainingTime + postLoadDelay);
      
      return () => clearTimeout(timeout);
    }
  }, [active, pct, loaded, total]);
  
  // Memoize item display text
  const itemText = useMemo(() => item || "Initializing environment...", [item]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loader"
          initial={{ y: 0 }}
          exit={{ 
            y: "-100%",
            transition: { 
              duration: 1.0, 
              ease: [0.76, 0, 0.24, 1],
              delay: 0.1
            } 
          }}
          className="fixed inset-0 z-[100] flex flex-col justify-between bg-neutral-950 p-6 md:p-12 text-white font-sans selection:bg-white selection:text-black overflow-hidden"
        >
          {/* Top Section */}
          <div className="flex w-full justify-between items-start border-b border-white/20 pb-4">
            <h1 className="text-sm md:text-base font-bold uppercase tracking-widest">
              Motorsports Museum
            </h1>
            <div className="text-xs md:text-sm font-mono opacity-60">
              EST. 2025
            </div>
          </div>

          {/* Center/Main Section */}
          <div className="flex-1 flex items-center justify-center relative">
             {/* Large background typography or decorative element could go here */}
          </div>

          {/* Bottom Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end border-t border-white/20 pt-4">
            
            {/* Asset Info */}
            <div className="space-y-2 font-mono text-xs md:text-sm opacity-60">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                <span>LOADING ASSETS</span>
              </div>
              <div className="truncate max-w-[200px] md:max-w-[300px]">
                {itemText}
              </div>
            </div>

            {/* Percentage Big */}
            <div className="text-right">
              <motion.div 
                className="text-[6rem] md:text-[12rem] leading-[0.8] font-bold tracking-tighter"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                {pct}%
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
