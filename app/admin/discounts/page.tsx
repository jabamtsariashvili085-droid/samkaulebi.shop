import { createAdminClient } from "@/lib/supabase/admin"
import { DiscountsClient } from "./discounts-client"

export const dynamic = "force-dynamic"

export default async function AdminDiscountsPage() {
  const admin = createAdminClient()
  const { data } = await admin.from("discount_codes").select("*").order("created_at", { ascending: false })
  return <DiscountsClient initialCodes={data ?? []} />
}
