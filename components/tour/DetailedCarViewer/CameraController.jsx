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

  // Tweaked defaults for a better "first look" framing in detailed mode.
  // (User will provide final tuned values later.)
  const DISTANCE_MULTIPLIER = 2.6;
  // Side profile: offset primarily on X axis, minimal Z to avoid back/3-4 view
  // Rotate 90° left from the current rear view (model axis differs per asset),
  // so we bias along Z instead of X.
  // Negative Y positions camera lower so we look up at the car, keeping it above the bottom HUD bar
  const OFFSET = { x: 0.0, y: -1.6, z: 1.55 };

  useEffect(() => {
    if (!modelBounds || !isActive || hasPositioned.current) return;

    const { center, size } = modelBounds;
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * DISTANCE_MULTIPLIER; // Pull back a bit for nicer framing

    // Position camera to look at the center of the model
    camera.position.set(
      center.x + distance * OFFSET.x,
      center.y + distance * OFFSET.y,
      center.z + distance * OFFSET.z
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
      const distance = maxDim * DISTANCE_MULTIPLIER;

      camera.position.set(
        center.x + distance * OFFSET.x,
        center.y + distance * OFFSET.y,
        center.z + distance * OFFSET.z
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

