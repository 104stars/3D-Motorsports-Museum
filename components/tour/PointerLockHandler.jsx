"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";

export default function PointerLockHandler() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    const handleClick = () => {
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
  }, [gl]);

  return null;
}

