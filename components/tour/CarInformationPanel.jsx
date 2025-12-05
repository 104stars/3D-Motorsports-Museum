"use client";

import { useEffect, useRef, useCallback, useMemo, useState } from "react";
import { getCarInfo } from "@/lib/tour/carInfo";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

// Header dimensions and collapse configuration
const HEADER_CONFIG = {
  expanded: { mobile: 280, desktop: 380 },
  // Give a touch more breathing room when collapsed to avoid clipping the title
  collapsed: { mobile: 130, desktop: 150 },
  // How much wheel delta (in px) to fully collapse the header
  scrollDistance: 200,
};

/**
 * Custom hook for staged scroll behavior.
 * Phase 1: Scroll input collapses the header while content stays pinned.
 * Phase 2: Once collapsed, content scrolls normally.
 * Scrolling back up at top re-expands the header.
 */
function useStagedScroll() {
  const scrollContainerRef = useRef(null);
  const progressRef = useRef(0); // 0 = expanded, 1 = collapsed
  const [progress, setProgress] = useState(0);

  const updateProgress = useCallback((newProgress) => {
    const clamped = Math.max(0, Math.min(1, newProgress));
    progressRef.current = clamped;
    setProgress(clamped);
  }, []);

  const handleWheel = useCallback((e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop } = container;
    const currentProgress = progressRef.current;
    const delta = e.deltaY;

    // Phase 1: Header is not fully collapsed and scrolling down
    if (delta > 0 && currentProgress < 1) {
      e.preventDefault();
      const increment = delta / HEADER_CONFIG.scrollDistance;
      updateProgress(currentProgress + increment);
      return;
    }

    // Phase 2: At top of content and scrolling up - expand header
    if (delta < 0 && scrollTop <= 0 && currentProgress > 0) {
      e.preventDefault();
      const decrement = Math.abs(delta) / HEADER_CONFIG.scrollDistance;
      updateProgress(currentProgress - decrement);
      return;
    }

    // Otherwise, allow normal scroll (header is collapsed and not at top, or scrolling within content)
  }, [updateProgress]);

  // Attach wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [handleWheel]);

  return {
    scrollContainerRef,
    progress,
    isCollapsed: progress >= 0.95,
  };
}

/**
 * Information panel that displays detailed car information.
 * Features a modern, elegant aesthetic with staged scroll behavior.
 */
