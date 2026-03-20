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
import PauseMenu from "@/components/tour/PauseMenu";
import { EYE_HEIGHT, CAMERA_PROPS } from "@/lib/tour/constants";
import { CarDetectionProvider } from "@/components/tour/CarDetectionContext";
import CarHoverDetector from "@/components/tour/CarHoverDetector";
import SceneWarmup from "@/components/tour/SceneWarmup";
import { CAR_CONFIGS } from "@/lib/tour/carConfig";
import ModeSelectionScreen from "@/components/tour/ModeSelectionScreen";
import { NarratedTourProvider, useNarratedTour } from "@/components/tour/NarratedTourContext";
import TourPreloader from "@/components/tour/TourPreloader";
import NarratedTourHUD from "@/components/tour/NarratedTourHUD";
import DetailedCarViewer from "@/components/tour/DetailedCarViewer";

CAR_CONFIGS.forEach((car) => useGLTF.preload(car.modelPath));
useLoader.preload(HDRLoader, "/shop.hdr");

export default function TourPage() {
  return (
    <NarratedTourProvider>
      <TourPageInner />
    </NarratedTourProvider>
  );
}

function TourPageInner() {
  const [spawn, setSpawn] = useState(null);
  const [ready, setReady] = useState(false);
  const [hoveredCarId, setHoveredCarId] = useState(null);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [isViewerActive, setIsViewerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const hoveredCarIdRef = useRef(null);
  const canvasRef = useRef(null);

  // Mode selection: null = not chosen, "free" = free roam, "tour" = narrated tour
  const [loaderComplete, setLoaderComplete] = useState(false);
  const [modeSelected, setModeSelected] = useState(null);
  const [tourPreloading, setTourPreloading] = useState(false);

  const tour = useNarratedTour();

  useEffect(() => {
    hoveredCarIdRef.current = hoveredCarId;
  }, [hoveredCarId]);

  // Suppress pointer-lock pause menu during tour or before mode is selected
  useEffect(() => {
    const handlePointerLockChange = () => {
      const canvas = canvasRef.current;
      const isLocked = document.pointerLockElement === canvas;

      if (!isLocked && canvas && !selectedCarId && !isViewerActive && !tour.isActive && modeSelected === "free") {
        setIsPaused(true);
      }
    };

    document.addEventListener("pointerlockchange", handlePointerLockChange);
    return () => document.removeEventListener("pointerlockchange", handlePointerLockChange);
  }, [selectedCarId, isViewerActive, tour.isActive, modeSelected]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isPaused) {
        setIsPaused(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPaused]);

  const handleBoundsReady = useCallback((box) => {
    if (!box) return;
    setSpawn([box.center.x, EYE_HEIGHT + 1, box.center.z]);
    setTimeout(() => setReady(true), 800);
  }, []);

  const handleCanvasClick = useCallback(() => {
    if (hoveredCarIdRef.current && !selectedCarId && !isPaused && !tour.isActive) {
      setSelectedCarId(hoveredCarIdRef.current);
    }
  }, [selectedCarId, isPaused, tour.isActive]);

  const handleClosePanel = useCallback(() => {
    setSelectedCarId(null);
    setIsViewerActive(false);
  }, []);

  const handleViewerStateChange = useCallback((active) => {
    setIsViewerActive(active);
  }, []);

  const handleResume = useCallback(() => {
    setIsPaused(false);
    setTimeout(() => {
      canvasRef.current?.requestPointerLock?.();
    }, 50);
  }, []);

  // --- Mode selection handlers ---
  const handleLoaderComplete = useCallback(() => {
    setLoaderComplete(true);
  }, []);

  const handleFreeRoam = useCallback(() => {
    setModeSelected("free");
  }, []);

  const handleNarratedTour = useCallback(() => {
    tour.activateTour();
    setTourPreloading(true);
    setModeSelected("tour");
  }, [tour]);

  const handleTourPreloadReady = useCallback(() => {
    setTourPreloading(false);
    tour.beginFirstStop();
  }, [tour]);

  // Start tour from pause menu
  const handleStartTourFromPause = useCallback(() => {
    setIsPaused(false);
    tour.activateTour();
    setTourPreloading(true);
    setModeSelected("tour");
  }, [tour]);

  // When tour deactivates, return to free roam
  useEffect(() => {
    if (!tour.isActive && modeSelected === "tour") {
      setModeSelected("free");
    }
  }, [tour.isActive, modeSelected]);

  const isPanelOpen = selectedCarId !== null;
  const isOverlayOpen = isPanelOpen || isPaused || tour.isActive;

  const showModeSelection = loaderComplete && !modeSelected;

  return (
    <div className="w-full h-screen bg-neutral-950 relative">
      <Canvas
        shadows
        camera={CAMERA_PROPS}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          outputColorSpace: SRGBColorSpace,
        }}
        onPointerDown={handleCanvasClick}
        onCreated={({ gl }) => {
          canvasRef.current = gl.domElement;
        }}
      >
        <Stats />
        <SceneWarmup />
        <KeyboardControls map={isOverlayOpen || showModeSelection ? [] : PLAYER_KEYBOARD_MAP}>
          <Physics gravity={[0, -9.81, 0]} timeStep={1 / 60}>
            <CarStageLighting />
            <PointerLockHandler isOverlayOpen={isOverlayOpen || showModeSelection} />
            <CameraPositionLogger />

            <Suspense fallback={null}>
              <GalleryModel onBoundsReady={handleBoundsReady} />
            </Suspense>

            <CarDetectionProvider>
              <Suspense fallback={null}>
                <CarExhibits />
              </Suspense>
              {!isOverlayOpen && !isViewerActive && !isPaused && !showModeSelection && (
                <CarHoverDetector onDetect={setHoveredCarId} />
              )}
            </CarDetectionProvider>

            {spawn && ready && <PlayerController spawn={spawn} />}
            <color attach="background" args={["#000000"]} />
          </Physics>
        </KeyboardControls>
      </Canvas>
      <CustomLoader onComplete={handleLoaderComplete} />

      {/* Mode Selection Screen */}
      <ModeSelectionScreen
        isVisible={showModeSelection}
        onFreeRoam={handleFreeRoam}
        onNarratedTour={handleNarratedTour}
      />

      {/* Tour Preloader */}
      <TourPreloader
        isActive={tourPreloading}
        onReady={handleTourPreloadReady}
      />

      {/* Narrated Tour — DetailedCarViewer + HUD */}
      {tour.isActive && tour.tourState !== "loading" && tour.tourState !== "finished" && (
        <DetailedCarViewer
          key={tour.currentCarId}
          carId={tour.currentCarId}
          isActive={true}
          tourMode={true}
        />
      )}
      <NarratedTourHUD />

      {/* Crosshair — hidden when any overlay is open or mode not selected */}
      {!isOverlayOpen && modeSelected === "free" && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
          {hoveredCarId ? (
            <Eye className="w-5 h-5 text-white" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          )}
        </div>
      )}

      {/* Pause Menu */}
      <PauseMenu
        isOpen={isPaused}
        onResume={handleResume}
        onStartTour={handleStartTourFromPause}
      />

      {/* Car Information Panel (free roam only) */}
      {!tour.isActive && (
        <CarInformationPanel
          carId={selectedCarId}
          onClose={handleClosePanel}
          onViewerStateChange={handleViewerStateChange}
        />
      )}
    </div>
  );
}
