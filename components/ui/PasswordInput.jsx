"use client"

import { useState } from "react"
import { useTranslations } from "next-intl"
import { Eye, EyeOff } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

/**
 * Password field with an accessible show/hide toggle.
 * Forwards all input props (id, value, onChange, autoComplete, aria-*, etc.)
 * straight through to the underlying Input.
 */
export function PasswordInput({ id, className, ...props }) {
  const t = useTranslations("auth")
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cn("pr-12", className)}
        {...props}
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? t("hidePassword") : t("showPassword")}
        aria-pressed={visible}
        aria-controls={id}
        disabled={props.disabled}
        className="absolute inset-y-0 right-0 flex items-center px-3 text-neutral-400 hover:text-white transition-colors rounded-r-xl focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {visible ? (
          <EyeOff className="w-5 h-5" aria-hidden="true" />
        ) : (
          <Eye className="w-5 h-5" aria-hidden="true" />
        )}
      </button>
    </div>
  )
}
