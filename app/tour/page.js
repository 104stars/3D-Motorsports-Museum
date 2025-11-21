"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useState } from "react";
import { KeyboardControls, Loader } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { NoToneMapping, SRGBColorSpace } from "three";
import GalleryModel from "@/components/GalleryModel";
import PlayerController, {
  PLAYER_KEYBOARD_MAP,
} from "@/components/PlayerController";

const EYE_HEIGHT = 1.7;
const CAMERA_PROPS = { position: [0, EYE_HEIGHT, 0], fov: 75 };

export default function TourPage() {
  const [spawn, setSpawn] = useState(null);

  const handleBoundsReady = useCallback((box) => {
    if (!box) return;
    setSpawn([box.center.x, EYE_HEIGHT, box.center.z]);
  }, []);

  return (
    <div className="w-full h-screen bg-neutral-950">
      <Canvas
        camera={CAMERA_PROPS}
        dpr={[1, 2]}
        gl={{ antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = NoToneMapping;
          gl.outputColorSpace = SRGBColorSpace;
        }}
      >
        <KeyboardControls map={PLAYER_KEYBOARD_MAP}>
          <Physics gravity={[0, -9.81, 0]} timeStep="vary">
            <Suspense fallback={null}>
              <GalleryModel onBoundsReady={handleBoundsReady} />
              {spawn && <PlayerController spawn={spawn} />}
              <color attach="background" args={["#000000"]} />
            </Suspense>
          </Physics>
        </KeyboardControls>
      </Canvas>
      <Loader />
    </div>
  );
}

