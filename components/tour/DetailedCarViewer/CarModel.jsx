"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { Box3, Vector3, LinearMipmapLinearFilter, LinearFilter } from "three";

/**
 * High-quality car model component with enhanced materials
 * Normalizes all models to a consistent size for uniform viewing experience
 */
export default function CarModel({ carId, url, onLoaded }) {
  const { scene } = useGLTF(url);
  const gl = useThree((s) => s.gl);
  const modelRef = useRef(null);
  const groupRef = useRef(null);
  const TARGET_MAX_DIMENSION = 5; // Normalize all models to have max dimension of 5 units

  useEffect(() => {
    if (!scene || !modelRef.current || !groupRef.current || !gl) return;

    const maxAnisotropy =
      typeof gl.capabilities?.getMaxAnisotropy === "function"
        ? gl.capabilities.getMaxAnisotropy()
        : 1;
    // 8–16 is usually enough; maxing out can be expensive on some GPUs
    const desiredAnisotropy = Math.max(1, Math.min(maxAnisotropy, 16));

    // Enhance materials/textures for high-quality rendering (especially liveries at grazing angles)
    scene.traverse((child) => {
      if (!child.isMesh) return;
      
      // Increase material quality if needed
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          // Sharpen textures at oblique angles (classic "blurry further away on the surface" issue)
          // Apply to all common texture slots used by glTF materials.
          const textureSlots = [
            "map",
            "emissiveMap",
            "normalMap",
            "roughnessMap",
            "metalnessMap",
            "aoMap",
            "alphaMap",
            "clearcoatMap",
            "clearcoatNormalMap",
            "clearcoatRoughnessMap",
            "sheenColorMap",
            "sheenRoughnessMap",
            "specularColorMap",
            "specularIntensityMap",
            "iridescenceMap",
            "iridescenceThicknessMap",
            "transmissionMap",
            "thicknessMap",
          ];

          textureSlots.forEach((slot) => {
            const tex = mat?.[slot];
            if (!tex) return;

            // Only increase anisotropy (safe even when mipmaps are present)
            if (tex.anisotropy !== desiredAnisotropy) {
              tex.anisotropy = desiredAnisotropy;
            }

            // If minFilter is set to plain LinearFilter, it can look extra blurry at distance.
            // Prefer trilinear mipmap filtering when available.
            if (tex.minFilter === LinearFilter) {
              tex.minFilter = LinearMipmapLinearFilter;
            }

            tex.needsUpdate = true;
          });

          // RB9 specific: Make livery glossy while keeping tires matte
          if (carId === "redbull-rb9" && mat.roughness !== undefined) {
            const meshName = child.name?.toLowerCase() || "";
            const materialName = mat.name?.toLowerCase() || "";
            const isTireMaterial = 
              meshName.includes("tire") || 
              meshName.includes("tyre") || 
              meshName.includes("wheel") || 
              meshName.includes("rubber") ||
              materialName.includes("tire") || 
              materialName.includes("tyre") || 
              materialName.includes("wheel") || 
              materialName.includes("rubber");

            if (!isTireMaterial) {
              // Make livery glossy (not metallic) with low roughness and clearcoat
              mat.roughness = Math.min(mat.roughness || 0.5, 0.15); // Glossy finish (lower = more glossy)
              if (mat.metalness !== undefined) {
                mat.metalness = 0.0; // Non-metallic for painted glossy livery
              }
              mat.clearcoat = 1.0; // Add clearcoat for realistic glossy livery
              mat.clearcoatRoughness = 0.1; // Smooth clearcoat
            } else {
              // Realistic F1 tires with slight gloss (new tires have a subtle sheen)
              mat.roughness = 0.3; // Slight gloss like new F1 tires (not completely matte)
              if (mat.metalness !== undefined) {
                mat.metalness = 0.5; // Non-metallic rubber
              }
              mat.clearcoat = 0; // No clearcoat on tires
            }
          }

          if (mat.roughness !== undefined) {
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
      groundLift += -0.001; // lift model up a bit so shadow doesn't clip into tires
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
  }, [scene, onLoaded, carId, gl]);

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      <primitive ref={modelRef} object={scene} />
    </group>
  );
}

