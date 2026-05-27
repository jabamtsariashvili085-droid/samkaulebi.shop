import { createAdminClient } from "@/lib/supabase/admin"
import OrderStatusSelect from "./order-status-select"

export default async function AdminOrdersPage() {
  const supabase = createAdminClient()
  const { data: orders } = await supabase
    .from('orders')
    .select('*, order_items(id, name, quantity, price)')
    .order('created_at', { ascending: false })

  const statusColors: Record<string, string> = {
    pending:   "bg-yellow-100 text-yellow-700",
    confirmed: "bg-blue-100 text-blue-700",
    shipped:   "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-serif text-3xl text-foreground">შეკვეთები</h1>
        <p className="text-muted-foreground mt-1">{orders?.length ?? 0} შეკვეთა სულ</p>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        {!orders?.length ? (
          <div className="p-12 text-center text-muted-foreground">შეკვეთები ჯერ არ არის</div>
        ) : (
          <table className="w-full text-sm">
            <thead className="border-b border-border/50 bg-muted/30">
              <tr>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">მომხმარებელი</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">საკონტაქტო</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">პროდუქტები</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">თანხა</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">სტატუსი</th>
                <th className="text-left px-5 py-3 text-muted-foreground font-medium">თარიღი</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-muted/20 transition-colors">
                  <td className="px-5 py-4">
                    <p className="font-medium text-foreground">{order.first_name} {order.last_name}</p>
                    <p className="text-xs text-muted-foreground">{order.city}, {order.address}</p>
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-foreground">{order.phone}</p>
                    {order.email && <p className="text-xs text-muted-foreground">{order.email}</p>}
                  </td>
                  <td className="px-5 py-4">
                    <p className="text-foreground">{order.order_items?.length ?? 0} პროდუქტი</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {order.order_items?.map((i: {name: string}) => i.name).join(', ')}
                    </p>
                  </td>
                  <td className="px-5 py-4 font-semibold text-foreground">{Number(order.total).toFixed(0)}₾</td>
                  <td className="px-5 py-4">
                    <OrderStatusSelect orderId={order.id} status={order.status} colors={statusColors} />
                  </td>
                  <td className="px-5 py-4 text-muted-foreground text-xs">
                    {new Date(order.created_at).toLocaleDateString('ka-GE')}
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
