"use client";

import { useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { POSITION_LOGGER_DEFAULT_ENABLED } from "@/lib/tour/constants";

export default function CameraPositionLogger({
  interval = 0.5,
  hotkey = "KeyL",
  defaultEnabled = POSITION_LOGGER_DEFAULT_ENABLED,
} = {}) {
  const enabledRef = useRef(defaultEnabled);
  const lastLogRef = useRef(0);

  useEffect(() => {
    enabledRef.current = defaultEnabled;
  }, [defaultEnabled]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== hotkey) return;
      enabledRef.current = !enabledRef.current;
      console.info(
        `[CameraPositionLogger] ${enabledRef.current ? "enabled" : "disabled"}`
      );
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkey]);

  useFrame(({ camera, clock }) => {
    if (!enabledRef.current) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastLogRef.current < interval) return;
    lastLogRef.current = elapsed;
    const { x, y, z } = camera.position;
    console.log(
      `[CameraPosition] x:${x.toFixed(2)} y:${y.toFixed(2)} z:${z.toFixed(2)}`
    );
  });

  return null;
}

