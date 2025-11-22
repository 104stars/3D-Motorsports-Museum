"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import {
  KeyboardControls,
  Loader,
  Environment,
  ContactShadows,
  SpotLight,
} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { ACESFilmicToneMapping, SRGBColorSpace, Vector3 } from "three";
import GalleryModel from "@/components/GalleryModel";
import CarModel from "@/components/CarModel";
import PlayerController, {
  PLAYER_KEYBOARD_MAP,
} from "@/components/PlayerController";

const EYE_HEIGHT = 1.7;
const CAMERA_PROPS = { position: [0, EYE_HEIGHT, 0], fov: 75 };
const POSITION_LOGGER_DEFAULT_ENABLED = false;

// Audi Quattro
const AUDI_QUATTRO_MODEL_PATH = "/models/cars/audiQuattro/scene.gltf";
const AUDI_QUATTRO_TRANSFORM = {
  // Car position [x, y, z]
  position: [-10.42, 6.27, -5.05],
  rotation: [0, Math.PI, 0],
  scale: 0.0172,
};

// Mazda 787B
const MAZDA_787B_MODEL_PATH = "/models/cars/787b/scene.gltf";
const MAZDA_787B_TRANSFORM = {
  // Car position [x, y, z]
  // Uses the coordinates you provided inside the same gallery space.
  position: [8.6, 0, -11.7],
  rotation: [0, Math.PI/2, 0],
  scale: 176,
};

// Ferrari 499
const FERRARI_499_MODEL_PATH = "/models/cars/ferrari499/scene.gltf";
const FERRARI_499_TRANSFORM = {
  // Car position [x, y, z]
  position: [-9, 0.07, 2.],
  rotation: [0, Math.PI, 0],
  scale: 167,
};

// Porsche 917
const PORSCHE_917_MODEL_PATH = "/models/cars/917/scene.gltf";
const PORSCHE_917_TRANSFORM = {
  // Car position [x, y, z]
  position: [17.74, 0, -1],
  rotation: [0, 3.06, 0],
  scale: 1.86,
};

// Subaru Impreza
const IMPREZA_MODEL_PATH = "/models/cars/impreza/scene.gltf";
const IMPREZA_TRANSFORM = {
  // Car position [x, y, z]
  position: [-10.6, 6.39, 13.9],
  rotation: [0, 0, 0],
  scale: 0.012,
};

// Toyota Celica
const CELICA_MODEL_PATH = "/models/cars/celica/scene.gltf";
const CELICA_TRANSFORM = {
  // Car position [x, y, z]
  position: [3.60, 6.28, -13.17],
  rotation: [0, Math.PI/2, 0],
  scale: 1.7,
};

// McLaren MP4/5
const MP45_MODEL_PATH = "/models/cars/mp45/scene.gltf";
const MP45_TRANSFORM = {
  // Car position [x, y, z]
  position: [6.07, 12.07, -13.4],
  rotation: [0, Math.PI/3, 0],
  scale: 1,
};

// Red Bull RB9
const RB9_MODEL_PATH = "/models/cars/rb19/scene.gltf";
const RB9_TRANSFORM = {
  // Car position [x, y, z]
  position: [-6.1, 11.98, 6],
  rotation: [0, 0, 0],
  scale: 1.6,
};

// Helper to visualize the Audi's location for lighting logic
const CAR_POS = new Vector3(...AUDI_QUATTRO_TRANSFORM.position);

/**
 * Specialized lighting rig for the Car.
 * Uses an HDRI for reflections (essential for metal/glass)
 * and specific spotlights to create highlights on the car body.
 */
