"use client"

import { useState } from "react"
import { ArrowRight, Check } from "lucide-react"

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
    <section className="relative py-28 overflow-hidden bg-gradient-to-br from-[#C9A84C] via-[#D4AF37] to-[#B8962E]">
      {/* Decorative background rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none">
        <svg
          width="900"
          height="900"
          viewBox="0 0 900 900"
          fill="none"
          className="opacity-[0.25]"
        >
          <circle cx="450" cy="450" r="200" stroke="#7A5C1E" strokeWidth="1" />
          <circle cx="450" cy="450" r="300" stroke="#7A5C1E" strokeWidth="0.75" />
          <circle cx="450" cy="450" r="400" stroke="#7A5C1E" strokeWidth="0.5" />
          <circle cx="450" cy="450" r="430" stroke="#7A5C1E" strokeWidth="0.4" />
        </svg>
      </div>

      {/* Soft top/bottom edge fades */}
      <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-background to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-background to-transparent" />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <div className="max-w-xl mx-auto text-center">
          {/* Eyebrow */}
          <p className="text-xs uppercase tracking-[0.25em] text-foreground/45 font-medium mb-5">
            Newsletter
          </p>

          <h2 className="font-serif text-4xl md:text-6xl leading-[1.05] text-foreground mb-5 text-balance font-semibold">
            პირველი გაიგე,<br />
            <span className="font-normal italic">პირველი ისარგებლე.</span>
          </h2>

          <p className="text-base text-foreground/55 mb-10 max-w-sm mx-auto leading-relaxed">
            ექსკლუზიური შეთავაზებები, ახალი კოლექციები და სიახლეები — პირდაპირ შენს ელ-ფოსტაზე.
          </p>

          {isSubscribed ? (
            <div className="inline-flex items-center gap-3 bg-primary/10 border border-primary/20 rounded-full px-8 py-4">
              <Check className="w-4 h-4 text-primary" />
              <span className="text-sm text-foreground font-medium">მადლობა! გამოწერა წარმატებულია.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="შეიყვანე ელ-ფოსტა"
                className="flex-1 bg-background/70 backdrop-blur-sm border border-border rounded-full px-6 py-3.5 text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40 transition-all"
                required
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 bg-foreground text-background px-7 py-3.5 rounded-full text-sm font-medium hover:bg-foreground/85 transition-all duration-300 whitespace-nowrap"
              >
                გამოწერა
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200" />
              </button>
            </form>
          )}

          <p className="text-xs text-foreground/35 mt-5">
            სპამი არ გვიყვარს. ნებისმიერ დროს გაუქმება შეიძლება.
          </p>
        </div>
      </div>
    </section>
  )
}
