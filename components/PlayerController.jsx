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
      
      // --- 1. SHAPE & COLLISION ---
      capsuleHalfHeight={1}
      capsuleRadius={0.4}
      
      // --- 2. FRICTION & BALANCE (critically damped = no wobble) ---
      friction={100}
      autoBalance={true}
      autoBalanceSpringK={0.5}
      autoBalanceDampingC={0.2}
      autoBalanceSpringOnY={0.3}
      autoBalanceDampingOnY={0.1}
      
      // --- 3. STAIR & SLOPE HANDLING ---
      floatHeight={0.35}
      slopeMaxAngle={1.2}
      slopeUpExtraForce={1.5}
      slopeDownExtraForce={0.3}
      slopeRayLength={2.5}
      
      // --- 4. FLOATING RAY (firm but not explosive) ---
      rayHitForgiveness={0.5}
      springK={3}
      dampingC={0.5}
      
      // --- 5. MOVEMENT ---
      maxVelLimit={5}
      sprintMult={2}
      jumpVel={4}
      accDeltaTime={12}
      dragDampingC={0.3}
      airDragMultiplier={0.05}
      
      // --- CAMERA ---
      camCollision={false}
      camInitDis={-0.01}
      camMinDis={-0.01}
      camMaxDis={-0.01}
      camFollowMult={1000} 
      camLerpMult={1000}
      camTargetPos={{ x: 0, y: -0.7, z: 0 }}
      camListenerTarget="document"
      
      // --- RESPONSIVENESS ---
      turnVelMultiplier={1}
      turnSpeed={1000}
      mode="CameraBasedMovement"
      restitution={0}
    >
      <group />
    </Ecctrl>
  );
}