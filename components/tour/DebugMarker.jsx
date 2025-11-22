"use client";

/**
 * Simple debug marker: visible through walls to help locate positions in the gallery.
 */
export default function DebugMarker({ position, color = "red", size = 0.4 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        depthTest={false}
        transparent
        opacity={0.0}
      />
    </mesh>
  );
}

