"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import { 
  EffectComposer, 
  Bloom, 
  SMAA,
  Vignette,
  BrightnessContrast,
  Noise,
  HueSaturation
} from "@react-three/postprocessing";
import { 
  ACESFilmicToneMapping, 
  SRGBColorSpace
} from "three";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { getCarInfo } from "@/lib/tour/carInfo";
import SceneContent from "./SceneContent";
import ControlsGuide from "./ControlsGuide";
import CarInfoOverlay from "./CarInfoOverlay";

/**
 * Detailed 3D car model viewer with high-quality rendering and post-processing.
 * tourMode: when true, suppresses the close button and ESC handler (HUD controls lifecycle).
 */
export default function DetailedCarViewer({ carId, onClose, isActive, tourMode = false, onReady }) {
  const modelBoundsRef = useRef(null);
  const onReadyRef = useRef(onReady);
  onReadyRef.current = onReady;
  const tA11y = useTranslations("tour.a11y");
  const locale = useLocale();
  const shouldReduceMotion = useReducedMotion();
  const carName = useMemo(() => {
    if (!carId) return "";
    return getCarInfo(carId, locale)?.name || "";
  }, [carId, locale]);

  const handleModelLoaded = useCallback((bounds) => {
    modelBoundsRef.current = bounds;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        onReadyRef.current?.();
      });
    });
  }, []);

  const noopControlsReady = useCallback(() => {}, []);

  useEffect(() => {
    if (!isActive || tourMode) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onClose, tourMode]);

  if (!carId || !isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-[60] w-screen h-screen bg-[#ededed]"
        initial={tourMode ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
      >
        {/* Close Button — hidden in tour mode (HUD handles exit) */}
        {!tourMode && (
          <motion.button
            onClick={onClose}
            className={cn(
              "absolute top-8 right-8 z-50 p-2",
              "text-black/50 hover:text-black",
              "transition-colors duration-200",
              "focus-visible:ring-2 focus-visible:ring-black/40 focus-visible:outline-none rounded-full"
            )}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Close viewer"
          >
            <X className="w-8 h-8" strokeWidth={1.5} aria-hidden="true" />
          </motion.button>
        )}

        <ControlsGuide tourMode={tourMode} />

        {/* Car info overlay (both modes) */}
        <CarInfoOverlay carId={carId} />

        {/* 3D Canvas */}
        <div
          className="absolute inset-0 w-full h-full"
          role="img"
          aria-label={carName ? tA11y("carViewerLabel", { name: carName }) : undefined}
        >
          <Canvas
            shadows={false}
            dpr={[1, 3]}
            gl={{
              antialias: true,
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
              outputColorSpace: SRGBColorSpace,
              alpha: false, // Opaque canvas prevents bleed-through
            }}
            onCreated={({ gl }) => {
              // Explicitly disable shadow maps in detailed view mode
              gl.shadowMap.enabled = false;
            }}
            camera={{ 
              position: [0, 5, 5], 
              fov: 10,
              near: 0.1,
              far: 1000
            }}
          >
            <color attach="background" args={["#ededed"]} />

            <SceneContent 
              carId={carId} 
              onModelLoaded={handleModelLoaded}
              isActive={isActive}
              onControlsReady={noopControlsReady} 
            />

            {/* Post-processing effects */}
            <EffectComposer multisampling={4} enableNormalPass={false}>
              {/* Subtle bloom for highlights */}
              <Bloom
                intensity={0.3}
                luminanceThreshold={0.85}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              {/* Mild brightness/contrast for studio punch */}
              <BrightnessContrast
                brightness={0.05}
                contrast={0.15}
              />
              {/* Boost saturation for vibrancy */}
              <HueSaturation
                saturation={0.2}
                hue={0}
              />
              {/* Film grain noise */}
              <Noise opacity={0.034} />
              {/* Subtle vignette for professional framing */}
              <Vignette
                offset={0.35}
                darkness={0.4}
                eskil={false}
              />
              <SMAA />
            </EffectComposer>
          </Canvas>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

