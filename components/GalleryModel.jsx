"use client";

import { useEffect, useMemo } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import {
  Box3,
  Color,
  MeshBasicMaterial,
  SRGBColorSpace,
  Vector3,
} from "three";
import { getGalleryModelUrl } from "@/lib/supabase/storage";

const MODEL_PATH = getGalleryModelUrl();

export default function GalleryModel({ onBoundsReady, ...props }) {
  const { scene } = useGLTF(MODEL_PATH);

  const bakedScene = useMemo(() => {
    if (!scene) return null;
    const clone = scene.clone(true);

    clone.traverse((child) => {
      if (!child.isMesh) return;

      const materials = Array.isArray(child.material)
        ? child.material
        : [child.material];

      const bakedMaterials = materials.map((material) => {
        if (!material) return new MeshBasicMaterial({ color: new Color("#fff") });

        const texture = material.map ?? null;
        if (texture) {
          texture.colorSpace = SRGBColorSpace;
          texture.anisotropy = Math.max(texture.anisotropy ?? 1, 4);
        }

        return new MeshBasicMaterial({
          map: texture,
          color: material.color ?? new Color("#fff"),
        });
      });

      child.material = Array.isArray(child.material)
        ? bakedMaterials
        : bakedMaterials[0];
      child.receiveShadow = false;
      child.castShadow = false;
    });

    return clone;
  }, [scene]);

  useEffect(() => {
    if (!bakedScene || !onBoundsReady) return;

    const box = new Box3().setFromObject(bakedScene);
    const center = box.getCenter(new Vector3());

    onBoundsReady({
      minX: box.min.x,
      maxX: box.max.x,
      minZ: box.min.z,
      maxZ: box.max.z,
      center,
    });
  }, [bakedScene, onBoundsReady]);

  if (!bakedScene) return null;

  return (
    <RigidBody type="fixed" colliders="trimesh" restitution={0} friction={1}>
      <primitive object={bakedScene} {...props} />
    </RigidBody>
  );
}

useGLTF.preload(MODEL_PATH);

