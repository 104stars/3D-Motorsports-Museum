"use client";

import CarModel from "@/components/CarModel";
import { CAR_CONFIGS } from "@/lib/tour/carConfig";

/**
 * Renders all car exhibits.
 */
export default function CarExhibits() {
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
        />
      ))}
    </>
  );
}

