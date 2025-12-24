"use client";

import { useEffect, useRef } from "react";
import { useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Camera controller that auto-fits to the model on load
 * Exposes reset function via ref callback
 */
export default function CameraController({ modelBounds, isActive, onControlsReady }) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const hasPositioned = useRef(false);

  useEffect(() => {
    if (!modelBounds || !isActive || hasPositioned.current) return;

    const { center, size } = modelBounds;
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.8; // Distance multiplier for good framing

    // Position camera to look at the center of the model
    camera.position.set(
      center.x + distance * 0.7,
      center.y + distance * 0.5,
      center.z + distance * 0.7
    );
    camera.lookAt(center.x, center.y, center.z);
    camera.updateProjectionMatrix();

    // Update orbit controls target
    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }

    hasPositioned.current = true;
  }, [modelBounds, isActive, camera]);

  // Expose reset function to parent
  useEffect(() => {
    if (!onControlsReady || !controlsRef.current) return;

    const resetCamera = () => {
      if (!modelBounds || !controlsRef.current) return;
      const { center, size } = modelBounds;
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 1.8;

      camera.position.set(
        center.x + distance * 0.7,
        center.y + distance * 0.5,
        center.z + distance * 0.7
      );
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    };

    onControlsReady(resetCamera);
  }, [onControlsReady, modelBounds, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={0.5}
      maxDistance={50}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
      autoRotate={false}
      dampingFactor={0.05}
    />
  );
}

