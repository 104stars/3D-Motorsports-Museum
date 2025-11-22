"use client";

import { useMemo } from "react";
import { useGLTF } from "@react-three/drei";

/**
 * Generic wrapper for loading and placing car GLTF models inside the gallery.
 * Designed for multiple cars: handles basic lighting/shadow flags on meshes.
 */
export default function CarModel({
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  ...primitiveProps
}) {
  const { scene } = useGLTF(modelPath);

  const carScene = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone(true);

    // Enable shadows on car meshes; gallery remains unaffected since it uses MeshBasicMaterial.
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    return clone;
  }, [scene]);

  if (!carScene) return null;

  return (
    <group position={position} rotation={rotation} scale={scale}>
      <primitive object={carScene} {...primitiveProps} />
    </group>
  );
}

export function preloadCarModel(path) {
  useGLTF.preload(path);
}

