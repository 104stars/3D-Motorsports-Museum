"use client";

import CarModel from "@/components/CarModel";
import DebugMarker from "./DebugMarker";
import { CAR_CONFIGS } from "@/lib/tour/carConfig";

/**
 * Renders all car exhibits and their debug markers.
 */
export default function CarExhibits({ showDebugMarkers = true }) {
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

      {showDebugMarkers &&
        CAR_CONFIGS.map((car) => (
          <DebugMarker
            key={`debug-${car.id}`}
            position={car.position}
            color={car.debugColor}
            size={0.5}
          />
        ))}
    </>
  );
}

