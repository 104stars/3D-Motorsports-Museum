"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginForm({ onToggle }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        setError(signInError.message)
      } else {
        router.push("/dashboard")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-neutral-300 font-light text-sm">Email</Label>
        <Input
          id="email"
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
        <Label htmlFor="password" className="text-neutral-300 font-light text-sm">Password</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      {error && (
        <div className="text-red-400 text-sm text-center font-light">{error}</div>
      )}

      <Button 
        type="submit" 
        className="w-full h-12 text-base font-semibold tracking-wide bg-white text-neutral-950 rounded-full shadow-[0_18px_45px_-25px_rgba(255,255,255,0.85)] transition-transform duration-300 hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-[0_24px_55px_-25px_rgba(255,255,255,0.9)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0" 
        disabled={loading}
      >
        {loading ? "Signing in..." : "Sign in"}
      </Button>

      <p className="text-center text-sm text-neutral-400 font-light">
        {"Don't have an account? "}
        <button 
          type="button" 
          onClick={onToggle} 
          className="text-white hover:text-neutral-200 font-normal transition-colors" 
          disabled={loading}
        >
          Sign up
        </button>
      </p>
    </form>
  )
}

