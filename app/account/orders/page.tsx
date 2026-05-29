import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { AccountNav } from "@/components/account/account-nav"
import { ShoppingBag } from "lucide-react"

export const dynamic = "force-dynamic"

const statusLabels: Record<string, string> = {
  pending: "მოლოდინში",
  confirmed: "დადასტურებული",
  shipped: "გაგზავნილი",
  delivered: "მიტანილი",
  cancelled: "გაუქმებული",
}
const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped: "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default async function AccountOrdersPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/account/login")

  const { data: orders } = await supabase
    .from("orders")
    .select("*, order_items(id, name, quantity, price)")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <h1 className="font-serif text-3xl text-foreground mb-8">ჩემი ანგარიში</h1>
          <div className="flex flex-col md:flex-row gap-8">
            <AccountNav />
            <div className="flex-1">
              <h2 className="font-medium text-foreground mb-4">შეკვეთების ისტორია</h2>

              {!orders?.length ? (
                <div className="bg-card rounded-2xl border border-border/50 p-12 text-center">
                  <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                    <ShoppingBag className="w-7 h-7 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground mb-5">შეკვეთები ჯერ არ გაქვს</p>
                  <Link href="/shop" className="inline-block bg-primary text-primary-foreground px-6 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
                    დაიწყე შოპინგი
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((order: any) => (
                    <div key={order.id} className="bg-card rounded-2xl border border-border/50 p-5">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="font-medium text-foreground">#{order.id.slice(0, 8).toUpperCase()}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.created_at).toLocaleDateString("ka-GE", { day: "2-digit", month: "long", year: "numeric" })}
                          </p>
                        </div>
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] ?? "bg-muted text-muted-foreground"}`}>
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground mb-3 line-clamp-1">
                        {(order.order_items ?? []).map((i: { name: string; quantity: number }) => `${i.name} ×${i.quantity}`).join(", ")}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-border/50">
                        <span className="text-sm text-muted-foreground">{order.order_items?.length ?? 0} პროდუქტი</span>
                        <span className="font-semibold text-foreground">{Number(order.total).toFixed(0)}₾</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
