"use client"

import { useState } from "react"
import { LoginForm } from "@/components/login-form"
import { SignupForm } from "@/components/signup-form"

export function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleToggle = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setIsLogin(!isLogin)
    }, 500)

    setTimeout(() => {
      setIsAnimating(false)
    }, 1000)
  }

  return (
    <div className="min-h-screen flex">
      {/* Left side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative overflow-hidden">
        <div className="w-full max-w-md relative z-10">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2 text-balance">{isLogin ? "Welcome back" : "Create account"}</h1>
            <p className="text-muted-foreground text-pretty">
              {isLogin
                ? "Enter your credentials to access your account"
                : "Sign up to get started with your new account"}
            </p>
          </div>

          <div className="relative">
            {isLogin ? <LoginForm onToggle={handleToggle} /> : <SignupForm onToggle={handleToggle} />}
          </div>
        </div>

        <div
          className={`absolute left-0 right-0 bg-accent z-20 ${isAnimating ? "animate-worm-down" : ""}`}
          style={{
            top: isAnimating ? "0" : "-100%",
            height: isAnimating ? undefined : "100%",
          }}
        />
      </div>

      {/* Right side - Image */}
      <div className="hidden lg:block lg:w-1/2 relative bg-card">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5" />
        <img
          src="/placeholder.svg?height=1080&width=1080"
          alt="Authentication background"
          className="w-full h-full object-cover mix-blend-overlay"
        />
        <div className="absolute inset-0 flex items-center justify-center p-12">
          <div className="max-w-lg text-center">
            <h2 className="text-5xl font-bold mb-6 text-balance text-foreground">Start your journey today</h2>
            <p className="text-xl text-muted-foreground text-pretty leading-relaxed">
              Join thousands of users who trust our platform for their daily needs
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
