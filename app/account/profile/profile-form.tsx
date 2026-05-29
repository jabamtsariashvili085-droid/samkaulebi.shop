"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export function ProfileForm({
  initial,
}: {
  initial: { fullName: string; phone: string; email: string }
}) {
  const router = useRouter()
  const [fullName, setFullName] = useState(initial.fullName)
  const [phone, setPhone] = useState(initial.phone)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(false)

  const save = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(false)
    const res = await fetch("/api/account/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ full_name: fullName, phone }),
    })
    if (res.ok) {
      setSaved(true)
      router.refresh()
    } else {
      setError(true)
    }
    setSaving(false)
  }

  const inputCls =
    "w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"

  return (
    <form onSubmit={save} className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">ელ-ფოსტა</label>
        <input type="email" value={initial.email} disabled className={`${inputCls} opacity-60 cursor-not-allowed`} />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">სახელი და გვარი</label>
        <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} className={inputCls} />
      </div>
      <div>
        <label className="text-sm text-muted-foreground mb-1.5 block">ტელეფონი</label>
        <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="+995 5XX XX XX XX" className={inputCls} />
      </div>

      {saved && <p className="text-sm text-green-600">შენახულია ✓</p>}
      {error && <p className="text-sm text-red-500">შენახვა ვერ მოხერხდა</p>}

      <button
        type="submit"
        disabled={saving}
        className="bg-primary text-primary-foreground px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-60"
      >
        {saving ? "ინახება..." : "შენახვა"}
      </button>
    </form>
  )
}
