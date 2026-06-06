"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { useTranslations } from "next-intl"
import LoginForm from "./LoginForm"
import SignupForm from "./SignupForm"

const SilkBackground = dynamic(() => import("./Silk"), { ssr: false })

export default function AuthPage() {
  const t = useTranslations("auth")
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
      <main
        id="main-content"
        tabIndex={-1}
        aria-labelledby="auth-heading"
        className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-12 relative overflow-hidden isolate outline-none"
      >
        {/* Back button */}
        <Link
          href="/"
          aria-label={t("backToHome")}
          className="absolute top-8 left-8 z-30 text-white/80 hover:text-white transition-colors rounded-sm focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
            focusable="false"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
        </Link>

        <div aria-hidden="true" className="absolute inset-0 z-0">
          <SilkBackground speed={3.3} scale={0.8} rotation={0.2} noiseIntensity={0.8} color="#212121" />
        </div>

        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-br from-neutral-950/40 via-neutral-950/30 to-neutral-950/20 z-10" />

        <div className="w-full max-w-md relative z-20">
          <div className="mb-10" aria-live="polite" aria-atomic="true">
            <h1 id="auth-heading" className="text-4xl md:text-5xl font-light mb-3 text-white font-sans">
              {isLogin ? t("welcomeBack") : t("createAccount")}
            </h1>
            <p className="text-neutral-400 text-lg font-light">
              {isLogin
                ? t("loginSubtitle")
                : t("signupSubtitle")}
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
          <div aria-hidden="true" className="absolute inset-0 bg-neutral-900 z-20 wormCover" />
        )}
      </main>

      {/* Right side - Image (decorative) */}
      <div aria-hidden="true" className="hidden lg:block lg:w-1/2 relative">
        <img
          src="/login.webp"
          alt=""
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
