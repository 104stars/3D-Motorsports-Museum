"use client";

import { Suspense, useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import CarModel from "@/components/CarModel";
import CarLabel from "@/components/tour/CarLabel";
import { CAR_CONFIGS } from "@/lib/tour/carConfig";
import { getActiveFloors, getCarFloor } from "@/lib/tour/constants";

/**
 * All cars are mounted once. Visibility is toggled per-floor, with activations
 * staggered across frames (one car per frame) to avoid GPU spikes from
 * rendering multiple new meshes simultaneously. Deactivations are instant
 * since hiding is cheap.
 */
export default function CarExhibits({ showLabels = false }) {
  const [activeCars, setActiveCars] = useState(() => {
    const floors = getActiveFloors(0);
    return new Set(
      CAR_CONFIGS
        .filter((c) => floors.has(getCarFloor(c.position[1])))
        .map((c) => c.id)
    );
  });

  const prevFloorsRef = useRef(getActiveFloors(0));
  const activationQueue = useRef([]);

  useFrame(({ camera }) => {
    const floors = getActiveFloors(camera.position.y);

    if (!setsEqual(floors, prevFloorsRef.current)) {
      prevFloorsRef.current = floors;

      const nowActive = CAR_CONFIGS.filter((c) =>
        floors.has(getCarFloor(c.position[1]))
      );
      const nowActiveIds = new Set(nowActive.map((c) => c.id));

      // Deactivate cars no longer on the active floor immediately.
      setActiveCars((prev) => {
        const next = new Set(prev);
        for (const id of prev) {
          if (!nowActiveIds.has(id)) next.delete(id);
        }
        return next;
      });

      // Queue newly-visible cars for staggered activation (1 per frame).
      const newlyVisible = nowActive
        .map((c) => c.id)
        .filter((id) => !activeCars.has(id));
      activationQueue.current = newlyVisible;
    }

    // Drain one car from the activation queue per frame.
    if (activationQueue.current.length > 0) {
      const nextId = activationQueue.current.shift();
      setActiveCars((prev) => new Set([...prev, nextId]));
    }
  });

  return (
    <>
      {CAR_CONFIGS.map((car) => (
        <CarModel
          key={car.id}
          id={car.id}
          modelPath={car.modelPath}
          position={car.position}
          rotation={car.rotation}
          scale={car.scale}
          debugColor={car.debugColor}
          active={activeCars.has(car.id)}
        />
      ))}
      {showLabels && (
        <Suspense fallback={null}>
          {CAR_CONFIGS.map((car) => (
            <CarLabel
              key={`label-${car.id}`}
              car={car}
              active={activeCars.has(car.id)}
            />
          ))}
        </Suspense>
      )}
    </>
  );
}

function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}
