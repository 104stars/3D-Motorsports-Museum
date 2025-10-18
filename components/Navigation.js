"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Navigation() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/30 backdrop-blur-sm">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo/Brand */}
          <Link href="/" className="text-white text-xl font-semibold">
            Motorsports Museum
          </Link>

          {/* Navigation Links and Auth Buttons */}
          <div className="flex items-center gap-8">
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-8">
              <Link 
                href="#exhibits" 
                className="text-white hover:text-white/80 transition-colors"
              >
                Exhibits
              </Link>
              <Link 
                href="#tour" 
                className="text-white hover:text-white/80 transition-colors"
              >
                Tour
              </Link>
              <Link 
                href="#about" 
                className="text-white hover:text-white/80 transition-colors"
              >
                About
              </Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <Button 
                asChild 
                variant="ghost" 
                className="text-white hover:text-white hover:bg-white/10"
              >
                <Link href="/login">Login</Link>
              </Button>
              <Button 
                asChild 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-black"
              >
                <Link href="/register">Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
