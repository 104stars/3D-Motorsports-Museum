"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function PointerLockHandler({ isPanelOpen = false }) {
  const { gl } = useThree();
  const wasPanelOpenRef = useRef(isPanelOpen);

  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    const handleClick = () => {
      // Don't request pointer lock if panel is open
      if (isPanelOpen) return;
      
      if (document.pointerLockElement !== canvas && canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === canvas;
      canvas.style.cursor = locked ? "none" : "auto";
    };

    canvas.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
      canvas.style.cursor = "auto";
    };
  }, [gl, isPanelOpen]);

  // Handle panel open/close transitions
  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    // Panel just opened - exit pointer lock
    if (isPanelOpen && !wasPanelOpenRef.current) {
      if (document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
      canvas.style.cursor = "auto";
    }

    // Panel just closed - re-request pointer lock
    if (!isPanelOpen && wasPanelOpenRef.current) {
      if (
        canvas.requestPointerLock &&
        document.pointerLockElement !== canvas
      ) {
        canvas.requestPointerLock();
      }
    }

    wasPanelOpenRef.current = isPanelOpen;
  }, [isPanelOpen, gl]);

  return null;
}
