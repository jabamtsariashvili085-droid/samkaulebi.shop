"use client"

import { useState, useEffect } from "react"
import Link from "next/link"

const CONSENT_KEY = "samkaulebi_cookie_consent"

export function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    try {
      if (!localStorage.getItem(CONSENT_KEY)) setShow(true)
    } catch {
      /* storage unavailable (private mode) — don't block the UI */
    }
  }, [])

  const decide = (value: "accepted" | "declined") => {
    try {
      localStorage.setItem(CONSENT_KEY, value)
    } catch {}
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed inset-x-0 bottom-0 z-[100] p-4">
      <div className="max-w-3xl mx-auto bg-card border border-border rounded-2xl boty-shadow p-5 flex flex-col sm:flex-row sm:items-center gap-4">
        <p className="text-sm text-muted-foreground flex-1">
          ვიყენებთ აუცილებელ cookie-ებს საიტის გამართული მუშაობისთვის (კალათა, სესია) და ანონიმურ
          ანალიტიკას. დეტალები —{" "}
          <Link href="/privacy" className="text-primary underline underline-offset-2">
            კონფიდენციალურობის პოლიტიკა
          </Link>
          .
        </p>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={() => decide("declined")}
            className="px-4 py-2 rounded-full text-sm border border-border text-foreground hover:bg-muted boty-transition"
          >
            უარი
          </button>
          <button
            type="button"
            onClick={() => decide("accepted")}
            className="px-4 py-2 rounded-full text-sm bg-primary text-primary-foreground hover:bg-primary/90 boty-transition"
          >
            თანხმობა
          </button>
        </div>
      </div>
    </div>
  )
}
