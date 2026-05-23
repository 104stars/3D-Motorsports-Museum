"use client";

import { useEffect, useRef, useCallback, useMemo, useState, memo } from "react";
import { 
  motion, 
  AnimatePresence, 
  useMotionValue, 
  useSpring, 
  useTransform,
  useMotionValueEvent
} from "motion/react";
import { useTranslations, useLocale } from "next-intl";
import { getCarInfo } from "@/lib/tour/carInfo";
import { cn } from "@/lib/utils";
import { X, Play, ChevronUp, Box } from "lucide-react";
import DetailedCarViewer from "./DetailedCarViewer";
import { useFocusTrap } from "@/hooks/useFocusTrap";

// Header dimensions and collapse configuration
const HEADER_CONFIG = {
  expanded: { mobile: 280, desktop: 380 },
  collapsed: { mobile: 120, desktop: 140 },
  // How much scroll delta (in px) to fully collapse the header
  scrollDistance: 180,
};

// Spring configurations for different feels
const SPRING_CONFIG = {
  // Snappy but smooth - good for header collapse
  header: { stiffness: 400, damping: 40, restDelta: 0.001 },
  // Softer spring for content elements
  content: { stiffness: 300, damping: 35, restDelta: 0.001 },
  // Quick response for UI feedback
  quick: { stiffness: 500, damping: 30, restDelta: 0.01 },
};

/**
 * Custom hook for staged scroll behavior with spring physics.
 * Phase 1: Scroll input collapses the header while content stays pinned.
 * Phase 2: Once collapsed, content scrolls normally.
 * Scrolling back up at top re-expands the header.
 */
function useStagedScroll(dependency) {
  const scrollContainerRef = useRef(null);
  
  // Raw progress value (0 = expanded, 1 = collapsed)
  const rawProgress = useMotionValue(0);
  
  // Smoothed progress with spring physics
  const progress = useSpring(rawProgress, SPRING_CONFIG.header);
  
  // Track touch state for mobile
  const touchStartY = useRef(0);
  const lastTouchY = useRef(0);

  // Reset progress when dependency (carId) changes
  useEffect(() => {
    rawProgress.jump(0);
  }, [dependency, rawProgress]);

  const updateProgress = useCallback((delta) => {
    const currentProgress = rawProgress.get();
    const increment = delta / HEADER_CONFIG.scrollDistance;
    const newProgress = Math.max(0, Math.min(1, currentProgress + increment));
    rawProgress.set(newProgress);
  }, [rawProgress]);

  // Handle wheel events
  const handleWheel = useCallback((e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const { scrollTop } = container;
    const currentProgress = rawProgress.get();
    const delta = e.deltaY;

    // Phase 1: Header is not fully collapsed and scrolling down
    if (delta > 0 && currentProgress < 0.98) {
      e.preventDefault();
      updateProgress(delta);
      return;
    }

    // Phase 2: At top of content and scrolling up - expand header
    if (delta < 0 && scrollTop <= 1 && currentProgress > 0.02) {
      e.preventDefault();
      updateProgress(delta);
      return;
    }
    // Otherwise allow normal scroll
  }, [rawProgress, updateProgress]);

  // Handle touch events for mobile
  const handleTouchStart = useCallback((e) => {
    touchStartY.current = e.touches[0].clientY;
    lastTouchY.current = e.touches[0].clientY;
  }, []);

  const handleTouchMove = useCallback((e) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const currentY = e.touches[0].clientY;
    const delta = lastTouchY.current - currentY; // Positive = scrolling down
    lastTouchY.current = currentY;

    const { scrollTop } = container;
    const currentProgress = rawProgress.get();

    // Phase 1: Header not fully collapsed and scrolling down
    if (delta > 0 && currentProgress < 0.98) {
      e.preventDefault();
      updateProgress(delta * 1.5); // Multiply for better touch feel
      return;
    }

    // Phase 2: At top of content and scrolling up - expand header
    if (delta < 0 && scrollTop <= 1 && currentProgress > 0.02) {
      e.preventDefault();
      updateProgress(delta * 1.5);
      return;
    }
  }, [rawProgress, updateProgress]);

  // Attach event listeners
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    container.addEventListener("wheel", handleWheel, { passive: false });
    container.addEventListener("touchstart", handleTouchStart, { passive: true });
    container.addEventListener("touchmove", handleTouchMove, { passive: false });

    return () => {
      container.removeEventListener("wheel", handleWheel);
      container.removeEventListener("touchstart", handleTouchStart);
      container.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleWheel, handleTouchStart, handleTouchMove, dependency]);

  return {
    scrollContainerRef,
    progress,
    rawProgress,
  };
}

