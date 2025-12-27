"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";

export default function PointerLockHandler({ isOverlayOpen = false }) {
  const { gl } = useThree();
  const wasOverlayOpenRef = useRef(isOverlayOpen);

  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    const handleClick = () => {
      // Don't request pointer lock if any overlay is open
      if (isOverlayOpen) return;
      
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
  }, [gl, isOverlayOpen]);

  // Handle overlay open/close transitions
  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    // Overlay just opened - exit pointer lock
    if (isOverlayOpen && !wasOverlayOpenRef.current) {
      if (document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
      canvas.style.cursor = "auto";
    }

    // Overlay just closed - re-request pointer lock
    if (!isOverlayOpen && wasOverlayOpenRef.current) {
      if (
        canvas.requestPointerLock &&
        document.pointerLockElement !== canvas
      ) {
        canvas.requestPointerLock();
      }
    }

    wasOverlayOpenRef.current = isOverlayOpen;
  }, [isOverlayOpen, gl]);

  return null;
}
