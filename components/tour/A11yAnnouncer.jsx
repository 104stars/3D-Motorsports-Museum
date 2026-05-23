"use client";

import { useEffect, useState } from "react";

let externalSetMessage = null;

/**
 * Announce a message to screen readers via the global polite live region.
 * Safe to call from anywhere (after A11yAnnouncer has mounted).
 */
export function announceA11y(message) {
  if (externalSetMessage) externalSetMessage(message);
}

/**
 * Mount once near the Canvas. Renders a visually-hidden aria-live region
 * that screen readers monitor for announcements dispatched via announceA11y.
 */
export default function A11yAnnouncer() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    externalSetMessage = (msg) => {
      setMessage("");
      setTimeout(() => setMessage(msg), 50);
    };
    return () => {
      externalSetMessage = null;
    };
  }, []);

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
      className="sr-only"
      role="status"
    >
      {message}
    </div>
  );
}
