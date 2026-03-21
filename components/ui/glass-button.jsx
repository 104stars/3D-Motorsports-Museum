"use client"

import { useState, cloneElement, isValidElement } from "react"

export function GlassButton({ children, className = "", asChild = false, ...props }) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  const glassStyles = {
    background: isPressed
      ? "rgba(255, 255, 255, 0.12)"
      : isHovered
        ? "rgba(255, 255, 255, 0.15)"
        : "rgba(255, 255, 255, 0.08)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    boxShadow: isPressed
      ? "inset 0 4px 12px rgba(0, 0, 0, 0.3), 0 2px 8px rgba(255, 255, 255, 0.05)"
      : isHovered
        ? "0 8px 32px rgba(255, 255, 255, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.3)"
        : "0 4px 24px rgba(255, 255, 255, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
    transform: isPressed ? "translateY(2px) scale(0.995)" : "translateY(0)",
  }

  const glassEffects = (
    <>
      {/* Top highlight - simulates light reflection on glass */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-1/2 rounded-full transition-opacity duration-300"
        style={{
          background: "linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)",
          opacity: isPressed ? 0.4 : isHovered ? 0.8 : 0.6,
        }}
      />

      {/* Shimmer effect on hover */}
      <div
        className="pointer-events-none absolute inset-0 translate-x-[-100%] transition-transform duration-700 ease-out"
        style={{
          background: "linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)",
          transform: isHovered ? "translateX(100%)" : "translateX(-100%)",
        }}
      />

      {/* Bottom shadow - adds depth */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 rounded-full transition-opacity duration-300"
        style={{
          background: "linear-gradient(0deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0) 100%)",
          opacity: isPressed ? 0.6 : 0.4,
        }}
      />
    </>
  )

  if (asChild && isValidElement(children)) {
    return cloneElement(children, {
      className: `group relative overflow-hidden rounded-full px-6 h-10 font-medium text-white transition-all duration-300 ease-out flex items-center justify-center ${className}`,
      style: { ...glassStyles, ...children.props.style },
      onMouseEnter: (e) => {
        setIsHovered(true)
        children.props.onMouseEnter?.(e)
      },
      onMouseLeave: (e) => {
        setIsHovered(false)
        setIsPressed(false)
        children.props.onMouseLeave?.(e)
      },
      onMouseDown: (e) => {
        setIsPressed(true)
        children.props.onMouseDown?.(e)
      },
      onMouseUp: (e) => {
        setIsPressed(false)
        children.props.onMouseUp?.(e)
      },
      children: (
        <>
          {glassEffects}
          <span
            className="relative z-10 tracking-wide"
            style={{
              textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
            }}
          >
            {children.props.children}
          </span>
        </>
      ),
      ...props,
    })
  }

  return (
    <button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPressed(false)
      }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      className={`group relative overflow-hidden rounded-full px-6 h-10 font-medium text-white transition-all duration-300 ease-out flex items-center justify-center ${className}`}
      style={glassStyles}
      {...props}
    >
      {glassEffects}
      
      {/* Content with subtle shadow */}
      <span
        className="relative z-10 tracking-wide"
        style={{
          textShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
        }}
      >
        {children}
      </span>
    </button>
  )
}