export default function CarInformationPanel({ carId, onClose }) {
  const panelRef = useRef(null);
  const { scrollContainerRef, progress, isCollapsed } = useStagedScroll();
  const carInfo = carId ? getCarInfo(carId) : null;

  // Get the first image to use as hero
  const heroImage = useMemo(() => {
    return carInfo?.media?.find(m => m.type === 'image') || null;
  }, [carInfo]);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  useEffect(() => {
    if (!carId) return;

    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [carId, handleKeyDown]);

  if (!carId || !carInfo) return null;

  // Calculate interpolated header height based on progress
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const expandedHeight = isMobile ? HEADER_CONFIG.expanded.mobile : HEADER_CONFIG.expanded.desktop;
  const collapsedHeight = isMobile ? HEADER_CONFIG.collapsed.mobile : HEADER_CONFIG.collapsed.desktop;
  const headerHeight = expandedHeight - (expandedHeight - collapsedHeight) * progress;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="panel-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md animate-in fade-in duration-500"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        className={cn(
          "relative w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden rounded-3xl",
          "bg-neutral-900/90 backdrop-blur-2xl border-[0.5px] border-white/10",
          "shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]",
          "animate-in zoom-in-95 fade-in duration-500 slide-in-from-bottom-4"
        )}
      >
        {/* Header Area with Hero Image Background */}
        <div 
          className="relative w-full overflow-hidden flex-shrink-0"
          style={{ 
            height: headerHeight,
            transition: 'height 0.15s ease-out'
          }}
        >
          {/* Background Image */}
          {heroImage && (
            <div className="absolute inset-0 z-0">
              <img 
                src={heroImage.src} 
                alt={heroImage.alt}
                className="w-full h-full object-cover transition-all duration-300"
                style={{
                  opacity: 1 - progress * 0.6,
                  transform: `scale(${1 + progress * 0.05})`,
                }}
              />
              <div 
                className="absolute inset-0 transition-all duration-300"
                style={{
                  background: isCollapsed 
                    ? 'rgba(10, 10, 10, 0.85)' 
                    : 'linear-gradient(to top, rgb(23, 23, 23) 0%, rgba(23, 23, 23, 0.6) 50%, transparent 100%)'
                }}
              />
              <div className="absolute inset-0 bg-neutral-950/20" />
            </div>
          )}

          {/* Content Overlay */}
          <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 lg:p-10">
            {/* Top Controls */}
            <div className="flex justify-between items-start">
              <div 
                className="flex items-center gap-3 origin-left transition-transform duration-300"
                style={{ transform: `scale(${1 - progress * 0.1})` }}
              >
                <span className="font-mono text-xs text-blue-400 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                  {carInfo.category}
                </span>
                <div className="h-px w-4 bg-white/40" />
                <span className="font-mono text-xs text-white/80 tracking-wider">
                  {carInfo.year}
                </span>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/40 transition-all duration-300 group border border-white/5"
                aria-label="Close panel"
              >
                <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" strokeWidth={1.5} />
              </button>
            </div>

            {/* Title & Tagline */}
            <div className="mt-auto origin-bottom-left">
              <h2
                id="panel-title"
                className="font-serif italic font-light text-white tracking-normal drop-shadow-lg transition-all duration-300"
                style={{
                  fontSize: `clamp(1.875rem, ${3.5 - progress * 1.2}rem, 4.5rem)`,
                  marginBottom: isCollapsed ? 0 : '0.75rem',
                }}
              >
                {carInfo.name}
              </h2>
              <p 
                className="text-neutral-200 font-sans font-extralight tracking-wide drop-shadow-md max-w-2xl transition-all duration-300 overflow-hidden"
                style={{
                  opacity: 1 - progress * 1.5,
                  maxHeight: isCollapsed ? 0 : '3rem',
                  fontSize: `clamp(1rem, ${1.25 - progress * 0.5}rem, 1.5rem)`,
                }}
              >
                {carInfo.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable content */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto custom-scrollbar"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 md:p-12">
            {/* Left Column: History & Media */}
            <div className="lg:col-span-7 space-y-12">
              {/* Historic Section */}
              <section>
                <SectionHeader title={carInfo.historic.title} />
                <p className="text-neutral-300 font-light leading-relaxed whitespace-pre-line text-lg">
                  {carInfo.historic.content}
                </p>
              </section>

              {/* Media Gallery */}
              {carInfo.media && carInfo.media.length > 0 && (
                <section>
                  <SectionHeader title="Gallery" />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {carInfo.media.map((item, index) => (
                      <MediaItem key={index} item={item} />
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Right Column: Specs & Facts */}
            <div className="lg:col-span-5 space-y-12">
              {/* Technical Specifications */}
              <section>
                <SectionHeader title="Technical Specifications" />
                <div className="grid grid-cols-1 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                  {Object.entries(carInfo.technical).map(([key, value]) => (
                    <SpecRow key={key} label={formatLabel(key)} value={value} />
                  ))}
                </div>
              </section>

              {/* Interesting Facts */}
              <section>
                <SectionHeader title="Did You Know?" />
                <ul className="space-y-6">
                  {carInfo.facts.map((fact, index) => (
                    <li key={index} className="relative pl-10">
                      <span className="absolute left-0 top-0 font-mono text-xs text-blue-400/80">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                      <p className="text-neutral-300 font-light leading-relaxed">
                        {fact}
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* Footer hint */}
          <div className="px-12 py-8 border-t border-white/5 flex items-center justify-center">
            <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
              Press <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 mx-1 text-neutral-300">ESC</kbd> to close
            </span>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <h3 className="font-sans text-xs font-medium uppercase tracking-[0.2em] text-neutral-500 mb-6 flex items-center gap-4">
      {title}
      <span className="h-px flex-1 bg-white/10"></span>
    </h3>
  );
}

function SpecRow({ label, value }) {
  return (
    <div className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-900/50 hover:bg-white/5 transition-colors duration-300">
      <dt className="text-xs text-neutral-500 uppercase tracking-wider mb-1 sm:mb-0">
        {label}
      </dt>
      <dd className="text-sm text-neutral-200 font-medium font-mono text-right">{value}</dd>
    </div>
  );
}

function MediaItem({ item }) {
  const isVideo = item.type === "video";

  const handleError = (e) => {
    e.target.style.display = "none";
    e.target.parentElement.classList.add("media-error");
  };

  return (
    <div className="relative aspect-video rounded-xl overflow-hidden group bg-neutral-950 border border-white/10">
      {isVideo ? (
        <video
          src={item.src}
          controls
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          onError={handleError}
        >
          <track kind="captions" />
        </video>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          onError={handleError}
        />
      )}

      {/* Error State */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 opacity-0 [.media-error>&]:opacity-100">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <span className="text-white/20 text-xl font-serif italic">!</span>
        </div>
        <p className="text-xs text-neutral-600 uppercase tracking-widest">{item.alt}</p>
      </div>

      {/* Caption overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 [.media-error>&]:hidden">
        <p className="text-sm font-light text-white/90">{item.alt}</p>
      </div>
    </div>
  );
}

/**
 * Converts camelCase technical spec keys to readable labels.
 */
function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