function CarStageLighting() {
  return (
    <group>
      {/* 
        1. Environment: Essential for car paint reflections. 
        'warehouse' or 'city' presets usually look best on cars due to high contrast.
        background={false} ensures we don't see the image, just the lighting/reflections.
      */}
      <Environment preset="warehouse" background={false} blur={0.6} />

      {/* 
        2. Key Light: Strong light from the front-left of the car to cast shadows 
        and illuminate the hood.
      */}
      <SpotLight
        position={[CAR_POS.x + 5, CAR_POS.y + 8, CAR_POS.z + 5]}
        target-position={[CAR_POS.x, CAR_POS.y, CAR_POS.z]}
        angle={0.5}
        penumbra={0.5}
        intensity={200} // Higher intensity needed due to ACESFilmic ToneMapping
        castShadow
        shadow-bias={-0.0001}
      />

      {/* 
        3. Rim Light: Light from behind/side to separate car from background 
        and highlight the silhouette.
      */}
      <SpotLight
        position={[CAR_POS.x - 5, CAR_POS.y + 5, CAR_POS.z - 5]}
        target-position={[CAR_POS.x, CAR_POS.y, CAR_POS.z]}
        angle={0.5}
        penumbra={1}
        intensity={150}
        color="#cae8ff" // Slightly cool/blue tint
      />

      {/* 
        4. Fill Light: Soft global ambient light to prevent pitch black shadows.
      */}
      <ambientLight intensity={0.4} />

      {/* 
        5. Contact Shadows: Adds a grounded occlusion shadow beneath the car. 
        Much more realistic than standard shadow maps for the floor contact.
        Positioned at floor level (y=0.02) to avoid z-fighting.
      */}
      <ContactShadows
        frames={1}
        position={[CAR_POS.x, 0.02, CAR_POS.z]}
        opacity={0.6}
        scale={10}
        blur={2}
        far={4}
      />
    </group>
  );
}

/**
 * Simple debug marker: visible through walls to help locate positions in the gallery.
 */
function DebugMarker({ position, color = "red", size = 0.4 }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshBasicMaterial
        color={color}
        depthTest={false}
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}

function CameraPositionLogger({
  interval = 0.5,
  hotkey = "KeyL",
  defaultEnabled = false,
} = {}) {
  const enabledRef = useRef(defaultEnabled);
  const lastLogRef = useRef(0);

  useEffect(() => {
    enabledRef.current = defaultEnabled;
  }, [defaultEnabled]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.code !== hotkey) return;
      enabledRef.current = !enabledRef.current;
      console.info(
        `[CameraPositionLogger] ${enabledRef.current ? "enabled" : "disabled"}`
      );
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hotkey]);

  useFrame(({ camera, clock }) => {
    if (!enabledRef.current) return;
    const elapsed = clock.getElapsedTime();
    if (elapsed - lastLogRef.current < interval) return;
    lastLogRef.current = elapsed;
    const { x, y, z } = camera.position;
    console.log(
      `[CameraPosition] x:${x.toFixed(2)} y:${y.toFixed(2)} z:${z.toFixed(2)}`
    );
  });

  return null;
}

function PointerLockHandler() {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl?.domElement;
    if (!canvas) return;

    const handleClick = () => {
      if (document.pointerLockElement !== canvas && canvas.requestPointerLock) {
        canvas.requestPointerLock();
      }
    };

    const handlePointerLockChange = () => {
      const locked = document.pointerLockElement === canvas;
      canvas.style.cursor = locked ? "none" : "auto";
    };

    canvas.addEventListener("click", handleClick);
    document.addEventListener("pointerlockchange", handlePointerLockChange);

    return () => {
      canvas.removeEventListener("click", handleClick);
      document.removeEventListener(
        "pointerlockchange",
        handlePointerLockChange
      );
      canvas.style.cursor = "auto";
    };
  }, [gl]);

  return null;
}

