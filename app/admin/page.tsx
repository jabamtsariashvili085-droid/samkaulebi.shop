import { createAdminClient } from "@/lib/supabase/admin"
import { Package, ShoppingBag, TrendingUp, Clock } from "lucide-react"

export const dynamic = 'force-dynamic'

export default async function AdminDashboard() {
  const supabase = createAdminClient()

  const [
    { count: productCount },
    { count: orderCount },
    { data: recentOrders },
    { data: revenue },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('id, first_name, last_name, total, status, created_at').order('created_at', { ascending: false }).limit(5),
    supabase.from('orders').select('total'),
  ])

  const totalRevenue = revenue?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0

  const stats = [
    { label: "პროდუქტები",  value: productCount ?? 0,            icon: Package,     color: "text-blue-500",   bg: "bg-blue-500/10" },
    { label: "შეკვეთები",   value: orderCount ?? 0,              icon: ShoppingBag, color: "text-green-500",  bg: "bg-green-500/10" },
    { label: "შემოსავალი",  value: `${totalRevenue.toFixed(0)}₾`, icon: TrendingUp,  color: "text-primary",    bg: "bg-primary/10" },
  ]

  const statusColors: Record<string, string> = {
    pending:    "bg-yellow-100 text-yellow-700",
    confirmed:  "bg-blue-100 text-blue-700",
    shipped:    "bg-purple-100 text-purple-700",
    delivered:  "bg-green-100 text-green-700",
    cancelled:  "bg-red-100 text-red-700",
  }

  const statusLabels: Record<string, string> = {
    pending:   "მოლოდინში",
    confirmed: "დადასტურებული",
    shipped:   "გაგზავნილი",
    delivered: "მიტანილი",
    cancelled: "გაუქმებული",
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-1">samkaulebi.shop მართვის პანელი</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5 mb-10">
        {stats.map(({ label, value, icon: Icon, color, bg }) => (
          <div key={label} className="bg-card rounded-2xl p-5 border border-border/50">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-muted-foreground">{label}</p>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${color}`} />
              </div>
            </div>
            <p className="text-3xl font-bold text-foreground">{value}</p>
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-card rounded-2xl border border-border/50">
        <div className="p-5 border-b border-border/50 flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-medium text-foreground">ბოლო შეკვეთები</h2>
        </div>
        {!recentOrders?.length ? (
          <div className="p-8 text-center text-muted-foreground text-sm">შეკვეთები ჯერ არ არის</div>
        ) : (
          <div className="divide-y divide-border/50">
            {recentOrders.map(order => (
              <div key={order.id} className="flex items-center justify-between px-5 py-3.5">
                <div>
                  <p className="text-sm font-medium text-foreground">{order.first_name} {order.last_name}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString('ka-GE')}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusColors[order.status] ?? 'bg-muted text-muted-foreground'}`}>
                    {statusLabels[order.status] ?? order.status}
                  </span>
                  <span className="text-sm font-semibold text-foreground">{Number(order.total).toFixed(0)}₾</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
