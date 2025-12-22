"use client";

import { Suspense, useEffect, useRef, useMemo } from "react";
import { Canvas, useThree, useFrame } from "@react-three/fiber";
import { 
  OrbitControls, 
  Environment, 
  useGLTF,
  Html
} from "@react-three/drei";
import { 
  EffectComposer, 
  Bloom, 
  SSAO,
  SMAA
} from "@react-three/postprocessing";
import { 
  ACESFilmicToneMapping, 
  SRGBColorSpace,
  Box3,
  Vector3,
  Group
} from "three";
import { motion, AnimatePresence } from "motion/react";
import { X, Loader2 } from "lucide-react";
import { getHighQualityModelUrl } from "@/lib/tour/carConfig";
import { cn } from "@/lib/utils";

/**
 * High-quality car model component with enhanced materials and shadows
 * Normalizes all models to a consistent size for uniform viewing experience
 */
function CarModel({ url, onLoaded }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef(null);
  const groupRef = useRef(null);
  const TARGET_MAX_DIMENSION = 5; // Normalize all models to have max dimension of 5 units

  useEffect(() => {
    if (!scene || !modelRef.current || !groupRef.current) return;

    // Enable shadows and enhance materials for high-quality rendering
    scene.traverse((child) => {
      if (!child.isMesh) return;
      child.castShadow = true;
      child.receiveShadow = true;
      
      // Increase material quality if needed
      if (child.material) {
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((mat) => {
          if (mat.roughness !== undefined) {
            // Keep original roughness values but ensure quality
            mat.needsUpdate = true;
          }
        });
      }
    });

    // Calculate bounding box to determine normalization scale
    const box = new Box3().setFromObject(scene);
    const center = box.getCenter(new Vector3());
    const size = box.getSize(new Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    
    // Calculate normalization scale factor
    // If maxDimension is 0 or very small, use scale of 1 to avoid division issues
    const normalizeScale = maxDimension > 0.001 ? TARGET_MAX_DIMENSION / maxDimension : 1;
    
    // Apply normalization scale to the group
    groupRef.current.scale.setScalar(normalizeScale);
    
    // Calculate normalized bounds for camera positioning
    const normalizedSize = size.clone().multiplyScalar(normalizeScale);
    const normalizedCenter = center.clone().multiplyScalar(normalizeScale);
    
    // Notify parent with normalized bounds
    if (onLoaded) {
      onLoaded({ 
        center: normalizedCenter, 
        size: normalizedSize, 
        scene,
        originalScale: normalizeScale 
      });
    }
  }, [scene, onLoaded]);

  return (
    <group ref={groupRef} rotation={[0, -Math.PI / 2, 0]}>
      <primitive ref={modelRef} object={scene} />
    </group>
  );
}

/**
 * Camera controller that auto-fits to the model on load
 * Exposes reset function via ref callback
 */
function CameraController({ modelBounds, isActive, onControlsReady }) {
  const { camera } = useThree();
  const controlsRef = useRef(null);
  const hasPositioned = useRef(false);

  useEffect(() => {
    if (!modelBounds || !isActive || hasPositioned.current) return;

    const { center, size } = modelBounds;
    const maxDim = Math.max(size.x, size.y, size.z);
    const distance = maxDim * 1.8; // Distance multiplier for good framing

    // Position camera to look at the center of the model
    camera.position.set(
      center.x + distance * 0.7,
      center.y + distance * 0.5,
      center.z + distance * 0.7
    );
    camera.lookAt(center.x, center.y, center.z);
    camera.updateProjectionMatrix();

    // Update orbit controls target
    if (controlsRef.current) {
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    }

    hasPositioned.current = true;
  }, [modelBounds, isActive, camera]);

  // Expose reset function to parent
  useEffect(() => {
    if (!onControlsReady || !controlsRef.current) return;

    const resetCamera = () => {
      if (!modelBounds || !controlsRef.current) return;
      const { center, size } = modelBounds;
      const maxDim = Math.max(size.x, size.y, size.z);
      const distance = maxDim * 1.8;

      camera.position.set(
        center.x + distance * 0.7,
        center.y + distance * 0.5,
        center.z + distance * 0.7
      );
      controlsRef.current.target.copy(center);
      controlsRef.current.update();
    };

    onControlsReady(resetCamera);
  }, [onControlsReady, modelBounds, camera]);

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={true}
      enableRotate={true}
      minDistance={0.5}
      maxDistance={50}
      minPolarAngle={0}
      maxPolarAngle={Math.PI / 2}
      autoRotate={false}
      dampingFactor={0.05}
    />
  );
}

