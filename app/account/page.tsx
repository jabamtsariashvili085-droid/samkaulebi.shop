import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { AccountNav } from "@/components/account/account-nav"
import { ShoppingBag, Award, Gift } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function AccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/account/login")

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, points, referral_code")
    .eq("id", user.id)
    .maybeSingle()

  const { count } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)

  const orderCount = count ?? 0
  const name = profile?.full_name?.trim() || user.email

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-serif text-3xl text-foreground mb-8">ჩემი ანგარიში</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <AccountNav />
            <div className="flex-1">
              <p className="text-lg text-foreground mb-6">გამარჯობა, <span className="font-medium">{name}</span> 👋</p>

              <div className="grid sm:grid-cols-3 gap-4">
                <Link href="/account/orders" className="bg-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <ShoppingBag className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{orderCount}</p>
                  <p className="text-sm text-muted-foreground">შეკვეთა</p>
                </Link>

                <div className="bg-card rounded-2xl p-5 border border-border/50">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mb-3">
                    <Award className="w-5 h-5 text-amber-600" />
                  </div>
                  <p className="text-2xl font-semibold text-foreground">{profile?.points ?? 0}</p>
                  <p className="text-sm text-muted-foreground">ქულა</p>
                </div>

                <Link href="/account/referrals" className="bg-card rounded-2xl p-5 border border-border/50 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                    <Gift className="w-5 h-5 text-primary" />
                  </div>
                  <p className="text-sm font-medium text-foreground">რეფერალი</p>
                  <p className="text-sm text-muted-foreground">მოიწვიე მეგობარი → ქულები</p>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
