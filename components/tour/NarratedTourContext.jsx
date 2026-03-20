"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useGLTF } from "@react-three/drei";
import NarrationEngine from "./NarrationEngine";
import { NARRATION_ROUTE } from "@/lib/tour/narrationRoute";
import { NARRATION_SCRIPTS } from "@/lib/tour/narrationScripts";
import { getHighQualityModelUrl } from "@/lib/tour/carConfig";
import { getCarInfo } from "@/lib/tour/carInfo";

const NarratedTourContext = createContext(null);

export function useNarratedTour() {
  const ctx = useContext(NarratedTourContext);
  if (!ctx) throw new Error("useNarratedTour must be used within NarratedTourProvider");
  return ctx;
}

/**
 * Trigger useGLTF.preload for a given stop index (safe no-op if out of range).
 */
function prefetchStop(index) {
  if (index < 0 || index >= NARRATION_ROUTE.length) return;
  const url = getHighQualityModelUrl(NARRATION_ROUTE[index]);
  if (url) useGLTF.preload(url);
}

export function NarratedTourProvider({ children }) {
  const [isActive, setIsActive] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [tourState, setTourState] = useState("idle"); // idle | loading | narrating | paused | waiting | finished
  const [subtitleText, setSubtitleText] = useState("");
  const [narrationPhase, setNarrationPhase] = useState("intro"); // intro | body | outro
  const [isNarrating, setIsNarrating] = useState(false);

  const engineRef = useRef(null);

  // Lazy-init engine on client
  useEffect(() => {
    engineRef.current = new NarrationEngine();
    return () => engineRef.current?.destroy();
  }, []);

  const currentCarId = NARRATION_ROUTE[currentStopIndex] ?? null;
  const currentCarInfo = currentCarId ? getCarInfo(currentCarId) : null;
  const totalStops = NARRATION_ROUTE.length;

  // Wire engine state back to React
  useEffect(() => {
    const engine = engineRef.current;
    if (!engine) return;

    engine.onStateChange = ({ isSpeaking, isPaused }) => {
      setIsNarrating(isSpeaking && !isPaused);
    };

    return () => {
      engine.onStateChange = null;
    };
  }, []);

  const speakPhase = useCallback(
    (phase, stopIndex) => {
      const engine = engineRef.current;
      if (!engine) return;

      const carId = NARRATION_ROUTE[stopIndex];
      const script = NARRATION_SCRIPTS[carId];
      if (!script) return;

      const text = script[phase];
      if (!text) return;

      setSubtitleText(text);
      setNarrationPhase(phase);

      engine.onEnd = () => {
        if (phase === "intro") {
          speakPhase("body", stopIndex);
        } else if (phase === "body") {
          speakPhase("outro", stopIndex);
        } else {
          // outro finished
          setIsNarrating(false);
          setTourState("waiting");
        }
      };

      engine.speak(text);
    },
    [],
  );

  const startNarrationForStop = useCallback(
    (stopIndex) => {
      setTourState("narrating");
      prefetchStop(stopIndex + 2);
      speakPhase("intro", stopIndex);
    },
    [speakPhase],
  );

  const activateTour = useCallback(() => {
    setIsActive(true);
    setCurrentStopIndex(0);
    setTourState("loading");
    setSubtitleText("");
    // Prefetch first two stops
    prefetchStop(0);
    prefetchStop(1);
  }, []);

  const deactivateTour = useCallback(() => {
    engineRef.current?.stop();
    setIsActive(false);
    setCurrentStopIndex(0);
    setTourState("idle");
    setSubtitleText("");
    setIsNarrating(false);
  }, []);

  const nextStop = useCallback(() => {
    engineRef.current?.stop();

    const next = currentStopIndex + 1;
    if (next >= totalStops) {
      setTourState("finished");
      setIsNarrating(false);
      return;
    }

    setCurrentStopIndex(next);
    startNarrationForStop(next);
  }, [currentStopIndex, totalStops, startNarrationForStop]);

  const skipStop = useCallback(() => {
    nextStop();
  }, [nextStop]);

  const pauseNarration = useCallback(() => {
    engineRef.current?.pause();
    setTourState("paused");
  }, []);

  const resumeNarration = useCallback(() => {
    engineRef.current?.resume();
    setTourState("narrating");
  }, []);

  const beginFirstStop = useCallback(() => {
    startNarrationForStop(0);
  }, [startNarrationForStop]);

  const restartTour = useCallback(() => {
    engineRef.current?.stop();
    setCurrentStopIndex(0);
    setTourState("loading");
    setSubtitleText("");
    setIsNarrating(false);
    prefetchStop(0);
    prefetchStop(1);
  }, []);

  const value = useMemo(
    () => ({
      isActive,
      currentStopIndex,
      currentCarId,
      currentCarInfo,
      totalStops,
      tourState,
      subtitleText,
      narrationPhase,
      isNarrating,
      activateTour,
      deactivateTour,
      nextStop,
      skipStop,
      pauseNarration,
      resumeNarration,
      beginFirstStop,
      restartTour,
    }),
    [
      isActive,
      currentStopIndex,
      currentCarId,
      currentCarInfo,
      totalStops,
      tourState,
      subtitleText,
      narrationPhase,
      isNarrating,
      activateTour,
      deactivateTour,
      nextStop,
      skipStop,
      pauseNarration,
      resumeNarration,
      beginFirstStop,
      restartTour,
    ],
  );

  return (
    <NarratedTourContext.Provider value={value}>
      {children}
    </NarratedTourContext.Provider>
  );
}
