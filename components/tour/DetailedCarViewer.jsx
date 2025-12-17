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
import { X, Home, Loader2 } from "lucide-react";
import { getHighQualityModelUrl } from "@/lib/tour/carConfig";
import { cn } from "@/lib/utils";

/**
 * High-quality car model component with enhanced materials and shadows
 */
function CarModel({ url, onLoaded }) {
  const { scene } = useGLTF(url);
  const modelRef = useRef(null);

  useEffect(() => {
    if (!scene || !modelRef.current) return;

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

    // Calculate bounding box and notify parent for camera positioning
    if (onLoaded) {
      const box = new Box3().setFromObject(scene);
      const center = box.getCenter(new Vector3());
      const size = box.getSize(new Vector3());
      onLoaded({ center, size, scene });
    }
  }, [scene, onLoaded]);

  return <primitive ref={modelRef} object={scene} />;
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
  const resetCameraRef = useRef(null);

  const handleModelLoaded = (bounds) => {
    modelBoundsRef.current = bounds;
  };

  const handleControlsReady = (resetFn) => {
    resetCameraRef.current = resetFn;
  };

  const handleResetCamera = () => {
    if (resetCameraRef.current) {
      resetCameraRef.current();
    }
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
    <AnimatePresence>
      <div
        className="fixed inset-0 z-[60] flex items-center justify-center"
        role="dialog"
        aria-modal="true"
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/95 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
          aria-hidden="true"
        />

        {/* Viewer Container */}
        <motion.div
          className={cn(
            "relative w-full h-full",
            "focus:outline-none"
          )}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30,
            mass: 0.8
          }}
        >
          {/* Close Button */}
          <motion.button
            onClick={onClose}
            className={cn(
              "absolute top-6 right-6 p-3 rounded-full z-50",
              "bg-black/40 backdrop-blur-md text-white/70",
              "hover:text-white hover:bg-black/60",
              "transition-colors duration-200 border border-white/10",
              "group"
            )}
            aria-label="Close viewer"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X className="w-6 h-6 transition-transform group-hover:rotate-90 duration-300" strokeWidth={1.5} />
          </motion.button>

          {/* 3D Canvas */}
          <Canvas
            shadows
            dpr={[1, 3]}
            gl={{
              antialias: true,
              toneMapping: ACESFilmicToneMapping,
              toneMappingExposure: 1.0,
              outputColorSpace: SRGBColorSpace,
              alpha: true,
            }}
            camera={{ 
              position: [0, 0, 5], 
              fov: 50,
              near: 0.1,
              far: 1000
            }}
          >
            <color attach="background" args={["#000000"]} />

            <SceneContent 
              carId={carId} 
              onModelLoaded={handleModelLoaded}
              isActive={isActive}
              onControlsReady={handleControlsReady}
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

          {/* Reset Camera Button */}
          <motion.button
            onClick={handleResetCamera}
            className={cn(
              "absolute bottom-20 right-6 p-3 rounded-full z-50",
              "bg-black/40 backdrop-blur-md text-white/70",
              "hover:text-white hover:bg-black/60",
              "transition-colors duration-200 border border-white/10"
            )}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label="Reset camera"
          >
            <Home className="w-5 h-5" strokeWidth={1.5} />
          </motion.button>

          {/* Hint text */}
          <motion.div
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-xs font-mono text-white/50 tracking-widest uppercase text-center">
              Drag to rotate • Scroll to zoom • Press <kbd className="px-2 py-1 rounded bg-white/5 border border-white/10 mx-1 text-white/70">ESC</kbd> to close
            </p>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

