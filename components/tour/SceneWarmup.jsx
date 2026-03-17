"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";

/**
 * Pre-compiles all shaders/materials in the scene graph while the loading
 * screen is still visible. This eliminates the GPU spike that otherwise
 * occurs the first time each mesh enters the camera frustum.
 */
export default function SceneWarmup() {
  const { gl, scene, camera } = useThree();
  const { progress } = useProgress();
  const compiled = useRef(false);

  useEffect(() => {
    if (compiled.current || progress < 100) return;
    compiled.current = true;
    gl.compile(scene, camera);
  }, [progress, gl, scene, camera]);

  return null;
}
