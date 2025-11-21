"use client";

import { useEffect, useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { PointerLockControls } from "@react-three/drei";
import { Vector3 } from "three";

const MOVEMENT_SPEED = 5;
const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export default function PlayerController({
  bounds,
  spawn = [0, 1.7, 0],
  speed = MOVEMENT_SPEED,
}) {
  const { camera } = useThree();
  const [moveForward, setMoveForward] = useState(false);
  const [moveBackward, setMoveBackward] = useState(false);
  const [moveLeft, setMoveLeft] = useState(false);
  const [moveRight, setMoveRight] = useState(false);

  const controlsRef = useRef();
  const forwardVector = useRef(new Vector3());
  const rightVector = useRef(new Vector3());
  const movement = useRef(new Vector3());

  useEffect(() => {
    camera.position.set(spawn[0], spawn[1], spawn[2]);
    camera.rotation.set(0, 0, 0);
    controlsRef.current?.getObject()?.rotation.set(0, 0, 0);
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

    camera.getWorldDirection(forwardVector.current);
    forwardVector.current.y = 0;
    if (forwardVector.current.lengthSq() === 0) {
      forwardVector.current.set(0, 0, -1);
    } else {
      forwardVector.current.normalize();
    }

    rightVector.current
      .crossVectors(forwardVector.current, camera.up)
      .normalize();

    movement.current.set(0, 0, 0);

    if (moveForward) movement.current.add(forwardVector.current);
    if (moveBackward) movement.current.sub(forwardVector.current);
    if (moveRight) movement.current.add(rightVector.current);
    if (moveLeft) movement.current.sub(rightVector.current);

    if (movement.current.lengthSq() > 0) {
      movement.current.normalize().multiplyScalar(speed * delta);
      camera.position.add(movement.current);
    }

    camera.position.x = clamp(camera.position.x, bounds.minX, bounds.maxX);
    camera.position.z = clamp(camera.position.z, bounds.minZ, bounds.maxZ);
    camera.position.y = spawn[1];
  });

  return <PointerLockControls ref={controlsRef} />;
}
