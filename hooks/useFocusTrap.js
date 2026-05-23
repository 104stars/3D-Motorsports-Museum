"use client";

import { useEffect, useRef } from "react";

const FOCUSABLE_SELECTOR = [
  "a[href]",
  "button:not([disabled])",
  "textarea:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function getFocusable(container) {
  if (!container) return [];
  return Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR)).filter(
    (el) => !el.hasAttribute("aria-hidden") && el.offsetParent !== null,
  );
}

/**
 * Traps Tab/Shift+Tab navigation within containerRef while isActive is true.
 * On activation, moves focus into the container (first focusable element, or
 * the container itself if it has tabIndex). On deactivation, restores focus
 * to whatever element was focused before activation.
 */
export function useFocusTrap(containerRef, isActive) {
  const previousFocusRef = useRef(null);

  useEffect(() => {
    if (!isActive) return;
    const container = containerRef.current;
    if (!container) return;

    previousFocusRef.current = document.activeElement;

    const focusables = getFocusable(container);
    const first = focusables[0];
    if (first) {
      first.focus();
    } else if (container.hasAttribute("tabindex")) {
      container.focus();
    }

    const handleKeyDown = (e) => {
      if (e.key !== "Tab") return;
      const items = getFocusable(container);
      if (items.length === 0) {
        e.preventDefault();
        return;
      }
      const firstEl = items[0];
      const lastEl = items[items.length - 1];
      const active = document.activeElement;

      if (e.shiftKey && active === firstEl) {
        e.preventDefault();
        lastEl.focus();
      } else if (!e.shiftKey && active === lastEl) {
        e.preventDefault();
        firstEl.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);

    return () => {
      container.removeEventListener("keydown", handleKeyDown);
      const previous = previousFocusRef.current;
      if (previous && typeof previous.focus === "function") {
        try {
          previous.focus();
        } catch {
          /* element may be unmounted */
        }
      }
    };
  }, [containerRef, isActive]);
}
