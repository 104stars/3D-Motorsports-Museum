"use client";

import { ContactShadows } from "@react-three/drei";

/**
 * Soft contact shadow for the "infinite studio" look.
 * Positioned exactly under the car based on model bounds.
 * No visible floor — only the shadow renders against the background.
 */
export default function GroundContactShadow() {
  return (
    <ContactShadows
      opacity={0.8}
      far={100}
      resolution={1024}
      color="#000000"
      frames={1}
      smooth={true}
      blur={0.8}
    />
  );
}
