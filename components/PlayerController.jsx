"use client";

import { useMemo } from "react";
import Ecctrl from "ecctrl";

export const PLAYER_KEYBOARD_MAP = [
  { name: "forward", keys: ["ArrowUp", "KeyW"] },
  { name: "backward", keys: ["ArrowDown", "KeyS"] },
  { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
  { name: "rightward", keys: ["ArrowRight", "KeyD"] },
  { name: "jump", keys: ["Space"] },
  { name: "run", keys: ["ShiftLeft", "ShiftRight", "Shift"] },
];

const DEFAULT_SPAWN = [0, 1.7, 0];

export default function PlayerController({ spawn = DEFAULT_SPAWN }) {
  const initialPosition = useMemo(
    () => [...(spawn ?? DEFAULT_SPAWN)],
    [spawn]
  );

  return (
    <Ecctrl
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
