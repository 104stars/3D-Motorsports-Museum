"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { Html } from "@react-three/drei";
import { Loader2 } from "lucide-react";
import { getHighQualityModelUrl } from "@/lib/tour/carConfig";
import CarModel from "./CarModel";
import CameraController from "./CameraController";
import HighQualityLighting from "./HighQualityLighting";
import GroundContactShadow from "./GroundContactShadow";

/**
 * Scene content with model, lighting, and post-processing
 */
export default function SceneContent({ carId, onModelLoaded, isActive, onControlsReady }) {
  const modelUrl = useMemo(() => getHighQualityModelUrl(carId), [carId]);
  const [modelBounds, setModelBounds] = useState(null);

  const handleModelLoaded = useCallback((bounds) => {
    setModelBounds(bounds);
    if (onModelLoaded) {
      onModelLoaded(bounds);
    }
  }, [onModelLoaded]);

  if (!modelUrl) {
    return (
      <Html center>
        <div className="text-white text-center">
          <p className="text-lg mb-2">Model not found</p>
          <p className="text-sm text-white/60">High-quality model for this car is not available.</p>
        </div>
      </Html>
    );
  }

  return (
    <>
      <HighQualityLighting />
      
      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
              <p className="text-white/70 text-sm">Loading high-quality model...</p>
            </div>
          </Html>
        }
      >
        <CarModel carId={carId} url={modelUrl} onLoaded={handleModelLoaded} />
      </Suspense>

      {/* Contact shadow - renders once bounds are available */}
      {modelBounds && <GroundContactShadow />}

      <CameraController 
        modelBounds={modelBounds} 
        isActive={isActive}
        onControlsReady={onControlsReady}
      />
    </>
  );
}

