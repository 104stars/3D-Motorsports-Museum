"use client";

import { useEffect, useMemo, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import { Box3, Euler, Quaternion, Vector3 } from "three";
import { useCarRegistry } from "./tour/CarDetectionContext";

/**
 * Generic wrapper for loading and placing car GLTF models inside the gallery.
 * Designed for multiple cars: handles basic lighting/shadow flags on meshes.
 */
export default function CarModel({
  id,
  modelPath,
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  scale = 1,
  showColliderDebug = false,
  debugColor = "#00ffff",
  ...primitiveProps
}) {
  const { scene } = useGLTF(modelPath);
  const colliderRef = useRef(null);
  const { register, unregister } = useCarRegistry();

  const { carScene, collider } = useMemo(() => {
    if (!scene) return { carScene: null, collider: null };
    const clone = scene.clone(true);

    // Enable shadows on car meshes; gallery remains unaffected since it uses MeshBasicMaterial.
    clone.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
    });

    // Compute bounding box for collider generation.
    const box = new Box3().setFromObject(clone);
    const size = box.getSize(new Vector3());
    const center = box.getCenter(new Vector3());

    // Normalize scale into a vector for math.
    const scaleVec = Array.isArray(scale)
      ? new Vector3(...scale)
      : scale instanceof Vector3
      ? scale.clone()
      : new Vector3().setScalar(scale);

    const scaledSize = size.clone().multiply(scaleVec);
    const scaledCenter = center.clone().multiply(scaleVec);
    const halfExtents = scaledSize.toArray().map((v) => v / 2);

    return {
      carScene: clone,
      collider: {
        halfExtents,
        offset: scaledCenter.toArray(),
        size: scaledSize.toArray(),
      },
    };
  }, [scene, scale]);

  useEffect(() => {
    const colliderHandle = colliderRef.current?.handle;
    if (!colliderHandle || !id) return;

    // Compute world-space center for detection (static bodies).
    const positionVec = Array.isArray(position)
      ? new Vector3(...position)
      : position.clone();
    const offsetVec = new Vector3(...collider.offset);

    const rotationEuler = Array.isArray(rotation)
      ? new Euler(...rotation)
      : rotation;
    const rotationQuat = new Quaternion().setFromEuler(rotationEuler);

    const rotatedOffset = offsetVec.clone().applyQuaternion(rotationQuat);
    const worldCenter = positionVec.clone().add(rotatedOffset);

    // Bounding sphere radius from half extents (approx for quick checks).
    const radius = Math.sqrt(
      collider.halfExtents[0] ** 2 +
        collider.halfExtents[1] ** 2 +
        collider.halfExtents[2] ** 2
    );

    register(colliderHandle, {
      id,
      center: worldCenter.toArray(),
      radius,
      halfExtents: collider.halfExtents,
      rotationQuat: [
        rotationQuat.x,
        rotationQuat.y,
        rotationQuat.z,
        rotationQuat.w,
      ],
    });
    return () => unregister(colliderHandle);
  }, [
    collider?.halfExtents,
    collider?.offset,
    id,
    position,
    register,
    rotation,
    unregister,
  ]);

  if (!carScene || !collider) return null;

  return (
    <RigidBody
      type="fixed"
      colliders={false}
      position={position}
      rotation={rotation}
      restitution={0}
      friction={1}
    >
      <group scale={scale}>
        <primitive object={carScene} {...primitiveProps} />
      </group>

      <CuboidCollider
        ref={colliderRef}
        args={collider.halfExtents}
        position={collider.offset}
      />

      {showColliderDebug && (
        <mesh position={collider.offset}>
          <boxGeometry args={collider.size} />
          <meshBasicMaterial color={debugColor} wireframe transparent opacity={0.35} />
        </mesh>
      )}
    </RigidBody>
  );
}

export function preloadCarModel(path) {
  useGLTF.preload(path);
}

