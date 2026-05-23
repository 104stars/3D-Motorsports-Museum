"use client";

import { Environment, ContactShadows } from "@react-three/drei";
import { Vector3 } from "three";
import { getPrimaryCarPosition } from "@/lib/tour/carConfig";

export default function CarStageLighting() {
  const carPos = new Vector3(...getPrimaryCarPosition());

  return (
    <group>
      {/* 
        1. Environment: Optimized for performance.
        - resolution={256}: Drastically lowers memory usage. 
          Since we use blur={0.6}, high res is wasted pixels.
      */}
      <Environment 
        files="/shop.hdr" 
        background={false} 
        blur={0.6} 
        resolution={256} 
      />

      {/* 
        2. Main Light: A directional light is computationally cheap 
        and creates defined specular highlights on the car paint 
        that the HDRI might miss at lower resolutions.
      */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={1.5} 
        castShadow={false} // Keep false to rely on ContactShadows instead
      />

      {/* 
        3. Fill Light: Kept low to maintain contrast.
      */}
      <ambientLight intensity={0.4} />

      {/* 
        4. Contact Shadows: Heavily Optimized.
        - resolution={256}: Massive FPS boost over default (usually 1024).
        - far={1.5}: Only calculates geometry 1.5 units up (wheels/bumper).
        - smooth={false}: Disabling smoothing (if acceptable) speeds up blur shader.
      */}

    </group>
  );
}