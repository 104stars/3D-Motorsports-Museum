"use client";

import { useEffect, useRef, useCallback } from "react";
import { getCarInfo } from "@/lib/tour/carInfo";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

/**
 * Information panel that displays detailed car information.
 * Features a modern, elegant aesthetic with glass morphism and clean typography.
 */
export default function CarInformationPanel({ carId, onClose }) {
  const panelRef = useRef(null);
  const carInfo = carId ? getCarInfo(carId) : null;

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    },
    [onClose]
  );

  // Focus trap and keyboard handling
  useEffect(() => {
    if (!carId) return;

    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [carId, handleKeyDown]);

  if (!carId || !carInfo) return null;

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
          "relative w-full max-w-5xl max-h-[90vh] overflow-hidden rounded-3xl",
          "bg-neutral-900/90 backdrop-blur-2xl border border-white/10",
          "shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]",
          "animate-in zoom-in-95 fade-in duration-500 slide-in-from-bottom-4"
        )}
      >
        {/* Header */}
        <div className="relative px-8 py-8 md:px-12 md:py-10 border-b border-white/5 bg-gradient-to-b from-white/5 to-transparent">
          {/* Category & Year Badge */}
          <div className="flex items-center gap-3 mb-4">
            <span className="font-mono text-xs text-blue-400 uppercase tracking-widest bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20">
              {carInfo.category}
            </span>
            <div className="h-px w-4 bg-white/20" />
            <span className="font-mono text-xs text-neutral-400 tracking-wider">
              {carInfo.year}
            </span>
          </div>

          {/* Title */}
          <div className="pr-12">
            <h2
              id="panel-title"
              className="text-4xl md:text-6xl font-serif italic font-light text-white tracking-tight mb-2"
            >
              {carInfo.name}
            </h2>
            <p className="text-lg md:text-xl text-neutral-400 font-sans font-extralight tracking-wide">
              {carInfo.tagline}
            </p>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-8 right-8 p-2 rounded-full text-neutral-400 hover:text-white hover:bg-white/10 transition-all duration-300 group"
            aria-label="Close panel"
          >
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" strokeWidth={1.5} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="overflow-y-auto max-h-[calc(90vh-200px)] custom-scrollbar">
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
                  <div className="grid grid-cols-1 gap-6">
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
                <div className="grid grid-cols-1 gap-px bg-white/10 rounded-xl overflow-hidden border border-white/10">
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

  // Placeholder for missing media
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
