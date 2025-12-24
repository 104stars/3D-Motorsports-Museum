"use client";

import { useMemo } from "react";
import { ContactShadows } from "@react-three/drei";

/**
 * Soft contact shadow for the "infinite studio" look.
 * Positioned exactly under the car based on model bounds.
 * No visible floor — only the shadow renders against the background.
 */
export default function GroundContactShadow({ bounds }) {
  // Calculate shadow position and scale from model bounds
  const { position, scale } = useMemo(() => {
    if (!bounds) {
      return { position: [0, 0, 0], scale: 10 };
    }

    const { center, size } = bounds;
    
    // Ground Y is at the bottom of the bounding box
    // Add tiny epsilon to prevent z-fighting
    const groundY = center.y - size.y / 2 + 0.001;
    
    // Scale shadow to cover the car footprint with some margin
    const footprint = Math.max(size.x, size.z) * 1.5;

    return {
      position: [center.x, groundY, center.z],
      scale: footprint,
    };
  }, [bounds]);

  return (
    <ContactShadows
      position={position}
      scale={scale}
      opacity={0.9}
      blur={2}
      far={100}
      resolution={1024}
      color="#000000"
      frames={Infinity}
      smooth={false}
    />
  );
}