/**
 * Hook for responsive breakpoint detection (avoids hydration issues)
 */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
}

/**
 * Information panel that displays detailed car information.
 * Features motion-enhanced staged scroll behavior with spring physics.
 */
export default function CarInformationPanel({ carId, onClose, onViewerStateChange, tourMode = false }) {
  const t = useTranslations("carInfo");
  const locale = useLocale();
  const panelRef = useRef(null);
  const { scrollContainerRef, progress, rawProgress } = useStagedScroll(carId);
  const carInfo = carId ? getCarInfo(carId, locale) : null;
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeImage, setActiveImage] = useState(null);
  const [isViewerActive, setIsViewerActive] = useState(false);
  const isMobile = useIsMobile();
  const handleOpenVideo = useCallback((item) => setActiveVideo(item), []);
  const handleOpenImage = useCallback((item) => setActiveImage(item), []);
  const handleCloseVideo = useCallback(() => setActiveVideo(null), []);
  const handleCloseImage = useCallback(() => setActiveImage(null), []);
  const handleOpenViewer = useCallback(() => {
    setIsViewerActive(true);
    onViewerStateChange?.(true);
  }, [onViewerStateChange]);
  
  const handleCloseViewer = useCallback(() => {
    setIsViewerActive(false);
    onViewerStateChange?.(false);
  }, [onViewerStateChange]);
  
  // Reset viewer state when carId changes
  useEffect(() => {
    if (!carId) {
      setIsViewerActive(false);
      onViewerStateChange?.(false);
    }
  }, [carId, onViewerStateChange]);

  // Derived motion values for smooth animations
  const expandedHeight = isMobile ? HEADER_CONFIG.expanded.mobile : HEADER_CONFIG.expanded.desktop;
  const collapsedHeight = isMobile ? HEADER_CONFIG.collapsed.mobile : HEADER_CONFIG.collapsed.desktop;

  // Transform progress to header height
  const headerHeight = useTransform(
    progress,
    [0, 1],
    [expandedHeight, collapsedHeight]
  );

  // Hero image opacity (fades as header collapses)
  const heroOpacity = useTransform(progress, [0, 0.6], [1, 0.4]);
  
  // Hero scale (subtle zoom on collapse)
  const heroScale = useTransform(progress, [0, 1], [1, 1.08]);

  // Title scale and positioning
  const titleScale = useTransform(progress, [0, 1], [1, 0.85]);
  
  // Tagline opacity and height
  const taglineOpacity = useTransform(progress, [0, 0.5], [1, 0]);
  const taglineHeight = useTransform(progress, [0, 0.5], ["auto", "0px"]);

  // Overlay darkness
  const overlayOpacity = useTransform(progress, [0, 1], [0, 0.6]);

  // Category badge scale
  const badgeScale = useTransform(progress, [0, 1], [1, 0.9]);

  // Track if collapsed for conditional rendering
  const [isCollapsed, setIsCollapsed] = useState(false);
  useMotionValueEvent(progress, "change", (latest) => {
    setIsCollapsed((prev) => {
      const next = latest > 0.9;
      return prev === next ? prev : next;
    });
  });

  // Get the first image to use as hero
  const heroImage = useMemo(() => {
    return carInfo?.media?.find(m => m.type === 'image') || null;
  }, [carInfo]);

  // Handle escape key to close
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") {
        if (isViewerActive) {
          handleCloseViewer();
        } else {
          onClose?.();
        }
      }
    },
    [onClose, isViewerActive, handleCloseViewer]
  );

  useEffect(() => {
    if (!carId) return;

    document.addEventListener("keydown", handleKeyDown);
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [carId, handleKeyDown]);

  // Scroll to top helper
  const scrollToTop = useCallback(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: 0, behavior: 'smooth' });
    }
    // Also expand header
    rawProgress.set(0);
  }, [rawProgress, scrollContainerRef]);

  return (
    <AnimatePresence mode="wait">
      {carId && carInfo && (
        <div
          className={cn(
            "fixed inset-0 flex items-center justify-center p-4 md:p-8",
            tourMode ? "z-[70]" : "z-50"
          )}
          role="dialog"
          aria-modal="true"
          aria-labelledby="panel-title"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            tabIndex={-1}
            className={cn(
              "relative w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden rounded-3xl",
              "bg-neutral-900/90 backdrop-blur-2xl border-[0.5px] border-white/10",
              "shadow-[0_0_100px_-20px_rgba(0,0,0,0.5)]",
              "focus:outline-none"
            )}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            transition={{ 
              type: "spring",
              stiffness: 350,
              damping: 30,
              mass: 0.8
            }}
          >
            {/* Header Area with Hero Image Background */}
            <motion.div 
              className="relative w-full overflow-hidden flex-shrink-0"
              style={{ height: headerHeight }}
            >
              {/* Background Image */}
              {heroImage && (
                <div className="absolute inset-0 z-0">
                  <motion.img 
                    src={heroImage.src} 
                    alt={heroImage.alt}
                    className="w-full h-full object-cover"
                    style={{
                      opacity: heroOpacity,
                      scale: heroScale,
                    }}
                  />
                  {/* Gradient overlay */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(to top, rgb(23, 23, 23) 0%, rgba(23, 23, 23, 0.6) 50%, transparent 100%)'
                    }}
                  />
                  {/* Additional dark overlay when collapsed */}
                  <motion.div 
                    className="absolute inset-0 bg-neutral-950"
                    style={{ opacity: overlayOpacity }}
                  />
                  <div className="absolute inset-0 bg-neutral-950/20" />
                </div>
              )}

              {/* Content Overlay */}
              <div className="relative z-10 h-full flex flex-col justify-between p-6 md:p-8 lg:p-10">
                {/* Top Controls */}
                <div className="flex justify-between items-start">
                  <motion.div 
                    className="flex items-center gap-3 origin-left"
                    style={{ scale: badgeScale }}
                  >
                    <span className="font-mono text-xs text-blue-400 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2 py-1 rounded border border-white/10">
                      {carInfo.category}
                    </span>
                    <div className="h-px w-4 bg-white/40" />
                    <span className="font-mono text-xs text-white/80 tracking-wider">
                      {carInfo.year}
                    </span>
                  </motion.div>

                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-full bg-black/20 backdrop-blur-md text-white/70 hover:text-white hover:bg-black/40 transition-colors duration-200 group border border-white/5 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
                    aria-label="Close panel"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" strokeWidth={1.5} aria-hidden="true" />
                  </motion.button>
                </div>

                {/* Title & Tagline */}
                <div className="mt-auto origin-bottom-left">
                  <motion.h2
                    id="panel-title"
                    className="font-serif italic font-light text-white tracking-tight drop-shadow-lg text-3xl md:text-4xl lg:text-5xl"
                    style={{ scale: titleScale, originX: 0, originY: 1 }}
                  >
                    {carInfo.name}
                  </motion.h2>
                  <motion.p 
                    className="text-neutral-200 font-sans font-extralight tracking-wide drop-shadow-md max-w-2xl text-base md:text-lg lg:text-xl mt-3 overflow-hidden"
                    style={{
                      opacity: taglineOpacity,
                    }}
                  >
                    {carInfo.tagline}
                  </motion.p>
                  
                  {/* View 3D Model Button — hidden in tour mode, since the
                      tour already exposes the model in its own viewer. */}
                  {!tourMode && (
                  <motion.div
                    className="mt-6"
                    style={{
                      opacity: taglineOpacity,
                    }}
                  >
                    <motion.button
                      onClick={handleOpenViewer}
                      className={cn(
                        "flex items-center gap-3 px-4 py-2.5 rounded-lg",
                        "bg-white/10 backdrop-blur-md text-white",
                        "hover:bg-white/20 border border-white/20",
                        "transition-colors duration-200",
                        "focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none",
                        "group"
                      )}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      aria-label="View 3D Model"
                    >
                      <Box className="w-5 h-5 transition-transform group-hover:rotate-12 duration-300" strokeWidth={1.5} aria-hidden="true" />
                      <span className="font-sans text-sm font-medium tracking-wide">
                        {t("view3DModel")}
                      </span>
                    </motion.button>
                  </motion.div>
                  )}
                </div>
              </div>

              {/* Collapse indicator */}
              <motion.div 
                className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: isCollapsed ? 0 : 0.5 }}
                transition={{ duration: 0.3 }}
                aria-hidden="true"
              >
                <ChevronUp className="w-5 h-5 text-white/50 animate-bounce" />
              </motion.div>
            </motion.div>

            {/* Scrollable content */}
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto custom-scrollbar"
            >
              <motion.div 
                className="grid grid-cols-1 lg:grid-cols-12 gap-12 p-8 md:p-12"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                {/* Left Column: History & Media */}
                <div className="lg:col-span-7 space-y-12">
                  {/* Historic Section */}
                  <section aria-labelledby="section-historic">
                    <SectionHeader id="section-historic" title={carInfo.historic.title} />
                    <p className="text-neutral-300 font-light leading-relaxed whitespace-pre-line text-lg">
                      {carInfo.historic.content}
                    </p>
                  </section>

                  {/* Media Gallery */}
                  {carInfo.media && carInfo.media.length > 0 && (
                    <section aria-labelledby="section-gallery">
                      <SectionHeader id="section-gallery" title={t("gallery")} />
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {carInfo.media.map((item, index) => (
                          <MediaItem 
                            key={index} 
                            item={item} 
                            index={index}
                            onVideoClick={handleOpenVideo} 
                            onImageClick={handleOpenImage} 
                          />
                        ))}
                      </div>
                    </section>
                  )}
                </div>

                {/* Right Column: Specs & Facts */}
                <div className="lg:col-span-5 space-y-12">
                  {/* Technical Specifications */}
                  <section aria-labelledby="section-specs">
                    <SectionHeader id="section-specs" title={t("technicalSpecs")} />
                    <dl className="grid grid-cols-1 gap-px bg-white/5 rounded-xl overflow-hidden border border-white/5">
                      {Object.entries(carInfo.technical).map(([key, value], index) => (
                        <SpecRow key={key} label={formatLabel(key)} value={value} index={index} />
                      ))}
                    </dl>
                  </section>

                  {/* Interesting Facts */}
                  <section aria-labelledby="section-facts">
                    <SectionHeader id="section-facts" title={t("didYouKnow")} />
                    <ul className="space-y-6">
                      {carInfo.facts.map((fact, index) => (
                        <motion.li 
                          key={index} 
                          className="relative pl-10"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.1 }}
                        >
                          <span className="absolute left-0 top-0 font-mono text-xs text-blue-400/80" aria-hidden="true">
                            {(index + 1).toString().padStart(2, '0')}
                          </span>
                          <p className="text-neutral-300 font-light leading-relaxed">
                            {fact}
                          </p>
                        </motion.li>
                      ))}
                    </ul>
                  </section>
                </div>
              </motion.div>

              {/* Footer hint */}
              <div className="px-12 py-8 border-t border-white/5 flex items-center justify-between">
                <span className="text-xs font-mono text-neutral-500 tracking-widest uppercase">
                  {t("pressEscToClose")} <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 mx-1 text-neutral-300">{t("escKey")}</kbd> {t("toClose")}
                </span>
                
                {/* Back to top button */}
                <motion.button
                  onClick={scrollToTop}
                  className="text-xs font-mono text-neutral-500 hover:text-neutral-300 uppercase tracking-wider flex items-center gap-2 transition-colors focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:outline-none rounded"
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label={t("backToTop")}
                >
                  <ChevronUp className="w-4 h-4" aria-hidden="true" />
                  {t("backToTop")}
                </motion.button>
              </div>
            </div>
          </motion.div>

          {/* Video Modal */}
          <AnimatePresence>
            {activeVideo && (
              <VideoModal video={activeVideo} onClose={handleCloseVideo} />
            )}
          </AnimatePresence>

          {/* Image Lightbox */}
          <AnimatePresence>
            {activeImage && (
              <ImageLightbox image={activeImage} onClose={handleCloseImage} />
            )}
          </AnimatePresence>

          {/* Detailed Car Viewer */}
          <DetailedCarViewer 
            carId={carId} 
            onClose={handleCloseViewer} 
            isActive={isViewerActive}
          />
        </div>
      )}
    </AnimatePresence>
  );
}

