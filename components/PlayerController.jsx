"use client";

import { useEffect, useMemo, useRef } from "react";
import { useKeyboardControls } from "@react-three/drei";
import Ecctrl from "ecctrl";

export const PLAYER_KEYBOARD_MAP = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["ShiftLeft", "ShiftRight", "Shift"] },
  { name: "reset", keys: ["KeyR"] },
];

const DEFAULT_SPAWN = [0, 1.7, 0];
const RESET_POSITION = { x: 4.16, y: 2.21, z: -2.55 };

export default function PlayerController({ spawn = DEFAULT_SPAWN }) {
  const controllerRef = useRef(null);
  const [subscribeKeys] = useKeyboardControls();

  const initialPosition = useMemo(
    () => [...(spawn ?? DEFAULT_SPAWN)],
    [spawn]
  );

  useEffect(() => {
    if (!subscribeKeys) return;
    const unsubscribe = subscribeKeys(
      (state) => state.reset,
      (pressed) => {
        if (!pressed) return;
        const body = controllerRef.current?.group;
        if (!body) return;
        body.setTranslation(RESET_POSITION, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
      }
    );
    return unsubscribe;
  }, [subscribeKeys]);

  return (
    <Ecctrl
      ref={controllerRef}
      position={initialPosition}
      capsuleHalfHeight={0.5}
      capsuleRadius={0.3}
      floatHeight={0.1}
      maxVelLimit={5}
      sprintMult={2}
      jumpVel={4}
      camCollision={false}
      camInitDis={-0.01}
      camMinDis={-0.01}
      camMaxDis={-0.01}
      camFollowMult={1000}
      camLerpMult={1000}
      camTargetPos={{ x: 0, y: 0.7, z: 0 }}
      camListenerTarget="document"
      turnVelMultiplier={1}
      turnSpeed={100}
      mode="CameraBasedMovement"
      friction={1}
      restitution={0}
    >
      {/* Placeholder since we only need the physics capsule */}
      <group />
    </Ecctrl>
  );
}
