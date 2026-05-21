"use client";

import { Canvas, useLoader } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { KeyboardControls, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { ACESFilmicToneMapping, SRGBColorSpace } from "three";
import { HDRLoader } from "three/examples/jsm/loaders/HDRLoader.js";
import { Eye } from "lucide-react";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { useTranslations } from "next-intl";
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
import A11yAnnouncer from "@/components/tour/A11yAnnouncer";
import CarA11yList from "@/components/tour/CarA11yList";

useLoader.preload(HDRLoader, "/shop.hdr");

export default function TourPage() {
  return (
    <NarratedTourProvider>
      <TourPageInner />
    </NarratedTourProvider>
  );
}

function TourPageInner() {
  const t = useTranslations("tour.a11y");
  const shouldReduceMotion = useReducedMotion();
  const [spawn, setSpawn] = useState(null);
  const [ready, setReady] = useState(false);
  const [hoveredCarId, setHoveredCarId] = useState(null);
  const [selectedCarId, setSelectedCarId] = useState(null);
  const [isViewerActive, setIsViewerActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const hoveredCarIdRef = useRef(null);
  const canvasRef = useRef(null);

  const [loaderComplete, setLoaderComplete] = useState(false);
  const [modeSelected, setModeSelected] = useState(null);
  const [tourPreloading, setTourPreloading] = useState(false);

  const tour = useNarratedTour();

  const [viewerReady, setViewerReady] = useState(false);
  const viewerCarIdRef = useRef(null);

  useEffect(() => {
    hoveredCarIdRef.current = hoveredCarId;
  }, [hoveredCarId]);

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
    CAR_CONFIGS.forEach((car) => useGLTF.preload(car.modelPath));
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

  const handleStartTourFromPause = useCallback(() => {
    setIsPaused(false);
    tour.activateTour();
    setTourPreloading(true);
    setModeSelected("tour");
  }, [tour]);

  useEffect(() => {
    if (!tour.isActive && modeSelected === "tour") {
      setModeSelected("free");
    }
  }, [tour.isActive, modeSelected]);

  const showTourViewer = tour.isActive && tour.tourState !== "loading" && tour.tourState !== "finished";
  const tourCarId = showTourViewer ? tour.currentCarId : null;

  if (tourCarId !== viewerCarIdRef.current) {
    viewerCarIdRef.current = tourCarId;
    if (viewerReady) setViewerReady(false);
  }

  const handleViewerReady = useCallback(() => {
    setViewerReady(true);
  }, []);

  const isPanelOpen = selectedCarId !== null;
  const isOverlayOpen = isPanelOpen || isPaused || tour.isActive;

  const showModeSelection = loaderComplete && !modeSelected;

  // Intercept Tab in free roam before the browser can move focus to its own
  // chrome (address bar etc.), which would drop pointer lock and open the pause
  // menu. Instead, redirect focus into the a11y exhibit list. If focus is
  // already inside the list, let Tab cycle through it naturally.
  useEffect(() => {
    if (modeSelected !== "free") return;

    const handleTab = (e) => {
      if (e.key !== "Tab") return;
      if (isOverlayOpen || isViewerActive) return;

      const nav = document.querySelector("[data-a11y-list]");
      if (!nav || nav.contains(document.activeElement)) return;

      e.preventDefault();
      nav.querySelector("button")?.focus();
    };

    document.addEventListener("keydown", handleTab, { capture: true });
    return () => document.removeEventListener("keydown", handleTab, { capture: true });
  }, [modeSelected, isOverlayOpen, isViewerActive]);

  const handleA11yCarSelect = useCallback((id) => {
    if (!tour.isActive && !isViewerActive) {
      setSelectedCarId(id);
    }
  }, [tour.isActive, isViewerActive]);

  return (
    <div
      className="w-full h-screen bg-neutral-950 relative"
      role="application"
      aria-label={t("appLabel")}
    >
      <A11yAnnouncer />
      <CarA11yList
        onSelect={handleA11yCarSelect}
        disabled={isOverlayOpen || showModeSelection || isViewerActive}
      />
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

      <ModeSelectionScreen
        isVisible={showModeSelection}
        onFreeRoam={handleFreeRoam}
        onNarratedTour={handleNarratedTour}
      />

      <TourPreloader
        isActive={tourPreloading}
        onReady={handleTourPreloadReady}
      />

      {showTourViewer && (
        <>
          <DetailedCarViewer
            key={tour.currentCarId}
            carId={tour.currentCarId}
            isActive={true}
            tourMode={true}
            onReady={handleViewerReady}
          />
          <AnimatePresence>
            {!viewerReady && (
              <motion.div
                key="tour-transition"
                className="fixed inset-0 z-[62] bg-[#ededed]"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: "easeOut" }}
                aria-hidden="true"
              />
            )}
          </AnimatePresence>
        </>
      )}
      <NarratedTourHUD />

      {!isOverlayOpen && modeSelected === "free" && (
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
          aria-hidden="true"
        >
          {hoveredCarId ? (
            <Eye className="w-5 h-5 text-white" />
          ) : (
            <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
          )}
        </div>
      )}

      <PauseMenu
        isOpen={isPaused}
        onResume={handleResume}
        onStartTour={handleStartTourFromPause}
      />

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
