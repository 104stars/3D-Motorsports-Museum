"use client";
import { useEffect, useState } from "react"
import { motion, stagger, useAnimate } from "motion/react";

const LetterSwapForward = ({
  label,
  reverse = true,
  triggerParentHover = false,

  transition = {
    type: "spring",
    duration: 0.7,
  },

  staggerDuration = 0.03,
  staggerFrom = "first",
  className,
  onClick,
  ...props
}) => {
  const [scope, animate] = useAnimate()
  const [blocked, setBlocked] = useState(false)

  const hoverStart = () => {
    if (blocked) return

    setBlocked(true)

    // Function to merge user transition with stagger and delay
    const mergeTransition = (baseTransition) => ({
      ...baseTransition,
      delay: stagger(staggerDuration, {
        from: staggerFrom,
      }),
    })

    animate(".letter", { y: reverse ? "100%" : "-100%" }, mergeTransition(transition)).then(() => {
      animate(".letter", {
        y: 0,
      }, {
        duration: 0,
      }).then(() => {
        setBlocked(false)
      })
    })

    animate(".letter-secondary", {
      top: "0%",
    }, mergeTransition(transition)).then(() => {
      animate(".letter-secondary", {
        top: reverse ? "-100%" : "100%",
      }, {
        duration: 0,
      })
    })
  }

  useEffect(() => {
    if (!triggerParentHover) return
    const node = scope?.current
    // Attach to the nearest element with 'group' (GlassButton adds this to the clickable root)
    const target = node?.closest?.(".group") || node?.parentElement
    if (!target) return

    target.addEventListener("mouseenter", hoverStart)
    return () => {
      target.removeEventListener("mouseenter", hoverStart)
    }
  }, [triggerParentHover])

  return (
    <span
      className={`flex justify-center items-center relative overflow-hidden  ${className} `}
      onMouseEnter={triggerParentHover ? undefined : hoverStart}
      onClick={onClick}
      ref={scope}
      {...props}>
      <span className="sr-only">{label}</span>
      {label.split("").map((letter, i) => {
        return (
          <span className="whitespace-pre relative flex" key={i} aria-hidden={true}>
            <motion.span className={`relative letter`} style={{ top: 0 }}>
              {letter}
            </motion.span>
            <motion.span
              className="absolute letter-secondary "
              style={{ top: reverse ? "-100%" : "100%" }}>
              {letter}
            </motion.span>
          </span>
        );
      })}
    </span>
  );
}

export default LetterSwapForward
