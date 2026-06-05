"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { Button } from "@/components/ui/button"
import CenterUnderline from "@/components/fancy/text/underline-center"
import UnderlineToBackground from "@/components/fancy/text/underline-to-background"
import { useAuth } from "@/components/auth/AuthProvider"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getAvatarThumbUrl } from "@/lib/avatars/defaultAvatars"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { Menu, X } from "lucide-react"

export default function Navigation() {
  const t = useTranslations("nav")
  const { user, loading } = useAuth()
  const initial = user?.email?.[0]?.toUpperCase() || "U"
  const avatarThumb = getAvatarThumbUrl(user?.user_metadata?.avatar_id)

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const hamburgerRef = useRef(null)
  const firstMobileLinkRef = useRef(null)

  const navLinks = [
    { label: t("exhibits"), id: "exhibits" },
    { label: t("tour"), id: "tour" },
    { label: t("about"), id: "about" },
  ]

  const scrollToSection = (event, sectionId) => {
    event.preventDefault()
    const el = document.getElementById(sectionId)
    if (!el) return
    el.scrollIntoView({ behavior: "smooth" })
    // Move keyboard focus to the section so screen readers announce it
    el.setAttribute("tabindex", "-1")
    el.focus({ preventScroll: true })
    closeMobileMenu()
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    // Return focus to hamburger button after closing
    requestAnimationFrame(() => hamburgerRef.current?.focus())
  }

  useEffect(() => {
    if (!mobileMenuOpen) return
    // Focus the first nav link when the menu opens
    requestAnimationFrame(() => firstMobileLinkRef.current?.focus())

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        closeMobileMenu()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    // Prevent body scroll while menu is open
    document.body.style.overflow = "hidden"

    return () => {
      document.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = ""
    }
  }, [mobileMenuOpen])

  return (
    <header className="fixed top-6 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 xl:pl-30 xl:pr-8">
        <div className="grid grid-cols-3 items-center h-12">

          {/* Logo/Brand */}
          <div className="justify-self-start flex items-center h-full">
            <Link
              href="/"
              className="text-white/90 hover:text-white text-xl md:text-2xl font-light tracking-tight focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-4 focus-visible:rounded-sm"
            >
              {t("brand")}
            </Link>
          </div>

          {/* Navigation Links — desktop only */}
          <nav aria-label={t("ariaLabel")} className="hidden md:flex items-center justify-center gap-9 h-full">
            {navLinks.map((link) => (
              <CenterUnderline
                key={link.id}
                as="a"
                href={`#${link.id}`}
                onClick={(e) => scrollToSection(e, link.id)}
                className="text-white font-light text-xl flex items-center h-full focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-4 focus-visible:rounded-sm"
              >
                {link.label}
              </CenterUnderline>
            ))}
          </nav>

          {/* Right side — auth + language + hamburger */}
          <div className="justify-self-end flex items-center gap-4 h-full">
            <LanguageSwitcher variant="compact" />

            {!loading && !user && (
              <UnderlineToBackground
                as={Link}
                href="/login"
                className="text-white/90 font-light text-lg px-4 py-2 text-center hidden md:flex items-center justify-center h-full leading-none focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-4 focus-visible:rounded-sm"
                targetTextColor="#000000"
                maxUnderlineHeightRatio={0.8}
              >
                {t("login")}
              </UnderlineToBackground>
            )}

            {!loading && user && (
              <Link
                href="/profile"
                aria-label={t("viewProfile")}
                className="rounded-full focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
              >
                <Avatar className="h-10 w-10 border-2 border-white/20 hover:border-white/40 transition-colors">
                  {avatarThumb && <AvatarImage src={avatarThumb} alt="" />}
                  <AvatarFallback className="bg-white/10 text-white font-light text-lg">
                    {initial}
                  </AvatarFallback>
                </Avatar>
              </Link>
            )}

            {/* Hamburger — mobile only */}
            <button
              ref={hamburgerRef}
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav"
              aria-label={mobileMenuOpen ? t("menuClose") : t("menuOpen")}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              {mobileMenuOpen
                ? <X className="w-6 h-6" aria-hidden="true" />
                : <Menu className="w-6 h-6" aria-hidden="true" />
              }
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          aria-label={t("ariaLabel")}
          className="fixed inset-0 z-40 bg-neutral-950/97 backdrop-blur-xl flex flex-col items-center justify-center gap-10 md:hidden"
        >
          <button
            className="absolute top-6 right-6 text-white p-2 rounded-lg hover:bg-white/10 transition-colors focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-2"
            aria-label={t("menuClose")}
            onClick={closeMobileMenu}
          >
            <X className="w-6 h-6" aria-hidden="true" />
          </button>

          <nav aria-label={t("ariaLabel")}>
            <ul className="flex flex-col items-center gap-8 list-none p-0 m-0">
              {navLinks.map((link, i) => (
                <li key={link.id}>
                  <a
                    ref={i === 0 ? firstMobileLinkRef : null}
                    href={`#${link.id}`}
                    onClick={(e) => scrollToSection(e, link.id)}
                    className="text-white font-light text-4xl tracking-tight hover:text-white/70 transition-colors focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-4 focus-visible:rounded-sm"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
              {!loading && !user && (
                <li>
                  <Link
                    href="/login"
                    onClick={closeMobileMenu}
                    className="text-white/60 font-light text-2xl hover:text-white transition-colors focus-visible:outline-2 focus-visible:outline-white/70 focus-visible:outline-offset-4 focus-visible:rounded-sm"
                  >
                    {t("login")}
                  </Link>
                </li>
              )}
            </ul>
          </nav>

          <LanguageSwitcher />
        </div>
      )}
    </header>
  )
}
