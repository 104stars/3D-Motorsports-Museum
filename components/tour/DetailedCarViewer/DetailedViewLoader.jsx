import { Html } from "@react-three/drei";
import { motion } from "motion/react";

export default function DetailedViewLoader() {
  // Animation variants
  const outerTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 3
  };

  const innerTransition = {
    repeat: Infinity,
    ease: "linear",
    duration: 2
  };

  return (
    <Html center style={{ width: "100vw", height: "100vh" }} zIndexRange={[100, 0]}>
      <div className="flex flex-col items-center justify-center w-full h-full bg-[#ededed]">
        <div className="relative flex flex-col items-center gap-8">
          
          {/* Abstract Rotating Assembly */}
          <div className="relative w-20 h-20 md:w-24 md:h-24">
            {/* Outer Ring - Dashed */}
            <motion.div 
              className="absolute inset-0 border-[3px] border-neutral-900/20 rounded-full border-t-neutral-900 border-r-neutral-900"
              animate={{ rotate: 360 }}
              transition={outerTransition}
            />
            
            {/* Inner Ring - Counter Rotating */}
            <motion.div 
              className="absolute inset-4 border-[3px] border-neutral-900/20 rounded-full border-b-neutral-900 border-l-neutral-900"
              animate={{ rotate: -360 }}
              transition={innerTransition}
            />
            
            {/* Center Core - Pulsing */}
            <motion.div 
              className="absolute inset-0 m-auto w-3 h-3 bg-neutral-900 rounded-full"
              animate={{ scale: [1, 1.2, 1], opacity: [1, 0.8, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          {/* Minimal Label */}
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-3"
          >
             <span className="h-px w-8 bg-neutral-300"></span>
             <span className="font-mono text-xs font-bold tracking-[0.3em] text-neutral-900 uppercase">
               Loading
             </span>
             <span className="h-px w-8 bg-neutral-300"></span>
          </motion.div>

        </div>
      </div>
    </Html>
  );
}
