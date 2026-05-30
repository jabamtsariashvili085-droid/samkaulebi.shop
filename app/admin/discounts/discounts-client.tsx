"use client"

import { useState } from "react"
import { Plus, Trash2, X, Wand2 } from "lucide-react"

type DiscountCode = {
  id: string
  code: string
  type: "percent" | "fixed"
  value: number
  min_order: number
  max_uses: number | null
  used_count: number
  expires_at: string | null
  active: boolean
}

const inputCls =
  "px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"

export function DiscountsClient({ initialCodes }: { initialCodes: DiscountCode[] }) {
  const [codes, setCodes] = useState(initialCodes)
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [form, setForm] = useState({ code: "", type: "percent", value: "", min_order: "", max_uses: "", expires_at: "" })

  const gen = () => setForm(p => ({ ...p, code: "SALE" + Math.random().toString(36).slice(2, 7).toUpperCase() }))

  const add = async () => {
    setLoading(true)
    setError("")
    const res = await fetch("/api/admin/discounts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })
    const data = await res.json()
    if (res.ok) {
      setCodes(prev => [data, ...prev])
      setForm({ code: "", type: "percent", value: "", min_order: "", max_uses: "", expires_at: "" })
      setShowForm(false)
    } else {
      setError(data.error || "შეცდომა")
    }
    setLoading(false)
  }

  const toggle = async (c: DiscountCode) => {
    const res = await fetch(`/api/admin/discounts/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    })
    if (res.ok) setCodes(prev => prev.map(x => (x.id === c.id ? { ...x, active: !c.active } : x)))
  }

  const del = async (c: DiscountCode) => {
    if (!confirm(`კოდის "${c.code}" წაშლა?`)) return
    const res = await fetch(`/api/admin/discounts/${c.id}`, { method: "DELETE" })
    if (res.ok) setCodes(prev => prev.filter(x => x.id !== c.id))
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">ფასდაკლების კოდები</h1>
          <p className="text-muted-foreground mt-1">{codes.length} კოდი</p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          ახალი კოდი
        </button>
      </div>

      {showForm && (
        <div className="bg-card rounded-2xl border border-primary/30 p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-medium text-foreground">ახალი კოდი</h2>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-muted-foreground" /></button>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            <div className="flex gap-2">
              <input
                placeholder="კოდი *"
                value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                className={`${inputCls} flex-1 uppercase`}
              />
              <button onClick={gen} type="button" title="გენერაცია" className="px-3 rounded-lg border border-border hover:bg-muted">
                <Wand2 className="w-4 h-4 text-muted-foreground" />
              </button>
            </div>
            <select value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))} className={inputCls}>
              <option value="percent">პროცენტი (%)</option>
              <option value="fixed">ფიქსირებული (₾)</option>
            </select>
            <input
              type="number"
              placeholder={form.type === "percent" ? "ფასდაკლება % *" : "ფასდაკლება ₾ *"}
              value={form.value}
              onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
              className={inputCls}
            />
            <input type="number" placeholder="მინ. შეკვეთა ₾" value={form.min_order} onChange={e => setForm(p => ({ ...p, min_order: e.target.value }))} className={inputCls} />
            <input type="number" placeholder="მაქს. გამოყენება" value={form.max_uses} onChange={e => setForm(p => ({ ...p, max_uses: e.target.value }))} className={inputCls} />
            <input type="date" placeholder="ვადა" value={form.expires_at} onChange={e => setForm(p => ({ ...p, expires_at: e.target.value }))} className={inputCls} />
          </div>
          {error && <p className="text-sm text-red-500 mt-3">{error}</p>}
          <button
            onClick={add}
            disabled={loading || !form.code || !form.value}
            className="mt-4 bg-primary text-primary-foreground px-5 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {loading ? "ემატება..." : "დამატება"}
          </button>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {codes.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">კოდები ჯერ არ არის</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">კოდი</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">ფასდაკლება</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">მინ. შეკვეთა</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">გამოყენება</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">ვადა</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">აქტიური</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {codes.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4 font-mono font-medium text-foreground">{c.code}</td>
                  <td className="px-5 py-4 text-foreground">
                    {c.type === "percent" ? `${c.value}%` : `${c.value}₾`}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c.min_order > 0 ? `${c.min_order}₾` : "—"}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {c.used_count}{c.max_uses != null ? ` / ${c.max_uses}` : ""}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {c.expires_at ? new Date(c.expires_at).toLocaleDateString("ka-GE") : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => toggle(c)}
                      className={`relative w-10 h-5 rounded-full transition-colors ${c.active ? "bg-primary" : "bg-muted"}`}
                      aria-label="toggle"
                    >
                      <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${c.active ? "left-[22px]" : "left-0.5"}`} />
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => del(c)} className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
