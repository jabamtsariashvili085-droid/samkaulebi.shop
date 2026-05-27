"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-[#e3e1e2]">
      {/* Background Video — full cover */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          overflow: 'hidden',
          zIndex: 0,
        }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            minWidth: '100%',
            minHeight: '100%',
            width: 'auto',
            height: 'auto',
            objectFit: 'cover',
          }}
        >
          <source
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/f3d8cad2-8091-4809-aac0-eaac74b0be7c-Z4XUCz3CRR7qjaOsoq6rFmbJfIRdgs.mp4"
            type="video/mp4"
          />
        </video>

        {/* Bottom fade gradient */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '60%',
            background: 'linear-gradient(to top, var(--background) 0%, rgba(247,244,239,0.5) 40%, transparent 100%)',
            zIndex: 1,
          }}
        />

        {/* Top fade for header readability */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '200px',
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, transparent 100%)',
            zIndex: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="relative w-full pt-20 mr-14 lg:mr-0" style={{ zIndex: 10 }}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="w-full lg:max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <span
              className="text-sm uppercase mb-6 block text-black animate-blur-in opacity-0 tracking-widest font-medium"
              style={{ animationDelay: '0.2s', animationFillMode: 'forwards' }}
            >
              პრემიუმ ხარისხი
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-[1.1] mb-6 text-balance text-black">
              <span
                className="block animate-blur-in opacity-0 font-semibold"
                style={{ animationDelay: '0.4s', animationFillMode: 'forwards' }}
              >
                შენი სტილი.
              </span>
              <span
                className="block animate-blur-in opacity-0 font-semibold xl:text-9xl text-7xl"
                style={{ animationDelay: '0.6s', animationFillMode: 'forwards' }}
              >
                შენი არჩევანი.
              </span>
            </h1>

            <p
              className="text-lg leading-relaxed mb-10 max-w-md mx-auto lg:mx-0 text-black/80 animate-blur-in opacity-0"
              style={{ animationDelay: '0.8s', animationFillMode: 'forwards' }}
            >
              აღმოაჩინე უნიკალური სამკაულები, ელიტური სუნამოები და პროფესიონალური
              თავის მოვლის საშუალებები.
            </p>

            <div
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-blur-in opacity-0"
              style={{ animationDelay: '1s', animationFillMode: 'forwards' }}
            >
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
              >
                მაღაზია
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
              </Link>
              <Link
                href="/shop"
                className="group inline-flex items-center justify-center gap-3 bg-white/20 backdrop-blur-sm text-black px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-white/30 border border-black/20"
              >
                სამკაულები
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-black" style={{ zIndex: 10 }}>
        <span className="text-xs tracking-widest uppercase font-bold">გადაახვიე</span>
        <div className="w-px h-12 bg-black/20 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1/2 bg-black/60 animate-pulse" />
        </div>
      </div>
    </section>
  )
}
