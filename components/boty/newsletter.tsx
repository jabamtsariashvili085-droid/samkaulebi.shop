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

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 flex justify-center">
        <iframe
          src="https://assets.pinterest.com/ext/embed.html?id=777011742008428835"
          height="900"
          width="450"
          frameBorder="0"
          scrolling="no"
          className="rounded-2xl shadow-xl"
        />
      </div>
    </section>
  )
}
