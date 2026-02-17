"use client"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { User, LogOut, FileSpreadsheet, Diamond } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { getAccessTokenAsync, clearSession } from "@/lib/auth"

export function Hero() {
  const [mounted, setMounted] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    getAccessTokenAsync().then((token) => setAuthenticated(!!token))
  }, [])

  // Re-check auth when page becomes visible (e.g. return from sign-in or another tab)
  useEffect(() => {
    if (!mounted) return
    const onFocus = () => getAccessTokenAsync().then((token) => setAuthenticated(!!token))
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [mounted])

  async function handleLogout() {
    clearSession()
    try {
      const { getSupabaseBrowser } = await import("@/lib/supabase")
      const supabase = getSupabaseBrowser()
      if (supabase) await supabase.auth.signOut()
    } catch {
      // ignore
    }
    setAuthenticated(false)
    router.push("/")
    router.refresh()
  }

  return (
    <section className="relative h-screen w-full overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: "url('/hero-bg.jpg')",
        }}
      />
      
      {/* Subtle overlay for text readability */}
      <div className="absolute inset-0 bg-slate-950/20" />
      
      {/* Content */}
      <div className="relative z-10 flex h-full flex-col">
        {/* Logo + right-side button */}
        <div className="relative z-50 flex items-center justify-between px-6 py-6">
          <Link href="/" className="flex items-center gap-2 text-white">
            <Diamond className="h-5 w-5 text-amber-500" />
            <span className="font-medium">Stone Age</span>
          </Link>
          {mounted && (
            authenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white transition-colors hover:bg-white/20 outline-none focus:ring-2 focus:ring-white/50"
                  aria-label="Account menu"
                >
                  <User className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="min-w-40">
                  <DropdownMenuItem asChild>
                    <Link href="/extract" className="flex items-center gap-2 cursor-pointer">
                      <FileSpreadsheet className="h-4 w-4" />
                      Extract
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer"
                    variant="destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                size="sm"
                className="bg-white text-slate-900 hover:bg-white/90"
                asChild
              >
                <Link href="/signup">Sign up</Link>
              </Button>
            )
          )}
        </div>

        {/* Hero Content - Positioned in upper portion */}
        <div className="flex flex-1 flex-col items-center px-6 pt-16 text-center md:pt-24">
          <h1 className="max-w-3xl text-balance text-5xl font-normal tracking-tight text-white md:text-6xl lg:text-7xl">
            {"From PDFs to Production Data".split(" ").map((word, i) => (
              <motion.span
                key={i}
                initial={{ filter: "blur(10px)", opacity: 0 }}
                whileInView={{ filter: "blur(0px)", opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="inline-block mr-[0.25em]"
              >
                {word}
              </motion.span>
            ))}
          </h1>
          
          <p className="mt-6 max-w-xl text-balance text-center text-sm leading-relaxed text-white/70 md:text-base">
            Reliable PDF extraction and data extraction with schema guarantees. Convert PDF to Excel, extract invoices, and get structured data.
          </p>

          {/* CTAs - Two buttons side by side */}
          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row">
            <Button
              size="lg"
              className="bg-white px-6 text-slate-900 hover:bg-white/90"
              asChild
            >
              <Link href="/get-started">Get Started</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator - At bottom */}
        
      </div>
    </section>
  )
}
