"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useTranslations } from "next-intl"
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/components/ui/PasswordInput"
import { DEFAULT_AVATARS } from "@/lib/avatars/defaultAvatars"

export default function SignupForm({ onToggle }) {
  const t = useTranslations("auth")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [selectedAvatar, setSelectedAvatar] = useState(DEFAULT_AVATARS[0].id)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()
  const supabase = createClient()
  const successHeadingRef = useRef(null)
  const avatarRefs = useRef([])

  const handleAvatarKeyDown = (e) => {
    const keys = ["ArrowRight", "ArrowDown", "ArrowLeft", "ArrowUp"]
    if (!keys.includes(e.key)) return
    e.preventDefault()
    const currentIndex = DEFAULT_AVATARS.findIndex((a) => a.id === selectedAvatar)
    const forward = e.key === "ArrowRight" || e.key === "ArrowDown"
    const nextIndex =
      (currentIndex + (forward ? 1 : -1) + DEFAULT_AVATARS.length) % DEFAULT_AVATARS.length
    setSelectedAvatar(DEFAULT_AVATARS[nextIndex].id)
    avatarRefs.current[nextIndex]?.focus()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError(t("passwordMismatch"))
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setError(t("passwordTooShort"))
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
      setError(t("unexpectedError"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (success) {
      successHeadingRef.current?.focus()
    }
  }, [success])

  if (success) {
    return (
      <div className="py-8" role="status" aria-live="polite" aria-atomic="true">
        <h2
          ref={successHeadingRef}
          tabIndex={-1}
          className="text-2xl font-light mb-3 text-white outline-none"
        >
          {t("checkEmail")}
        </h2>
        <p className="text-neutral-400 font-light">
          {t("confirmationSent")}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="signup-email" className="text-neutral-300 font-light text-sm">{t("email")}</Label>
        <Input
          id="signup-email"
          type="email"
          autoComplete="email"
          placeholder={t("emailPlaceholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? "signup-error" : undefined}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="signup-password" className="text-neutral-300 font-light text-sm">{t("password")}</Label>
        <PasswordInput
          id="signup-password"
          autoComplete="new-password"
          placeholder={t("passwordPlaceholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? "signup-error" : undefined}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirm-password" className="text-neutral-300 font-light text-sm">{t("confirmPassword")}</Label>
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          placeholder={t("confirmPasswordPlaceholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          aria-required="true"
          aria-invalid={!!error}
          aria-describedby={error ? "signup-error" : undefined}
          className="h-12 bg-white/5 border-white/10 text-white placeholder:text-neutral-500 focus:border-white/25 focus:ring-white/20 rounded-xl transition-colors"
          disabled={loading}
        />
      </div>

      {/* Avatar selection */}
      <div className="space-y-3">
        <span id="avatar-group-label" className="block text-neutral-300 font-light text-sm">{t("chooseAvatar")}</span>
        <div
          role="radiogroup"
          aria-labelledby="avatar-group-label"
          onKeyDown={handleAvatarKeyDown}
          className="grid grid-cols-5 gap-3"
        >
          {DEFAULT_AVATARS.map((avatar, index) => {
            const isSelected = selectedAvatar === avatar.id
            return (
              <button
                key={avatar.id}
                ref={(el) => (avatarRefs.current[index] = el)}
                type="button"
                role="radio"
                aria-checked={isSelected}
                aria-label={avatar.name}
                tabIndex={isSelected ? 0 : -1}
                onClick={() => setSelectedAvatar(avatar.id)}
                disabled={loading}
                className={`group flex flex-col items-center gap-1.5 rounded-xl p-2 transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2 ${
                  isSelected
                    ? "bg-white/10 ring-2 ring-white shadow-[0_0_12px_rgba(255,255,255,0.15)]"
                    : "bg-white/[0.03] hover:bg-white/[0.07] ring-1 ring-white/10 hover:ring-white/20"
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className="relative w-full aspect-square rounded-lg overflow-hidden bg-white/5">
                  <img
                    src={avatar.thumbUrl}
                    alt=""
                    aria-hidden="true"
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

      <div
        id="signup-error"
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
        className="w-full h-12 cursor-pointer text-base font-semibold tracking-wide bg-white text-neutral-950 rounded-full shadow-[0_18px_45px_-25px_rgba(255,255,255,0.85)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_24px_55px_-25px_rgba(255,255,255,0.9)] disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? t("creatingAccount") : t("createAccountBtn")}
      </Button>

      <p className="text-center text-sm text-neutral-400 font-light">
        {t("hasAccount")}{" "}
        <button
          type="button"
          onClick={onToggle}
          className="text-white hover:text-neutral-200 font-normal transition-colors cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
          disabled={loading}
        >
          {t("signIn")}
        </button>
      </p>
    </form>
  )
}

