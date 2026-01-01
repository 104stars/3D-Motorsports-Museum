"use client";

import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import CarModel from "@/components/CarModel";
import { CAR_CONFIGS } from "@/lib/tour/carConfig";
import { getActiveFloors, getCarFloor } from "@/lib/tour/constants";

/**
 * Renders car exhibits based on the player's current floor.
 * Uses camera Y to determine active floors and only mounts cars on those floors.
 */
export default function CarExhibits() {
  const [activeFloors, setActiveFloors] = useState(() => getActiveFloors(0));
  const prevFloorsRef = useRef(activeFloors);

  useFrame(({ camera }) => {
    const floors = getActiveFloors(camera.position.y);
    // Only update state if the set of active floors changed
    if (!setsEqual(floors, prevFloorsRef.current)) {
      prevFloorsRef.current = floors;
      setActiveFloors(floors);
    }
  });

  const visibleCars = CAR_CONFIGS.filter((car) =>
    activeFloors.has(getCarFloor(car.position[1]))
  );

  return (
    <>
      {visibleCars.map((car) => (
        <CarModel
          key={car.id}
          id={car.id}
          modelPath={car.modelPath}
          position={car.position}
          rotation={car.rotation}
          scale={car.scale}
          debugColor={car.debugColor}
        />
      ))}
    </>
  );
}

/** Shallow equality check for two Sets */
function setsEqual(a, b) {
  if (a.size !== b.size) return false;
  for (const v of a) if (!b.has(v)) return false;
  return true;
}