export default function TourPage() {
  const [spawn, setSpawn] = useState(null);
  const [ready, setReady] = useState(false);

  const handleBoundsReady = useCallback((box) => {
    if (!box) return;
    setSpawn([box.center.x, EYE_HEIGHT + 1, box.center.z]);
    setTimeout(() => setReady(true), 300);
  }, []);

  return (
    <div className="w-full h-screen bg-neutral-950">
      <Canvas
        shadows
        camera={CAMERA_PROPS}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          // KEY CHANGE: Use ACESFilmic for realistic lighting falloff
          toneMapping: ACESFilmicToneMapping,
          toneMappingExposure: 0.9,
          outputColorSpace: SRGBColorSpace,
        }}
      >
        <KeyboardControls map={PLAYER_KEYBOARD_MAP}>
          <Physics gravity={[0, -9.81, 0]} timeStep="vary">
            <Suspense fallback={null}>
              {/* REPLACED: Old lighting with specialized Car Stage Lighting */}
              <CarStageLighting />

              <PointerLockHandler />
              <CameraPositionLogger />

              <GalleryModel onBoundsReady={handleBoundsReady} />

              {/* 
                Note: Ensure the car model materials are MeshStandardMaterial 
                or MeshPhysicalMaterial to react to the Environment map 
              */}
              {/* Audi Quattro */}
              <CarModel
                modelPath={AUDI_QUATTRO_MODEL_PATH}
                position={AUDI_QUATTRO_TRANSFORM.position}
                rotation={AUDI_QUATTRO_TRANSFORM.rotation}
                scale={AUDI_QUATTRO_TRANSFORM.scale}
              />

              {/* Mazda 787B */}
              <CarModel
                modelPath={MAZDA_787B_MODEL_PATH}
                position={MAZDA_787B_TRANSFORM.position}
                rotation={MAZDA_787B_TRANSFORM.rotation}
                scale={MAZDA_787B_TRANSFORM.scale}
              />

              {/* Ferrari 499 */}
              <CarModel
                modelPath={FERRARI_499_MODEL_PATH}
                position={FERRARI_499_TRANSFORM.position}
                rotation={FERRARI_499_TRANSFORM.rotation}
                scale={FERRARI_499_TRANSFORM.scale}
              />

              {/* Porsche 917 */}
              <CarModel
                modelPath={PORSCHE_917_MODEL_PATH}
                position={PORSCHE_917_TRANSFORM.position}
                rotation={PORSCHE_917_TRANSFORM.rotation}
                scale={PORSCHE_917_TRANSFORM.scale}
              />

              {/* Subaru Impreza */}
              <CarModel
                modelPath={IMPREZA_MODEL_PATH}
                position={IMPREZA_TRANSFORM.position}
                rotation={IMPREZA_TRANSFORM.rotation}
                scale={IMPREZA_TRANSFORM.scale}
              />

              {/* Toyota Celica */}
              <CarModel
                modelPath={CELICA_MODEL_PATH}
                position={CELICA_TRANSFORM.position}
                rotation={CELICA_TRANSFORM.rotation}
                scale={CELICA_TRANSFORM.scale}
              />

              {/* McLaren MP4/5 */}
              <CarModel
                modelPath={MP45_MODEL_PATH}
                position={MP45_TRANSFORM.position}
                rotation={MP45_TRANSFORM.rotation}
                scale={MP45_TRANSFORM.scale}
              />

              {/* Red Bull RB9 */}
              <CarModel
                modelPath={RB9_MODEL_PATH}
                position={RB9_TRANSFORM.position}
                rotation={RB9_TRANSFORM.rotation}
                scale={RB9_TRANSFORM.scale}
              />

              {/* Debug markers to visualize car positions through walls */}
              <DebugMarker
                position={AUDI_QUATTRO_TRANSFORM.position}
                color="lime"
                size={0.5}
              />
              <DebugMarker
                position={MAZDA_787B_TRANSFORM.position}
                color="magenta"
                size={0.5}
              />
              <DebugMarker
                position={FERRARI_499_TRANSFORM.position}
                color="cyan"
                size={0.5}
              />
              <DebugMarker
                position={PORSCHE_917_TRANSFORM.position}
                color="yellow"
                size={0.5}
              />
              <DebugMarker
                position={IMPREZA_TRANSFORM.position}
                color="orange"
                size={0.5}
              />
              <DebugMarker
                position={CELICA_TRANSFORM.position}
                color="red"
                size={0.5}
              />
              <DebugMarker
                position={MP45_TRANSFORM.position}
                color="pink"
                size={0.5}
              />
              <DebugMarker
                position={RB9_TRANSFORM.position}
                color="blue"
                size={0.5}
              />

              {spawn && ready && <PlayerController spawn={spawn} />}
              <color attach="background" args={["#000000"]} />
            </Suspense>
          </Physics>
        </KeyboardControls>
      </Canvas>
      <Loader />
    </div>
  );
}
