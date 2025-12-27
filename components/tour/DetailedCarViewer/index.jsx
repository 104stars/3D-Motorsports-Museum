"use client";

import { useEffect, useRef } from "react";
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
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import SceneContent from "./SceneContent";
import ControlsGuide from "./ControlsGuide";

/**
 * Detailed 3D car model viewer with high-quality rendering and post-processing
 */
export default function DetailedCarViewer({ carId, onClose, isActive }) {
  const modelBoundsRef = useRef(null);

  const handleModelLoaded = (bounds) => {
    modelBoundsRef.current = bounds;
  };

  // Handle ESC key to close
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onClose]);

  if (!carId || !isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-[60] w-screen h-screen bg-[#ededed]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className={cn(
            "absolute top-8 right-8 z-50 p-2",
            "text-black/50 hover:text-black",
            "transition-colors duration-200"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close viewer"
        >
          <X className="w-8 h-8" strokeWidth={1.5} />
        </motion.button>

        <ControlsGuide />

        {/* 3D Canvas */}
        <div className="absolute inset-0 w-full h-full">
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
              onControlsReady={() => {}} 
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

