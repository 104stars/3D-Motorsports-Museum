import { cn } from "@/lib/utils";

/**
 * A single keyboard key cap. Shared between the free-roam onboarding and the
 * controls reference so both screens render keys identically. Use `wide` for
 * multi-character keys (Shift, Space, Esc…).
 */
export default function Kbd({ children, wide = false }) {
  return (
    <kbd
      className={cn(
        "flex h-9 items-center justify-center rounded-lg border-b-2 border-white/20 bg-gradient-to-b from-white/15 to-white/5 font-mono text-xs font-bold text-white shadow-md select-none",
        wide ? "min-w-[3.5rem] px-3" : "w-9",
      )}
    >
      {children}
    </kbd>
  );
}
