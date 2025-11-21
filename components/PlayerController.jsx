"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Euler, Vector3 } from "three";

const MOVEMENT_SPEED = 5;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function PlayerController({ bounds, spawn = [0, 1.7, 0], speed = MOVEMENT_SPEED }) {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  const frontVector = useRef(new Vector3());
  const sideVector = useRef(new Vector3());
  const movement = useRef(new Vector3());
  const rotation = useRef(new Euler(0, 0, 0, "YXZ"));

  useEffect(() => {
    camera.position.set(spawn[0], spawn[1], spawn[2]);
  }, [camera, spawn]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMoveForward(true);
          break;
        case "ArrowLeft":
        case "KeyA":
          setMoveLeft(true);
          break;
        case "ArrowDown":
        case "KeyS":
          setMoveBackward(true);
          break;
        case "ArrowRight":
        case "KeyD":
          setMoveRight(true);
          break;
        default:
          break;
      }
    };

    const handleKeyUp = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          setMoveForward(false);
          break;
        case "ArrowLeft":
        case "KeyA":
          setMoveLeft(false);
          break;
        case "ArrowDown":
        case "KeyS":
          setMoveBackward(false);
          break;
        case "ArrowRight":
        case "KeyD":
          setMoveRight(false);
          break;
        default:
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  useFrame((_, delta) => {
    if (!bounds) return;

    frontVector.current.set(0, 0, Number(moveBackward) - Number(moveForward));
    sideVector.current.set(Number(moveRight) - Number(moveLeft), 0, 0);
    movement.current
      .set(0, 0, 0)
      .subVectors(frontVector.current, sideVector.current);

    if (movement.current.lengthSq() > 0) {
      movement.current
        .normalize()
        .multiplyScalar(speed * delta);

      rotation.current.set(0, camera.rotation.y, 0);
      movement.current.applyEuler(rotation.current);

      camera.position.add(movement.current);
    }

    camera.position.x = clamp(camera.position.x, bounds.minX, bounds.maxX);
    camera.position.z = clamp(camera.position.z, bounds.minZ, bounds.maxZ);
    camera.position.y = spawn[1];
  });

  return <PointerLockControls />;
}
