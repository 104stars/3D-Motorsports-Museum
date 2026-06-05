"use client";

import { useCallback, useMemo, useRef, useState } from "react";
import { useGLTF, Text3D, Center, Billboard } from "@react-three/drei";
import { Box3, Euler, Quaternion, Vector3 } from "three";

const PLATE_PAD_X = 0.25;
const PLATE_PAD_Y = 0.12;

export default function CarLabel({ car, active }) {
  const { scene } = useGLTF(car.modelPath);
  const textRef = useRef(null);
  const [plateSize, setPlateSize] = useState(null);

  const measureText = useCallback((mesh) => {
    textRef.current = mesh;
    if (!mesh) return;
    const geom = mesh.geometry;
    if (!geom) return;
    geom.computeBoundingBox();
    const bb = geom.boundingBox;
    if (!bb) return;
    setPlateSize([
      bb.max.x - bb.min.x + PLATE_PAD_X,
      bb.max.y - bb.min.y + PLATE_PAD_Y,
    ]);
  }, []);

  const labelPosition = useMemo(() => {
    if (!scene) return car.position;

    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const s = car.scale;

    const rotQuat = new Quaternion().setFromEuler(new Euler(...car.rotation));
    const localOffset = new Vector3(center.x * s, 0, center.z * s).applyQuaternion(rotQuat);

    return [
      car.position[0] + localOffset.x,
      car.position[1] + box.max.y * s + 0.45,
      car.position[2] + localOffset.z,
    ];
  }, [scene, car]);

  if (!active) return null;

  return (
    <Billboard position={labelPosition} follow={true}>
      {plateSize && (
        <mesh position={[0, 0, -0.03]} renderOrder={0}>
          <planeGeometry args={plateSize} />
          <meshBasicMaterial
            color="#000000"
            transparent
            opacity={0.55}
            depthWrite={false}
          />
        </mesh>
      )}
      <Center>
        <Text3D
          ref={measureText}
          font="/helvetiker_regular.typeface.json"
          size={0.4}
          height={0.04}
          bevelEnabled
          bevelThickness={0.006}
          bevelSize={0.003}
          curveSegments={6}
          renderOrder={1}
        >
          {car.name}
          <meshStandardMaterial color="#ffffff" roughness={0.4} />
        </Text3D>
      </Center>
    </Billboard>
  );
}
