"use client";

import { Suspense, useState, useMemo, useCallback } from "react";
import { Html } from "@react-three/drei";
import { getHighQualityModelUrl } from "@/lib/tour/carConfig";
import CarModel from "./CarModel";
import CameraController from "./CameraController";
import HighQualityLighting from "./HighQualityLighting";
import GroundContactShadow from "./GroundContactShadow";
import DetailedViewLoader from "./DetailedViewLoader";

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
        <div className="text-black text-center font-mono">
          <p className="text-sm uppercase tracking-wider mb-2">Model not found</p>
          <p className="text-xs text-black/40">High-quality model unavailable.</p>
        </div>
      </Html>
    );
  }

  return (
    <>
      <HighQualityLighting />
      
      <Suspense fallback={<DetailedViewLoader />}>
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

