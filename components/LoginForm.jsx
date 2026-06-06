"use client"

import { useState } from "react"
import { useRouter } from 'next/navigation'
import { useTranslations } from "next-intl"
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/PasswordInput"

export default function LoginForm({ onToggle }) {
  const t = useTranslations("auth")
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
        router.push("/")
      }
    } catch (err) {
      setError(t("unexpectedError"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-neutral-300 font-light text-sm">{t("email")}</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? "login-error" : undefined}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-neutral-300 font-light text-sm">{t("password")}</Label>
        <PasswordInput
          id="password"
          autoComplete="current-password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? "login-error" : undefined}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      <div
        id="login-error"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
        className="text-red-400 text-sm text-center font-light empty:hidden"
      >
        {error}
      </div>

      <Button
        type="submit"
        aria-busy={loading}
        className="w-full cursor-pointer h-12 text-base font-semibold tracking-wide bg-white text-neutral-950 rounded-full shadow-[0_18px_45px_-25px_rgba(255,255,255,0.85)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_24px_55px_-25px_rgba(255,255,255,0.9)] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? t("signingIn") : t("signIn")}
      </Button>

      <p className="text-center text-sm text-neutral-400 font-light">
        {t("noAccount") + " "}
        <button
          type="button"
          onClick={onToggle}
          className="text-white hover:text-neutral-200 font-normal transition-colors cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
          disabled={loading}
        >
          {t("signUp")}
        </button>
      </p>
    </form>
  )
}
