// =============================================================================
// lib/discounts.ts — server-side promo code validation (single source of truth)
// =============================================================================
// Used by BOTH the public /api/discounts/validate (checkout UI feedback) and the
// /api/orders route (authoritative re-validation at order time). Uses service_role
// — discount_codes has RLS with no public policy, so codes are never client-readable.
// =============================================================================

import { createAdminClient } from "@/lib/supabase/admin"

export interface DiscountResult {
  valid: boolean
  message: string
  code?: string
  type?: "percent" | "fixed"
  discount?: number // computed discount amount (GEL) for the given subtotal
}

export async function validateDiscount(rawCode: string, subtotal: number): Promise<DiscountResult> {
  const code = (rawCode ?? "").trim().toUpperCase()
  if (!code) return { valid: false, message: "შეიყვანე კოდი" }

  const admin = createAdminClient()
  const { data: dc } = await admin.from("discount_codes").select("*").eq("code", code).maybeSingle()

  if (!dc || !dc.active) return { valid: false, message: "კოდი არ არსებობს ან გათიშულია" }
  if (dc.expires_at && new Date(dc.expires_at) < new Date()) return { valid: false, message: "კოდს ვადა გაუვიდა" }
  if (dc.max_uses != null && dc.used_count >= dc.max_uses) return { valid: false, message: "კოდის ლიმიტი ამოიწურა" }
  if (subtotal < Number(dc.min_order)) {
    return { valid: false, message: `კოდი მოქმედებს ${Number(dc.min_order)}₾-დან` }
  }

  const value = Number(dc.value)
  let discount = dc.type === "percent" ? (subtotal * value) / 100 : value
  discount = Math.min(discount, subtotal) // never exceed the subtotal
  discount = Math.round(discount * 100) / 100

  return { valid: true, message: "კოდი გააქტიურდა ✓", code, type: dc.type, discount }
}

/** Increments usage after an order that actually used the code is created. */
export async function incrementDiscountUsage(code: string) {
  const admin = createAdminClient()
  const { data: dc } = await admin
    .from("discount_codes")
    .select("id, used_count")
    .eq("code", code.toUpperCase())
    .maybeSingle()
  if (!dc) return
  await admin.from("discount_codes").update({ used_count: (dc.used_count ?? 0) + 1 }).eq("id", dc.id)
}
