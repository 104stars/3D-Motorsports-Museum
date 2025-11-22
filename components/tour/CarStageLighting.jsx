"use client";

import { Environment, ContactShadows, SpotLight } from "@react-three/drei";
import { Vector3 } from "three";
import { getPrimaryCarPosition } from "@/lib/tour/carConfig";

/**
 * Specialized lighting rig for the Car.
 * Uses an HDRI for reflections (essential for metal/glass)
 * and specific spotlights to create highlights on the car body.
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
        2. Key Light: Strong light from the front-left of the car to cast shadows 
        and illuminate the hood.
      */}
      <SpotLight
        position={[carPos.x + 5, carPos.y + 8, carPos.z + 5]}
        target-position={[carPos.x, carPos.y, carPos.z]}
        angle={0.5}
        penumbra={0.5}
        intensity={200} // Higher intensity needed due to ACESFilmic ToneMapping
        castShadow
        shadow-bias={-0.0001}
      />

      {/* 
        3. Rim Light: Light from behind/side to separate car from background 
        and highlight the silhouette.
      */}
      <SpotLight
        position={[carPos.x - 5, carPos.y + 5, carPos.z - 5]}
        target-position={[carPos.x, carPos.y, carPos.z]}
        angle={0.5}
        penumbra={1}
        intensity={150}
        color="#cae8ff" // Slightly cool/blue tint
      />

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

