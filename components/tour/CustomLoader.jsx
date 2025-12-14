"use client";

import { useEffect, useRef, useState } from "react";
import { useProgress } from "@react-three/drei";

/**
 * Full-screen loader with smooth, monotonic progress (0→100).
 * - targetPct: monotonic clamp of real progress (never decreases within a session)
 * - displayPct: animated toward targetPct via rAF for smooth visual transitions
 */
export default function CustomLoader() {
  const { active, progress, loaded, total } = useProgress();
  const [visible, setVisible] = useState(true);
  const [displayPct, setDisplayPct] = useState(0);
  const [fadingOut, setFadingOut] = useState(false);

  // Use refs to track monotonic target and previous active state
  const targetPctRef = useRef(0);
  const wasActiveRef = useRef(false);
  const rafRef = useRef(null);

  // Update targetPct monotonically based on real progress
  useEffect(() => {
    // New loading session started - reset
    if (active && !wasActiveRef.current) {
      targetPctRef.current = 0;
      setDisplayPct(0);
      setFadingOut(false);
      setVisible(true);
    }

    // Loading finished - snap target to 100
    if (!active && wasActiveRef.current) {
      targetPctRef.current = 100;
    }

    // While active, only allow targetPct to increase
    if (active) {
      const realPct = Math.min(100, Math.max(0, progress));
      targetPctRef.current = Math.max(targetPctRef.current, realPct);
    }

    wasActiveRef.current = active;
  }, [active, progress]);

  // Animate displayPct toward targetPct using rAF
  useEffect(() => {
    const animate = () => {
      setDisplayPct((prev) => {
        const target = targetPctRef.current;
        const diff = target - prev;

        // Close enough - snap to target
        if (Math.abs(diff) < 0.5) return target;

        // Ease toward target (faster when further away)
        const speed = 0.08 + Math.abs(diff) * 0.002;
        return prev + diff * Math.min(speed, 0.3);
      });

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Trigger fade-out once (when loading is actually done)
  useEffect(() => {
    const effectivelyDone =
      !active || (total ?? 0) > 0
        ? loaded >= total
        : targetPctRef.current >= 99.5;

    if (effectivelyDone && displayPct >= 99.5 && !fadingOut) {
      setFadingOut(true);
    }
  }, [active, displayPct, fadingOut, loaded, total]);

  // Hide after fade-out animation completes
  useEffect(() => {
    if (fadingOut) {
      const timeout = setTimeout(() => setVisible(false), 600);
      return () => clearTimeout(timeout);
    }
  }, [fadingOut]);

  if (!visible) return null;

  const pct = Math.floor(displayPct);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/95 backdrop-blur-sm transition-opacity duration-500 ${
        fadingOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="w-[260px] space-y-3 text-center text-white/90">
        <div className="text-sm uppercase tracking-[0.2em] text-white/60">
          Loading
        </div>
        <div className="text-4xl font-semibold tabular-nums">{pct}%</div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-white"
            style={{ width: `${displayPct}%` }}
          />
        </div>
        <div className="text-xs text-white/50">
          {loaded} of {total || "?"} assets
        </div>
      </div>
    </div>
  );
}
