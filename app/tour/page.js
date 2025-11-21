"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense, useCallback, useState } from "react";
import { Loader } from "@react-three/drei";
import { NoToneMapping, SRGBColorSpace } from "three";
import GalleryModel from "@/components/GalleryModel";
import PlayerController from "@/components/PlayerController";

const EYE_HEIGHT = 1.7;
const CAMERA_PROPS = { position: [0, EYE_HEIGHT, 0], fov: 75 };

export default function TourPage() {
  const [bounds, setBounds] = useState(null);
  const [spawn, setSpawn] = useState([0, EYE_HEIGHT, 0]);

  const handleBoundsReady = useCallback((box) => {
    if (!box) return;
    const padding = 2;
    setBounds({
      minX: Math.min(box.minX + padding, box.maxX - padding),
      maxX: Math.max(box.maxX - padding, box.minX + padding),
      minZ: Math.min(box.minZ + padding, box.maxZ - padding),
      maxZ: Math.max(box.maxZ - padding, box.minZ + padding),
    });
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
        <Suspense fallback={null}>
          <GalleryModel onBoundsReady={handleBoundsReady} />
          {bounds && <PlayerController bounds={bounds} spawn={spawn} />}
          <color attach="background" args={["#000000"]} />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}

