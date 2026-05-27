"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"
import Image from "next/image"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubscribed, setIsSubscribed] = useState(false)

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    if (email) {
      setIsSubscribed(true)
      setEmail("")
    }
  }

  return (
    <section className="relative w-full overflow-hidden" style={{ minHeight: 420 }}>
      {/* Background image */}
      <Image
        src="/images/banner-bestsellers.jpg"
        alt="Best Sellers"
        fill
        className="object-cover object-center"
        priority
      />

      {/* Subtle overlay so form text is readable */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Newsletter form — centered */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[420px] px-6 py-16">
        <p className="text-xs uppercase tracking-[0.25em] text-white/70 font-medium mb-4">
          Newsletter
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-white text-center mb-4 font-semibold drop-shadow-md">
          პირველი გაიგე,{" "}
          <span className="italic font-normal">პირველი ისარგებლე.</span>
        </h2>
        <p className="text-sm text-white/75 mb-8 text-center max-w-sm">
          ექსკლუზიური შეთავაზებები და ახალი კოლექციები — პირდაპირ შენს ელ-ფოსტაზე.
        </p>

        {isSubscribed ? (
          <div className="inline-flex items-center gap-3 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-8 py-4">
            <Check className="w-4 h-4 text-white" />
            <span className="text-sm text-white font-medium">მადლობა! გამოწერა წარმატებულია.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="შეიყვანე ელ-ფოსტა"
              className="flex-1 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full px-6 py-3.5 text-white text-sm placeholder:text-white/55 focus:outline-none focus:border-white/60 transition-all"
              required
            />
            <button
              type="submit"
              className="group inline-flex items-center justify-center gap-2 bg-white text-foreground px-7 py-3.5 rounded-full text-sm font-medium hover:bg-white/90 transition-all duration-300 whitespace-nowrap"
            >
              გამოწერა
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </form>
        )}

        <p className="text-xs text-white/40 mt-5">
          სპამი არ გვიყვარს. ნებისმიერ დროს გაუქმება შეიძლება.
        </p>
      </div>
    </section>
  )
}
