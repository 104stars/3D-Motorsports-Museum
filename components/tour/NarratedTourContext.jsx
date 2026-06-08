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
import { useLocale, useTranslations } from "next-intl";
import NarrationEngine from "./NarrationEngine";
import { announceA11y } from "./A11yAnnouncer";
import { NARRATION_ROUTE } from "@/lib/tour/narrationRoute";
import { getNarrationScript } from "@/lib/tour/narrationScripts";
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
  const locale = useLocale();
  // Held in a ref so the memoized callbacks below can announce without taking
  // the translator (whose identity changes each render) as a dependency.
  const tA11y = useTranslations("tour.a11y");
  const tA11yRef = useRef(tA11y);
  tA11yRef.current = tA11y;
  const [isActive, setIsActive] = useState(false);
  const [currentStopIndex, setCurrentStopIndex] = useState(0);
  const [tourState, setTourState] = useState("idle"); // idle | loading | narrating | paused | waiting | finished
  const [subtitleText, setSubtitleText] = useState("");
  const [narrationPhase, setNarrationPhase] = useState("intro"); // intro | body | outro
  const [isNarrating, setIsNarrating] = useState(false);
  // Default to text-only so audio narration never starts without explicit
  // user opt-in. Avoids overlap with screen readers and gives all users a
  // clean first impression; audio is enabled via the narrator toggle.
  const [isMuted, setIsMuted] = useState(true);

  const engineRef = useRef(null);
  const isMutedRef = useRef(false);

  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  // Lazy-init engine on client
  useEffect(() => {
    engineRef.current = new NarrationEngine();
    return () => engineRef.current?.destroy();
  }, []);

  const currentCarId = NARRATION_ROUTE[currentStopIndex] ?? null;
  const currentCarInfo = currentCarId ? getCarInfo(currentCarId, locale) : null;
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
      const script = getNarrationScript(carId, locale);
      if (!script) return;

      // Muted / text-only mode: render the full stop script at once and let
      // the user read at their own pace. Skips speech synthesis entirely so
      // it does not compete with screen readers.
      if (isMutedRef.current) {
        engine.stop();
        const fullText = [script.intro, script.body, script.outro]
          .filter(Boolean)
          .join(" ");
        setSubtitleText(fullText);
        setNarrationPhase("body");
        setIsNarrating(false);
        setTourState("waiting");
        return;
      }

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
          setIsNarrating(false);
          setTourState("waiting");
        }
      };

      engine.speak(text, locale);
    },
    [locale],
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
    announceA11y(tA11yRef.current("narrationPaused"));
  }, []);

  const resumeNarration = useCallback(() => {
    engineRef.current?.resume();
    setTourState("narrating");
    announceA11y(tA11yRef.current("narrationResumed"));
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

  const previousStop = useCallback(() => {
    if (currentStopIndex <= 0) return;
    engineRef.current?.stop();
    const prev = currentStopIndex - 1;
    setCurrentStopIndex(prev);
    startNarrationForStop(prev);
  }, [currentStopIndex, startNarrationForStop]);

  const goToStop = useCallback(
    (stopIndex) => {
      if (stopIndex < 0 || stopIndex >= totalStops) return;
      if (stopIndex === currentStopIndex) return;
      engineRef.current?.stop();
      setCurrentStopIndex(stopIndex);
      prefetchStop(stopIndex - 1);
      prefetchStop(stopIndex + 1);
      startNarrationForStop(stopIndex);
    },
    [currentStopIndex, totalStops, startNarrationForStop],
  );

  const replayCurrentStop = useCallback(() => {
    engineRef.current?.stop();
    startNarrationForStop(currentStopIndex);
  }, [currentStopIndex, startNarrationForStop]);

  const toggleMute = useCallback(() => {
    const next = !isMuted;

    // Update the ref synchronously so speakPhase reads the correct value the
    // moment startNarrationForStop calls it below (before the React state
    // update + effect cycle has completed).
    isMutedRef.current = next;
    setIsMuted(next);
    announceA11y(tA11yRef.current(next ? "textOnlyMode" : "audioNarrationOn"));

    if (next) {
      // Going muted: stop current speech and surface the full stop text so
      // the user can read at their own pace.
      engineRef.current?.stop();
      setIsNarrating(false);
      const carId = NARRATION_ROUTE[currentStopIndex];
      const script = carId ? getNarrationScript(carId, locale) : null;
      if (script) {
        const fullText = [script.intro, script.body, script.outro]
          .filter(Boolean)
          .join(" ");
        setSubtitleText(fullText);
        setNarrationPhase("body");
        setTourState("waiting");
      }
    } else {
      // Going unmuted: restart narration for the current stop with audio.
      startNarrationForStop(currentStopIndex);
    }
  }, [isMuted, currentStopIndex, locale, startNarrationForStop]);

  const canGoBack = currentStopIndex > 0;

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
      isMuted,
      canGoBack,
      activateTour,
      deactivateTour,
      nextStop,
      skipStop,
      pauseNarration,
      resumeNarration,
      beginFirstStop,
      restartTour,
      previousStop,
      goToStop,
      replayCurrentStop,
      toggleMute,
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
      isMuted,
      canGoBack,
      activateTour,
      deactivateTour,
      nextStop,
      skipStop,
      pauseNarration,
      resumeNarration,
      beginFirstStop,
      restartTour,
      previousStop,
      goToStop,
      replayCurrentStop,
      toggleMute,
    ],
  );

  return (
    <NarratedTourContext.Provider value={value}>
      {children}
    </NarratedTourContext.Provider>
  );
}
