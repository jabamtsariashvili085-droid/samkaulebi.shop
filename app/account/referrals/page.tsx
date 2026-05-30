import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { AccountNav } from "@/components/account/account-nav"
import { ReferralLink } from "@/components/account/referral-link"
import { REFERRAL_REWARD_RATE } from "@/lib/site"
import { Gift, Users, CheckCircle, Award } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function ReferralsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/account/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("referral_code, points")
    .eq("id", user.id)
    .maybeSingle()

  const { data: refs } = await supabase
    .from("referrals")
    .select("status")
    .eq("referrer_id", user.id)

  const invited = refs?.length ?? 0
  const qualified = refs?.filter(r => r.status === "qualified").length ?? 0

  const h = await headers()
  const host = h.get("host") ?? "samkaulebi.shop"
  const proto = host.includes("localhost") ? "http" : "https"
  const link = `${proto}://${host}/account/register?ref=${profile?.referral_code ?? ""}`

  const stats = [
    { icon: Users, label: "მოწვეული", value: invited },
    { icon: CheckCircle, label: "შესყიდვით", value: qualified },
    { icon: Award, label: "ქულა", value: profile?.points ?? 0 },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-serif text-3xl text-foreground mb-8">ჩემი ანგარიში</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <AccountNav />
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Gift className="w-5 h-5 text-primary" />
                <h2 className="font-medium text-foreground">მოიწვიე მეგობარი</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                გაუზიარე შენი ლინკი. როცა მოწვეული მეგობარი პირველ შეკვეთას გააფორმებს და ის დადასტურდება,
                შენ მიიღებ მისი შენაძენის <span className="text-foreground font-medium">{REFERRAL_REWARD_RATE * 100}%-ს</span> ქულებში (1 ქულა ≈ 1₾).
              </p>

              <div className="bg-card rounded-2xl p-5 border border-border/50 mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">შენი რეფერალური ლინკი</label>
                <ReferralLink url={link} />
              </div>

              <div className="grid grid-cols-3 gap-4">
                {stats.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-card rounded-2xl p-5 border border-border/50 text-center">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <p className="text-2xl font-semibold text-foreground">{value}</p>
                    <p className="text-sm text-muted-foreground">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
