"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"

export function ReferralLink({ url }: { url: string }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked — user can still select the text */
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-stretch gap-2">
      <input
        readOnly
        value={url}
        onFocus={e => e.currentTarget.select()}
        className="flex-1 px-4 py-2.5 rounded-xl bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
      />
      <button
        type="button"
        onClick={copy}
        className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shrink-0"
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
        {copied ? "დაკოპირდა" : "კოპირება"}
      </button>
    </div>
  )
}
