"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useProgress } from "@react-three/drei";

/**
 * Pre-compiles all shaders AND uploads all textures to the GPU while the
 * loading screen is still visible. gl.compile() handles shader programs;
 * gl.initTexture() pushes each texture to VRAM so the first frustum entry
 * doesn't stall on lazy uploads.
 */
export default function SceneWarmup() {
  const { gl, scene, camera } = useThree();
  const { progress } = useProgress();
  const warmedUp = useRef(false);

  useEffect(() => {
    if (warmedUp.current || progress < 100) return;
    warmedUp.current = true;

    gl.compile(scene, camera);

    scene.traverse((obj) => {
      if (!obj.isMesh) return;
      const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
      for (const mat of mats) {
        if (!mat) continue;
        for (const key of Object.keys(mat)) {
          const val = mat[key];
          if (val?.isTexture) {
            gl.initTexture(val);
          }
        }
      }
    });
  }, [progress, gl, scene, camera]);

  return null;
}
