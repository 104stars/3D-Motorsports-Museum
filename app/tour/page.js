"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { KeyboardControls, useGLTF, Stats } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { Eye } from "lucide-react";
import GalleryModel from "@/components/GalleryModel";
import PlayerController, {
  PLAYER_KEYBOARD_MAP,
} from "@/components/PlayerController";
import CustomLoader from "@/components/tour/CustomLoader";
import CarStageLighting from "@/components/tour/CarStageLighting";
import CarExhibits from "@/components/tour/CarExhibits";
import PointerLockHandler from "@/components/tour/PointerLockHandler";
import CameraPositionLogger from "@/components/tour/CameraPositionLogger";
import CarInformationPanel from "@/components/tour/CarInformationPanel";
import { EYE_HEIGHT, CAMERA_PROPS } from "@/lib/tour/constants";
import { CarDetectionProvider } from "@/components/tour/CarDetectionContext";
import CarHoverDetector from "@/components/tour/CarHoverDetector";
import { CAR_CONFIGS } from "@/lib/tour/carConfig";

// Pre-enqueue all known tour assets so the loader total is stable from the start
CAR_CONFIGS.forEach((car) => useGLTF.preload(car.modelPath));
useLoader.preload(HDRLoader, "/shop.hdr");

export default function TourPage() {
  const [spawn, setSpawn] = useState(null);
  const [ready, setReady] = useState(false);
  const [hoveredCarId, setHoveredCarId] = useState(null);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [isViewerActive, setIsViewerActive] = useState(false);
  const hoveredCarIdRef = useRef(null);

  // Keep ref in sync with state for click handler
  useEffect(() => {
    hoveredCarIdRef.current = hoveredCarId;
  }, [hoveredCarId]);

  const handleBoundsReady = useCallback((box) => {
    if (!box) return;
    setSpawn([box.center.x, EYE_HEIGHT + 1, box.center.z]);
    setTimeout(() => setReady(true), 300);
  }, []);

  // Handle click to open car info panel
  const handleCanvasClick = useCallback(() => {
    if (hoveredCarIdRef.current && !selectedCarId) {
      setSelectedCarId(hoveredCarIdRef.current);
    }
  }, [selectedCarId]);

  // Close the panel
  const handleClosePanel = useCallback(() => {
    setSelectedCarId(null);
    setIsViewerActive(false); // Reset viewer state when panel closes
  }, []);

  // Handle viewer state changes from panel
  const handleViewerStateChange = useCallback((active) => {
    setIsViewerActive(active);
  }, []);

  const isPanelOpen = selectedCarId !== null;

  return (
    <div className="w-full h-screen bg-neutral-950 relative">
      <Canvas
        shadows
        camera={CAMERA_PROPS}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          // Use ACESFilmic for realistic lighting falloff
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          outputColorSpace: SRGBColorSpace,
        }}
        onPointerDown={handleCanvasClick}
      >
        <Stats />
        <KeyboardControls map={isPanelOpen ? [] : PLAYER_KEYBOARD_MAP}>
          <Physics gravity={[0, -9.81, 0]} timeStep="vary">
            <CarStageLighting />
            <PointerLockHandler isPanelOpen={isPanelOpen} />
            <CameraPositionLogger />

            <Suspense fallback={null}>
              <GalleryModel onBoundsReady={handleBoundsReady} />
            </Suspense>

            <CarDetectionProvider>
              {!isPanelOpen && !isViewerActive && (
                <Suspense fallback={null}>
                  <CarExhibits />
                </Suspense>
              )}
              {!isViewerActive && (
                <CarHoverDetector onDetect={setHoveredCarId} />
              )}
            </CarDetectionProvider>

            {spawn && ready && <PlayerController spawn={spawn} />}
            <color attach="background" args={["#000000"]} />
          </Physics>
        </KeyboardControls>
      </Canvas>
      <CustomLoader />
      
      {/* Crosshair - hidden when panel is open */}
      {!isPanelOpen && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          {hoveredCarId ? (
            <Eye className="w-5 h-5 text-white" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          )}
        </div>
      )}

      {/* Car Information Panel */}
      <CarInformationPanel 
        carId={selectedCarId} 
        onClose={handleClosePanel}
        onViewerStateChange={handleViewerStateChange}
      />
    </div>
  );
}
