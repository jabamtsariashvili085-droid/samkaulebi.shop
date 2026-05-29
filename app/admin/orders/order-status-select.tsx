"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

const statusOptions = [
  { value: "pending",   label: "მოლოდინში" },
  { value: "confirmed", label: "დადასტურებული" },
  { value: "shipped",   label: "გაგზავნილი" },
  { value: "delivered", label: "მიტანილი" },
  { value: "cancelled", label: "გაუქმებული" },
]

export default function OrderStatusSelect({
  orderId,
  status,
  colors,
}: {
  orderId: string
  status: string
  colors: Record<string, string>
}) {
  const [current, setCurrent] = useState(status)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(false)
  const router = useRouter()

  const handleChange = async (newStatus: string) => {
    setSaving(true)
    setError(false)
    const res = await fetch(`/api/admin/orders/${orderId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    if (res.ok) {
      setCurrent(newStatus)
      router.refresh()
    } else {
      setError(true)
    }
    setSaving(false)
  }

  return (
    <div className="relative">
      <select
        value={current}
        onChange={e => handleChange(e.target.value)}
        disabled={saving}
        className={`text-xs px-2.5 py-1.5 rounded-full font-medium border-0 cursor-pointer transition-opacity ${
          saving ? 'opacity-50' : ''
        } ${colors[current] ?? 'bg-muted text-muted-foreground'}`}
      >
        {statusOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <span className="text-[10px] text-red-500 absolute -bottom-4 left-0">შეცდომა</span>}
    </div>
  )
}
