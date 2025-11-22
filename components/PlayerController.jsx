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
      
      // --- 1. SHAPE & COLLISION FIX ---
      capsuleHalfHeight={1}
      // Slightly wider radius prevents getting "wedged" into thin handrails
      capsuleRadius={0.4} 
      
      // --- 2. LINEAR MOVEMENT (Killing Inertia) ---
      // High friction stops you instantly on the ground
      friction={100} 
      // autoBalance settings effectively act as "Air Friction" here to stop wobbling
      autoBalanceSpringK={10} // Stiffer spring = less bouncy
      autoBalanceSpringDamping={100} // High damping = no oscillation/springiness
      
      // --- 3. STAIRS & HANDRAIL FIX ---
      // We lowered floatHeight slightly (0.2) so it stops trying to "climb" handrails,
      // but kept it high enough for stairs.
      floatHeight={0.2} 
      
      // Allow walking on very steep stairs without sliding back
      slopeMaxAngle={1.2} // ~68 degrees (very steep capability)
      
      // Constant speed in air prevents losing momentum on stairs
      moveInAir={true}
      
      // --- 4. SPEED SETTINGS ---
      maxVelLimit={5}
      sprintMult={2}
      jumpVel={4}
      
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
      turnSpeed={1000} // Instant turning
      mode="CameraBasedMovement"
      restitution={0} // 0 Bounciness on collision
    >
      <group />
    </Ecctrl>
  );
}