"use client";

import { Environment } from "@react-three/drei";

/**
 * High-quality lighting setup for detailed car viewing
 */
export default function HighQualityLighting() {
  return (
    <group>
      {/* High-resolution environment map for realistic reflections */}
      <Environment 
        files="/shop.hdr" 
        background={false}
        blur={0.3}
        resolution={512}
      />

      {/* Main directional light for specular highlights */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={2}
      />

      {/* Fill light for balanced illumination */}
      <ambientLight intensity={0.5} />

      {/* Rim light for better edge definition */}
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.8}
        color="#ffffff"
      />
    </group>
  );
}

