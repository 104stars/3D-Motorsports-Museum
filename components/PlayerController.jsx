"use client";

import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
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

// First-floor base Y is ~2.78. Anything below this absolute threshold means
// the player has clipped through the ground floor into the void.
// Set well below any normal bounce/jump dip but above catastrophic fall.
const CLIP_RECOVERY_Y = 0.5;
// Require N consecutive frames below threshold before triggering recovery
// to filter out single-frame physics solver jitter.
const CLIP_CONFIRM_FRAMES = 5;
// Only record a "safe" position when vertical velocity is low (near-grounded).
const SAFE_VEL_Y_THRESHOLD = 2.0;

export default function PlayerController({ spawn = DEFAULT_SPAWN }) {
  const controllerRef = useRef(null);
  const [subscribeKeys] = useKeyboardControls();

  // Gate jump to a single-frame impulse per keypress.
  // At high FPS, ecctrl can apply jump force across multiple render frames
  // before the player leaves the ground, causing a higher apex on faster machines.
  // Dispatching a synthetic keyup on the next RAF ensures KeyboardControls sees
  // the jump key as released after exactly one frame regardless of frame rate.
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code !== "Space" || e.repeat) return;
      requestAnimationFrame(() => {
        document.dispatchEvent(
          new KeyboardEvent("keyup", { code: "Space", key: " ", bubbles: true })
        );
      });
    };

    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () =>
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
  }, []);

  const initialPosition = useMemo(
    () => [...(spawn ?? DEFAULT_SPAWN)],
    [spawn]
  );

  const lastSafePos = useRef({ x: spawn[0], y: spawn[1], z: spawn[2] });
  const clipFrameCount = useRef(0);

  useFrame(() => {
    const body = controllerRef.current?.group;
    if (!body) return;

    const pos = body.translation();
    const vel = body.linvel();

    if (pos.y < CLIP_RECOVERY_Y) {
      clipFrameCount.current++;
      if (clipFrameCount.current >= CLIP_CONFIRM_FRAMES) {
        body.setTranslation(lastSafePos.current, true);
        body.setLinvel({ x: 0, y: 0, z: 0 }, true);
        body.setAngvel({ x: 0, y: 0, z: 0 }, true);
        clipFrameCount.current = 0;
      }
    } else {
      clipFrameCount.current = 0;
      if (Math.abs(vel.y) < SAFE_VEL_Y_THRESHOLD) {
        lastSafePos.current = { x: pos.x, y: pos.y, z: pos.z };
      }
    }
  });

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

      // --- 2. FRICTION & BALANCE ---
      friction={10}
      autoBalance={true}
      autoBalanceSpringK={2.0}
      autoBalanceDampingC={0.05}
      autoBalanceSpringOnY={1.0}
      autoBalanceDampingOnY={0.05}

      // --- 3. STAIR & SLOPE HANDLING ---
      floatHeight={0.2}
      slopeMaxAngle={1.2}
      slopeUpExtraForce={1.5}
      slopeDownExtraForce={0.3}
      slopeRayLength={2.5}

      // --- 4. FLOATING RAY ---
      rayHitForgiveness={0.1}
      springK={8}
      dampingC={0.3}

      // --- 5. MOVEMENT ---
      maxVelLimit={6}
      sprintMult={1.8}
      jumpVel={7.5}
      jumpForceToGroundMult={0}
      sprintJumpMult={1}
      fallingGravityScale={2.7}
      dragDampingC={2.0}
      accDeltaTime={4}
      airDragMultiplier={0.2}

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
      restitution={0}
    >
      <group />
    </Ecctrl>
  );
}