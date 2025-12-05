"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { Vector3 } from "three";
import { getPrimaryCarPosition } from "@/lib/tour/carConfig";

/**
 * Specialized lighting rig for the Car.
 * Uses an HDRI for reflections (essential for metal/glass)
 * without extra spotlights so the scene relies on the museum lighting.
 */
export default function CarStageLighting() {
  const carPos = new Vector3(...getPrimaryCarPosition());

  return (
    <group>
      {/* 
        1. Environment: Essential for car paint reflections. 
        'warehouse' or 'city' presets usually look best on cars due to high contrast.
        background={false} ensures we don't see the image, just the lighting/reflections.
      */}
      <Environment preset="warehouse" background={false} blur={0.6} />

      {/* 
        4. Fill Light: Soft global ambient light to prevent pitch black shadows.
      */}
      <ambientLight intensity={0.4} />

      {/* 
        5. Contact Shadows: Adds a grounded occlusion shadow beneath the car. 
        Much more realistic than standard shadow maps for the floor contact.
        Positioned at floor level (y=0.02) to avoid z-fighting.
      */}
      <ContactShadows
        frames={1}
        position={[carPos.x, 0.02, carPos.z]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={4}
      />
    </group>
  );
}