const SectionHeader = memo(function SectionHeader({ title, id }) {
  return (
    <h3 id={id} className="font-sans text-xs font-medium uppercase tracking-normal text-neutral-500 mb-6 flex items-center gap-4">
      {title}
      <span className="h-px flex-1 bg-white/10" aria-hidden="true"></span>
    </h3>
  );
});

const SpecRow = memo(function SpecRow({ label, value, index }) {
  return (
    <motion.div
      className="group flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-neutral-900/50 hover:bg-white/5 transition-colors duration-300"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 + index * 0.05 }}
    >
      <dt className="text-xs text-neutral-500 uppercase tracking-wider mb-1 sm:mb-0">
        {label}
      </dt>
      <dd className="text-sm text-neutral-200 font-medium font-mono text-right">{value}</dd>
    </motion.div>
  );
});

const MediaItem = memo(function MediaItem({ item, index, onVideoClick, onImageClick }) {
  const isVideo = item.type === "video";
  const isYoutube = item.type === "youtube";
  const isImage = item.type === "image";

  const handleError = (e) => {
    e.target.style.display = "none";
    e.target.parentElement.classList.add("media-error");
  };

  return (
    <motion.div 
      className="relative aspect-video rounded-xl overflow-hidden group bg-neutral-950 border border-white/10"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.1 + index * 0.1, type: "spring", stiffness: 300, damping: 25 }}
      whileHover={{ scale: 1.02 }}
    >
      {isYoutube ? (
        <button
          onClick={() => onVideoClick?.(item)}
          className="w-full h-full relative cursor-pointer focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          aria-label={`Play video: ${item.alt}`}
        >
          {/* YouTube Thumbnail */}
          <img
            src={`https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg`}
            alt={item.alt}
            loading="lazy"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            onError={handleError}
          />
          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center" aria-hidden="true">
            <motion.div 
              className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center"
              whileHover={{ scale: 1.1, backgroundColor: "rgba(255,255,255,0.2)" }}
              transition={{ type: "spring", stiffness: 400, damping: 20 }}
            >
              <Play className="w-7 h-7 text-white ml-1" fill="white" />
            </motion.div>
          </div>
          {/* Caption overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-light text-white/90">{item.alt}</p>
          </div>
        </button>
      ) : isVideo ? (
        <video
          src={item.src}
          controls
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
          onError={handleError}
        >
          <track kind="captions" />
        </video>
      ) : isImage ? (
        <button
          onClick={() => onImageClick?.(item)}
          className="w-full h-full relative cursor-pointer focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          aria-label={`View image: ${item.alt}`}
        >
          <img
            src={item.src}
            alt={item.alt}
            loading="lazy"
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:scale-105"
            onError={handleError}
          />
          {/* Caption overlay */}
          <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-300">
            <p className="text-sm font-light text-white/90">{item.alt}</p>
          </div>
        </button>
      ) : (
        <img
          src={item.src}
          alt={item.alt}
          loading="lazy"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          onError={handleError}
        />
      )}

      {/* Error State */}
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-neutral-900 opacity-0 [.media-error>&]:opacity-100 pointer-events-none">
        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-3">
          <span className="text-white/20 text-xl font-serif italic">!</span>
        </div>
        <p className="text-xs text-neutral-600 uppercase tracking-widest">{item.alt}</p>
      </div>
    </motion.div>
  );
});

