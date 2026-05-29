import { createAdminClient } from "@/lib/supabase/admin"

export const dynamic = "force-dynamic"

export default async function AdminCustomersPage() {
  const admin = createAdminClient()

  const [{ data: usersRes }, { data: profiles }, { data: referrals }, { data: orders }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 200 }),
    admin.from("profiles").select("id, full_name, phone, referral_code, referred_by, points, created_at"),
    admin.from("referrals").select("referrer_id, referred_id, status"),
    admin.from("orders").select("user_id"),
  ])

  const emailById = new Map((usersRes?.users ?? []).map(u => [u.id, u.email ?? ""]))
  const nameById = new Map((profiles ?? []).map(p => [p.id, (p.full_name?.trim() || emailById.get(p.id) || "—")]))

  // referrer_id -> list of who they invited (with qualified flag)
  const invitedByReferrer = new Map<string, { name: string; qualified: boolean }[]>()
  for (const r of referrals ?? []) {
    const arr = invitedByReferrer.get(r.referrer_id) ?? []
    arr.push({ name: nameById.get(r.referred_id) ?? "—", qualified: r.status === "qualified" })
    invitedByReferrer.set(r.referrer_id, arr)
  }

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
              {customers.map(c => {
                const invited = invitedByReferrer.get(c.id) ?? []
                return (
                  <tr key={c.id} className="hover:bg-muted/20 transition-colors align-top">
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{c.full_name?.trim() || "—"}</p>
                      <p className="text-xs text-muted-foreground">{emailById.get(c.id)}</p>
                    </td>
                    <td className="px-5 py-4 text-muted-foreground">{c.phone || "—"}</td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-amber-600">{c.points ?? 0}</span>
                    </td>
                    <td className="px-5 py-4">
                      {invited.length === 0 ? (
                        <span className="text-muted-foreground">—</span>
                      ) : (
                        <div>
                          <span className="text-foreground font-medium">{invited.length}</span>
                          <div className="text-xs text-muted-foreground mt-1 space-y-0.5 max-w-[200px]">
                            {invited.slice(0, 6).map((p, i) => (
                              <div key={i} className="truncate">
                                {p.name}
                                {p.qualified && <span className="text-green-600"> ✓</span>}
                              </div>
                            ))}
                            {invited.length > 6 && <div>+{invited.length - 6} სხვა</div>}
                          </div>
                        </div>
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
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
