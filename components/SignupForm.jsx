"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { DEFAULT_AVATARS } from "@/lib/avatars/defaultAvatars"

export default function SignupForm({ onToggle }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      setLoading(false)
      return
    }

    try {
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { avatar_id: selectedAvatar } },
      })

      if (signUpError) {
        setError(signUpError.message)
      } else {
        setSuccess(true)
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="py-8">
        <h2 className="text-2xl font-light mb-3 text-white">Check your email!</h2>
        <p className="text-neutral-400 font-light">
          We've sent you a confirmation link to complete your registration.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-neutral-300 font-light text-sm">Email</Label>
        <Input
          id="signup-email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-neutral-300 font-light text-sm">Password</Label>
        <Input
          id="signup-password"
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-neutral-300 font-light text-sm">Confirm password</Label>
        <Input
          id="confirm-password"
          type="password"
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      {/* Avatar selection */}
      <div className="space-y-3">
        <Label className="text-neutral-300 font-light text-sm">Choose your avatar</Label>
        <div className="grid grid-cols-5 gap-3">
          {DEFAULT_AVATARS.map((avatar) => {
            const isSelected = selectedAvatar === avatar.id
            return (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedAvatar(avatar.id)}
                disabled={loading}
                className={`group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? "bg-white/10 ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    : "bg-white/[0.03] hover:bg-white/[0.07] ring-1 ring-white/10 hover:ring-white/20"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={avatar.thumbUrl}
                    alt={avatar.name}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
                <span className={`text-[11px] font-light truncate w-full text-center transition-colors ${
                  isSelected ? "text-white" : "text-neutral-500 group-hover:text-neutral-400"
                }`}>
                  {avatar.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center font-light">{error}</div>
      )}

      <Button 
        type="submit" 
        className="w-full h-12 cursor-pointer text-base font-semibold tracking-wide bg-white text-neutral-950 rounded-full shadow-[0_18px_45px_-25px_rgba(255,255,255,0.85)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_24px_55px_-25px_rgba(255,255,255,0.9)] disabled:opacity-50 disabled:cursor-not-allowed" 
        disabled={loading}
      >
        {loading ? "Creating account..." : "Create account"}
      </Button>

      <p className="text-center text-sm text-neutral-400 font-light">
        Already have an account?{" "}
        <button 
          type="button" 
          onClick={onToggle} 
          className="text-white hover:text-neutral-200 font-normal transition-colors cursor-pointer" 
          disabled={loading}
        >
          Sign in
        </button>
      </p>
    </form>
  )
}

