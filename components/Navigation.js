"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import CenterUnderline from "@/components/fancy/text/underline-center"
import UnderlineToBackground from "@/components/fancy/text/underline-to-background"
import { useAuth } from "@/components/auth/AuthProvider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

export default function Navigation() {
  const { user, loading } = useAuth()
  const initial = user?.email?.[0]?.toUpperCase() || "U"

  return (
    <nav className="fixed top-6 left-0 right-0 z-50">
      <div className="container mx-auto px-6 py-4 xl:pl-30 xl:pr-8">
        <div className="grid grid-cols-3 items-center h-12">
          {/* Logo/Brand */}
          <div className="justify-self-start flex items-center h-full">
            <Link href="/" className="text-white/90 hover:text-white text-xl md:text-2xl font-light tracking-tight">
              Motorsports Museum
            </Link>
          </div>

          {/* Navigation Links - Center */}
          <div className="hidden md:flex items-center justify-center gap-9 h-full">
            <CenterUnderline as={Link} href="#exhibits" className="text-white font-light text-xl flex items-center h-full">
              Exhibits
            </CenterUnderline>
            <CenterUnderline as={Link} href="#tour" className="text-white font-light text-xl flex items-center h-full">
              Tour
            </CenterUnderline>
            <CenterUnderline as={Link} href="#about" className="text-white font-light text-xl flex items-center h-full">
              About
            </CenterUnderline>
          </div>

          {/* Auth Button/Avatar - Right */}
          <div className="justify-self-end flex items-center h-full">
            {!loading && !user && (
              <UnderlineToBackground
                as={Link}
                href="/login"
                className="text-white/90 font-light text-lg px-4 py-2 text-center flex items-center justify-center h-full leading-none"
                targetTextColor="#000000"
                maxUnderlineHeightRatio={0.8}
              >
                Login
              </UnderlineToBackground>
            )}
            {!loading && user && (
              <Avatar className="h-10 w-10 border-2 border-white/20 hover:border-white/40 transition-colors cursor-pointer">
                <AvatarFallback className="bg-white/10 text-white font-light text-lg">
                  {initial}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