const VideoModal = memo(function VideoModal({ video, onClose }) {
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, true);

  // Close on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={video.alt}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Video Container */}
      <motion.div 
        ref={dialogRef}
        className="relative w-full max-w-5xl aspect-video"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-200 group border border-white/10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          aria-label="Close video"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" strokeWidth={1.5} aria-hidden="true" />
        </motion.button>

        {/* YouTube iframe */}
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0&modestbranding=1&autoplay=1`}
          title={video.alt}
          className="w-full h-full rounded-xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </motion.div>
    </motion.div>
  );
});

const ImageLightbox = memo(function ImageLightbox({ image, onClose }) {
  const dialogRef = useRef(null);
  useFocusTrap(dialogRef, true);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <motion.div 
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 md:p-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Image Container */}
      <motion.div 
        ref={dialogRef}
        className="relative max-w-5xl max-h-[85vh]"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 text-white/70 hover:text-white hover:bg-white/20 transition-colors duration-200 group border border-white/10 focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:outline-none"
          aria-label="Close image"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" strokeWidth={1.5} aria-hidden="true" />
        </motion.button>

        <img
          src={image.src}
          alt={image.alt}
          className="max-w-full max-h-[85vh] object-contain rounded-xl"
        />

        {/* Caption */}
        <motion.p 
          className="absolute -bottom-10 left-0 right-0 text-center text-sm text-white/70 font-light"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {image.alt}
        </motion.p>
      </motion.div>
    </motion.div>
  );
});

/**
 * Converts camelCase technical spec keys to readable labels.
 */
function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
