"use client";
import { useEffect, useMemo, useRef } from "react";
import { motion } from "motion/react";

import { cn } from "@/lib/utils"

const UnderlineToBackground = ({
  children,
  as,
  className,
  transition = { type: "spring", damping: 30, stiffness: 300 },

  // Default to 10% of font size
  underlineHeightRatio = 0.1,

  // Default to 1% of font size
  underlinePaddingRatio = -0.3,

  // Cap the maximum background growth as a ratio of container height (0-1)
  maxUnderlineHeightRatio = 0.7,

  targetTextColor = "#fef",
  ...props
}) => {
  const textRef = useRef(null)

  // Create custom motion component based on the 'as' prop
  const MotionComponent = useMemo(() => motion.create(as ?? "span"), [as])

  // Update CSS custom properties based on font size
  useEffect(() => {
    const updateUnderlineStyles = () => {
      if (textRef.current) {
        const fontSize = parseFloat(getComputedStyle(textRef.current).fontSize)
        const underlineHeight = fontSize * underlineHeightRatio
        const underlinePadding = fontSize * underlinePaddingRatio
        textRef.current.style.setProperty("--underline-height", `${underlineHeight}px`)
        textRef.current.style.setProperty("--underline-padding", `${underlinePadding}px`)
        // Set a CSS variable for max growth percentage
        const clampedRatio = Math.max(0, Math.min(1, maxUnderlineHeightRatio))
        textRef.current.style.setProperty("--max-underline-height", `${clampedRatio * 100}%`)
      }
    }

    updateUnderlineStyles()
    window.addEventListener("resize", updateUnderlineStyles)

    return () => window.removeEventListener("resize", updateUnderlineStyles);
  }, [underlineHeightRatio, underlinePaddingRatio, maxUnderlineHeightRatio])

  // Animation variants for the underline background
  const underlineVariants = {
    initial: {
      height: "var(--underline-height)",
    },
    target: {
      // Cap the maximum height the underline can reach to keep text vertically centered
      height: "var(--max-underline-height)",
      transition: transition,
    },
  }

  // Animation variants for the text color
  const textVariants = {
    initial: {
      color: "currentColor",
      transition: transition,
    },
    target: {
      color: targetTextColor,
      transition: transition,
    },
  }

  return (
    <MotionComponent
      className={cn("relative inline-block cursor-pointer", className)}
      whileHover="target"
      ref={textRef}
      {...props}>
      <motion.div
        className="absolute bg-current w-full"
        style={{
          height: "var(--underline-height)",
          bottom: "calc(-1 * var(--underline-padding))",
        }}
        variants={underlineVariants}
        aria-hidden="true" />
      <motion.span variants={textVariants} className="text-current relative">
        {children}
      </motion.span>
    </MotionComponent>
  );
}

UnderlineToBackground.displayName = "UnderlineToBackground"

export default UnderlineToBackground
