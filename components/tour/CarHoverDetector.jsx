"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Quaternion, Vector3 } from "three";
import { useCarRegistry } from "./CarDetectionContext";

const CHECK_INTERVAL = 0.1; // seconds
const MAX_DISTANCE = 3; // trimmed max reach (scene units)
const EPS = 1e-5;
const PADDING = 0.4; // expand OBB by small padding for easier hits

function rayOBBIntersect(origin, dir, center, halfExtents, rotationQuat) {
  const invQuat = new Quaternion(
    rotationQuat[0],
    rotationQuat[1],
    rotationQuat[2],
    rotationQuat[3]
  ).invert();

  const localOrigin = tmpVec1.copy(origin).sub(tmpVec2.fromArray(center));
  localOrigin.applyQuaternion(invQuat);

  const localDir = tmpVec3.copy(dir).applyQuaternion(invQuat);

  const he = tmpVec4.fromArray(halfExtents).addScalar(PADDING);

  let tMin = -Infinity;
  let tMax = Infinity;

  for (let i = 0; i < 3; i++) {
    const o = localOrigin.getComponent(i);
    const d = localDir.getComponent(i);
    const h = he.getComponent(i);

    if (Math.abs(d) < EPS) {
      if (o < -h || o > h) return null;
      continue;
    }

    const t1 = (-h - o) / d;
    const t2 = (h - o) / d;
    const tNear = Math.min(t1, t2);
    const tFar = Math.max(t1, t2);

    tMin = Math.max(tMin, tNear);
    tMax = Math.min(tMax, tFar);

    if (tMin > tMax) return null;
  }

  if (tMax < 0) return null;
  const hitT = tMin > 0 ? tMin : tMax;
  if (hitT < 0 || hitT > MAX_DISTANCE) return null;
  return hitT;
}

const tmpVec1 = new Vector3();
const tmpVec2 = new Vector3();
const tmpVec3 = new Vector3();
const tmpVec4 = new Vector3();

export default function CarHoverDetector({ onDetect }) {
  const { camera } = useThree();
  const registry = useCarRegistry();

  const lastHitId = useRef(null);
  const lastCheck = useRef(0);
  const origin = useRef(new Vector3());
  const dir = useRef(new Vector3());

  useFrame(({ clock }) => {
    const now = clock.getElapsedTime();
    if (now - lastCheck.current < CHECK_INTERVAL) return;
    lastCheck.current = now;

    camera.getWorldPosition(origin.current);
    camera.getWorldDirection(dir.current);

    let bestId = null;
    let bestDist = Infinity;

    for (const entry of registry.getEntries()) {
      if (!entry.rotationQuat || !entry.halfExtents) continue;

      const hitDist = rayOBBIntersect(
        origin.current,
        dir.current,
        entry.center,
        entry.halfExtents,
        entry.rotationQuat
      );

      if (hitDist !== null && hitDist < bestDist) {
        bestDist = hitDist;
        bestId = entry.id;
      }
    }

    if (bestId !== lastHitId.current) {
      lastHitId.current = bestId;
      onDetect?.(bestId);
      if (bestId) console.log(`Crosshair target: ${bestId}`);
    }
  });

  return null;
}

