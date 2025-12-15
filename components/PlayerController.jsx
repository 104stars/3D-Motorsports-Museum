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

      // --- 2. FRICTION & BALANCE (Updated for Snappiness) ---
      // High friction prevents sliding on slopes when stopped
      friction={10} 
      // Stiff springs keep the character strictly upright (no drunk wobbling)
      autoBalance={true}
      autoBalanceSpringK={2.0}
      autoBalanceDampingC={0.05}
      autoBalanceSpringOnY={1.0}
      autoBalanceDampingOnY={0.05}

      // --- 3. STAIR & SLOPE HANDLING (PRESERVED) ---
      // These are your exact requested values for stairs
      floatHeight={0.35}
      slopeMaxAngle={1.2}
      slopeUpExtraForce={1.5}
      slopeDownExtraForce={0.3}
      slopeRayLength={2.5}

      // --- 4. FLOATING RAY (Tighter) ---
      // A higher springK stops the character from "bobbing" up and down while walking
      rayHitForgiveness={0.5} 
      springK={10} 
      dampingC={0.8}

      // --- 5. MOVEMENT (Effortless) ---
      maxVelLimit={6}
      sprintMult={1.8}
      jumpVel={7}
      jumpForceToGroundMult={5} // Snappy jump landing
      fallingGravityScale={2.5} // Falls faster (less moon-gravity feel)
      
      // The Secret Sauce for "Smooth/Effortless":
      // Higher drag means you stop instantly when releasing keys (no sliding)
      dragDampingC={2.0} 
      accDeltaTime={8} // Responsive acceleration
      airDragMultiplier={0.2} // Slight control in air

      // --- CAMERA ---
      camCollision={false}
      camInitDis={-0.01}
      camMinDis={-0.01}
      camMaxDis={-0.01}
      camFollowMult={1000}
      camLerpMult={1000}
      camTargetPos={{ x: 0, y: 0, z: 0 }}
      camListenerTarget="document"

      // --- RESPONSIVENESS ---
      turnVelMultiplier={1}
      turnSpeed={100}
      mode="CameraBasedMovement"
      restitution={0} // 0 bounce when hitting walls
    >
      <group />
    </Ecctrl>
  );
}