/**
 * High-quality lighting setup for detailed car viewing
 */
function HighQualityLighting() {
  return (
    <group>
      {/* High-resolution environment map for realistic reflections */}
      <Environment 
        files="/shop.hdr" 
        background={false}
        blur={0.3}
        resolution={512}
      />

      {/* Main directional light for specular highlights */}
      <directionalLight 
        position={[5, 10, 5]} 
        intensity={2}
        castShadow={true}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />

      {/* Fill light for balanced illumination */}
      <ambientLight intensity={0.5} />

      {/* Rim light for better edge definition */}
      <directionalLight 
        position={[-5, 5, -5]} 
        intensity={0.8}
        color="#ffffff"
      />
    </group>
  );
}

/**
 * Scene content with model, lighting, and post-processing
 */
function SceneContent({ carId, onModelLoaded, isActive, onControlsReady }) {
  const modelUrl = useMemo(() => getHighQualityModelUrl(carId), [carId]);
  const modelBoundsRef = useRef(null);

  if (!modelUrl) {
    return (
      <Html center>
        <div className="text-white text-center">
          <p className="text-lg mb-2">Model not found</p>
          <p className="text-sm text-white/60">High-quality model for this car is not available.</p>
        </div>
      </Html>
    );
  }

  const handleModelLoaded = (bounds) => {
    modelBoundsRef.current = bounds;
    if (onModelLoaded) {
      onModelLoaded(bounds);
    }
  };

  return (
    <>
      <HighQualityLighting />
      
      <Suspense
        fallback={
          <Html center>
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-white/70 animate-spin" />
              <p className="text-white/70 text-sm">Loading high-quality model...</p>
            </div>
          </Html>
        }
      >
        <CarModel url={modelUrl} onLoaded={handleModelLoaded} />
      </Suspense>

      <CameraController 
        modelBounds={modelBoundsRef.current} 
        isActive={isActive}
        onControlsReady={onControlsReady}
      />

      {/* Ground plane for shadows */}
      <mesh 
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -100, 0]}
        receiveShadow
      >
        <planeGeometry args={[1000, 1000]} />
        <shadowMaterial opacity={0.3} />
      </mesh>
    </>
  );
}

/**
 * Detailed 3D car model viewer with high-quality rendering and post-processing
 */
export default function DetailedCarViewer({ carId, onClose, isActive }) {
  const modelBoundsRef = useRef(null);

  const handleModelLoaded = (bounds) => {
    modelBoundsRef.current = bounds;
  };

  // Handle ESC key to close
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose?.();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isActive, onClose]);

  if (!carId || !isActive) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="fixed inset-0 z-[60] w-screen h-screen bg-[#ededed]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Close Button */}
        <motion.button
          onClick={onClose}
          className={cn(
            "absolute top-8 right-8 z-50 p-2",
            "text-black/50 hover:text-black",
            "transition-colors duration-200"
          )}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Close viewer"
        >
          <X className="w-8 h-8" strokeWidth={1.5} />
        </motion.button>

        {/* 3D Canvas */}
        <div className="absolute inset-0 w-full h-full">
          <Canvas
            shadows
            dpr={[1, 3]}
            gl={{
              antialias: true,
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
              outputColorSpace: SRGBColorSpace,
              alpha: false, // Opaque canvas prevents bleed-through
            }}
            camera={{ 
              position: [0, 5, 5], 
              fov: 10,
              near: 0.1,
              far: 1000
            }}
          >
            <color attach="background" args={["#ededed"]} />

            <SceneContent 
              carId={carId} 
              onModelLoaded={handleModelLoaded}
              isActive={isActive}
              onControlsReady={() => {}} 
            />

            {/* Post-processing effects */}
            <EffectComposer multisampling={4} enableNormalPass={true}>
              <Bloom
                intensity={0.5}
                luminanceThreshold={0.9}
                luminanceSmoothing={0.9}
                mipmapBlur
              />
              <SSAO
                intensity={2}
                radius={0.5}
                bias={0.1}
                samples={32}
              />
              <SMAA />
            </EffectComposer>
          </Canvas>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

