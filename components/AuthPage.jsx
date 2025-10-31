"use client"

import { useState } from "react"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    // Switch content at 50% of the animation
    setTimeout(() => {
      setIsLogin(!isLogin)
    }, 300)

    // End animation at 100%
    setTimeout(() => {
      setIsAnimating(false)
    }, 600)
  }

  return (
    <div className="min-h-screen flex bg-neutral-950">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden">
        {/* Subtle background grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 -z-10 opacity-30"
        >
          <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:24px_24px]" />
        </div>

        <div className="w-full max-w-md relative z-10">
          <div className="mb-10">
            <h1 className="text-4xl md:text-5xl font-light mb-3 text-white font-sans">
              {isLogin ? "Welcome back" : "Create account"}
            </h1>
            <p className="text-neutral-400 text-lg font-light">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to start your motorsport journey"}
            </p>
          </div>

          <div className="relative">
            {isLogin ? (
              <LoginForm onToggle={handleToggle} />
            ) : (
              <SignupForm onToggle={handleToggle} />
            )}
          </div>
        </div>

        {isAnimating && (
          <div className="absolute inset-0 bg-neutral-900 z-20 wormCover" />
        )}
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/login.webp"
          alt="Motorsport racing"
          className="w-full h-full object-cover"
        />
      </div>

      <style jsx>{`
        .wormCover {
          /* Start collapsed at the top to avoid any flash */
          clip-path: inset(0 0 100% 0);
          will-change: clip-path;
          animation: wormClip 600ms ease-in-out forwards;
        }

        @keyframes wormClip {
          0% {
            /* Block starts collapsed at top */
            clip-path: inset(0 0 100% 0);
          }
          50% {
            /* Fully extended: covers entire area */
            clip-path: inset(0 0 0 0);
          }
          100% {
            /* Collapsed at bottom: exits */
            clip-path: inset(100% 0 0 0);
          }
        }
      `}</style>
    </div>
  )
}