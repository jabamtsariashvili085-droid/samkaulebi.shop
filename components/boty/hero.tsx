"use client"

import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

const stats = [
  { value: "500+", label: "პროდუქტი" },
  { value: "უფასო", label: "მიტანა 150₾+" },
  { value: "14 დღე", label: "დაბრუნება" },
]

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#e3e1e2]">
      {/* Background Video */}
      <div className="absolute inset-0 overflow-hidden">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f3d8cad2-8091-4809-aac0-eaac74b0be7c-Z4XUCz3CRR7qjaOsoq6rFmbJfIRdgs.mp4"
            type="video/mp4"
          />
        </video>

        {/* Bottom gradient */}
        <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-background via-background/40 to-transparent" />
        {/* Top gradient for header */}
        <div className="absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-black/20 to-transparent" />
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-black/5" />
      </div>

      {/* Content */}
      <div className="relative w-full pt-28 md:pt-32 lg:pt-40 z-10 flex flex-col justify-center min-h-[100dvh]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 w-full mt-[-8dvh] md:mt-0">
          <div className="w-full lg:max-w-2xl">

            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-1.5 mb-6 animate-blur-in opacity-0"
              style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}
            >
              <Sparkles className="w-3.5 h-3.5 text-black/70" />
              <span className="text-xs uppercase tracking-widest text-black/75 font-medium">
                პრემიუმ კოლექცია 2025
              </span>
            </div>

            {/* Headline */}
            <h1 className="font-serif leading-[1.05] mb-6 text-black tracking-tight">
              <span
                className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium animate-blur-in opacity-0"
                style={{ animationDelay: "0.25s", animationFillMode: "forwards" }}
              >
                სილამაზე, რომელიც
              </span>
              <span
                className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[6.5rem] font-bold animate-blur-in opacity-0"
                style={{ animationDelay: "0.45s", animationFillMode: "forwards" }}
              >
                მოგიყვება.
              </span>
            </h1>

            {/* Description */}
            <p
              className="text-base md:text-lg leading-relaxed mb-10 max-w-md text-black/70 animate-blur-in opacity-0"
              style={{ animationDelay: "0.65s", animationFillMode: "forwards" }}
            >
              სამკაულები, სუნამოები და თავის მოვლის საშუალებები — ყველა ის, რაც
              შენი სტილს ავსებს.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-col sm:flex-row gap-3 md:gap-4 mb-14 animate-blur-in opacity-0"
              style={{ animationDelay: "0.8s", animationFillMode: "forwards" }}
            >
              <Link
                href="/shop"
                className="group inline-flex w-full sm:w-auto justify-center items-center gap-2.5 bg-foreground text-background px-7 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-foreground/85 transition-all duration-300 shadow-xl shadow-black/10"
              >
                მაღაზია
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
              <Link
                href="/category/jewelry"
                className="inline-flex w-full sm:w-auto justify-center items-center gap-2.5 bg-white/30 backdrop-blur-md text-black px-7 py-4 rounded-full text-sm font-medium tracking-wide hover:bg-white/50 transition-all duration-300 border border-white/50"
              >
                სამკაულები
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex flex-wrap gap-3 animate-blur-in opacity-0"
              style={{ animationDelay: "1s", animationFillMode: "forwards" }}
            >
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2.5 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-4 py-2"
                >
                  <span className="text-sm font-bold text-black">{s.value}</span>
                  <span className="text-xs text-black/60">{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 animate-blur-in opacity-0"
        style={{ animationDelay: "1.2s", animationFillMode: "forwards" }}
      >
        <span className="text-[10px] tracking-[0.2em] uppercase text-black/40 font-medium">scroll</span>
        <div className="w-[1px] h-10 bg-black/15 relative overflow-hidden rounded-full">
          <div
            className="absolute top-0 left-0 w-full bg-black/50 rounded-full"
            style={{
              height: "40%",
              animation: "scrollDrop 1.8s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style jsx>{`
        @keyframes scrollDrop {
          0%   { transform: translateY(-100%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateY(250%); opacity: 0; }
        }
      `}</style>
    </section>
  )
}
