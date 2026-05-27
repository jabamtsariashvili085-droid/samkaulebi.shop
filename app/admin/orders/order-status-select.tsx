"use client"

import { useState } from "react"
import { createClient } from "@/lib/supabase/client"

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

  const handleChange = async (newStatus: string) => {
    setSaving(true)
    const supabase = createClient()
    await supabase.from('orders').update({ status: newStatus }).eq('id', orderId)
    setCurrent(newStatus)
    setSaving(false)
  }

  return (
    <select
      value={current}
      onChange={e => handleChange(e.target.value)}
      disabled={saving}
      className={`text-xs px-2.5 py-1.5 rounded-full font-medium border-0 cursor-pointer ${colors[current] ?? 'bg-muted text-muted-foreground'}`}
    >
      {statusOptions.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  )
}
