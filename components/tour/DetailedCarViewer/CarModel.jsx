"use client";

import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3 } from "three";

/**
 * High-quality car model component with enhanced materials
 * Normalizes all models to a consistent size for uniform viewing experience
 */
export default function CarModel({ carId, url, onLoaded }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef(null);
  const groupRef = useRef(null);
  const TARGET_MAX_DIMENSION = 5; // Normalize all models to have max dimension of 5 units

  useEffect(() => {
    if (!scene || !modelRef.current || !groupRef.current) return;

    // Enhance materials for high-quality rendering
    scene.traverse((child) => {
      if (!child.isMesh) return;
      
      // Increase material quality if needed
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (mat.roughness !== undefined) {
            // Keep original roughness values but ensure quality
            mat.needsUpdate = true;
          }
        });
      }
    });

    // Calculate bounding box to determine normalization scale
    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    
    // Calculate normalization scale factor
    // If maxDimension is 0 or very small, use scale of 1 to avoid division issues
    const normalizeScale = maxDimension > 0.001 ? TARGET_MAX_DIMENSION / maxDimension : 1;
    
    // Apply normalization scale to the group
    groupRef.current.scale.setScalar(normalizeScale);

    // Ground-align the model so the lowest point sits at y=0 (in normalized space).
    // This lets us keep <ContactShadows /> at its default position/scale (preserves blur).
    const minY = box.min.y;
    let groundLift = -minY * normalizeScale;

    // Per-model micro adjustments (some models have pivots/geometry that make shadows clip or float)
    if (carId === "mclaren-mp45") {
      groundLift += 0.01; // lift model up a bit so shadow doesn't clip into tires
    } else if (carId === "ferrari-499") {
      groundLift -= 0.01; // slightly lower so shadow touches tires more (inverse issue)
    }

    groupRef.current.position.set(0, groundLift, 0);
    
    // Calculate normalized bounds for camera positioning
    const normalizedSize = size.clone().multiplyScalar(normalizeScale);
    const normalizedCenter = center.clone().multiplyScalar(normalizeScale);
    normalizedCenter.y += groundLift;
    
    // Notify parent with normalized bounds
    if (onLoaded) {
      onLoaded({ 
        center: normalizedCenter, 
        size: normalizedSize, 
        scene,
        originalScale: normalizeScale 
      });
    }
  }, [scene, onLoaded, carId]);

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      <primitive ref={modelRef} object={scene} />
    </group>
  );
}

