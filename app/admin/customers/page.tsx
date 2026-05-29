import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export default async function AdminCustomersPage() {
  const admin = createAdminClient()

  const [{ data: usersRes }, { data: profiles }, { data: referrals }, { data: orders }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("profiles").select("id, full_name, phone, referral_code, referred_by, points, created_at"),
    admin.from("referrals").select("referrer_id, status"),
    admin.from("orders").select("user_id"),
  ])

  const emailById = new Map((usersRes?.users ?? []).map(u => [u.id, u.email ?? ""]))
  const nameById = new Map((profiles ?? []).map(p => [p.id, (p.full_name?.trim() || emailById.get(p.id) || "—")]))

  const invitedCount = (id: string) => (referrals ?? []).filter(r => r.referrer_id === id).length
  const qualifiedCount = (id: string) => (referrals ?? []).filter(r => r.referrer_id === id && r.status === "qualified").length
  const orderCount = (id: string) => (orders ?? []).filter(o => o.user_id === id).length

  const customers = (profiles ?? []).sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const totalQualified = (referrals ?? []).filter(r => r.status === "qualified").length

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground">მომხმარებლები</h1>
        <p className="text-muted-foreground mt-1">
          {customers.length} რეგისტრირებული · {totalQualified} წარმატებული რეფერალი
        </p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {customers.length === 0 ? (
          <div className="p-12 text-center text-muted-foreground">მომხმარებლები ჯერ არ არის</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">მომხმარებელი</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">ტელეფონი</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">ქულა</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">მოწვეული</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">შეკვეთები</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">მოიწვია</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">რეგისტრაცია</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{c.full_name?.trim() || "—"}</p>
                    <p className="text-xs text-muted-foreground">{emailById.get(c.id)}</p>
                  </td>
                  <td className="px-5 py-4 text-muted-foreground">{c.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <span className="font-semibold text-amber-600">{c.points ?? 0}</span>
                  </td>
                  <td className="px-5 py-4 text-foreground">
                    {invitedCount(c.id)}
                    {qualifiedCount(c.id) > 0 && (
                      <span className="text-xs text-green-600 ml-1">({qualifiedCount(c.id)} ✓)</span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-foreground">{orderCount(c.id)}</td>
                  <td className="px-5 py-4 text-muted-foreground">
                    {c.referred_by ? (nameById.get(c.referred_by) ?? "—") : "—"}
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {new Date(c.created_at).toLocaleDateString("ka-GE")}
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
