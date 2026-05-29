import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { createAdminClient } from "@/lib/supabase/admin"
import OrderStatusSelect from "../order-status-select"
import { ChevronLeft, MapPin, Phone, Mail, Package, StickyNote, Gift } from "lucide-react"

export const dynamic = "force-dynamic"

const statusColors: Record<string, string> = {
  pending:   "bg-yellow-100 text-yellow-700",
  confirmed: "bg-blue-100 text-blue-700",
  shipped:   "bg-purple-100 text-purple-700",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700",
}

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const admin = createAdminClient()

  const { data: order } = await admin
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single()

  if (!order) notFound()

  const createdAt = new Date(order.created_at).toLocaleString("ka-GE", {
    day: "2-digit", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })

  const items: {
    id: string; name: string; price: number; quantity: number; image?: string
  }[] = order.order_items ?? []

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)

  return (
    <div className="p-8 max-w-4xl">
      {/* Back */}
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        ყველა შეკვეთა
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-serif text-2xl text-foreground mb-1">
            შეკვეთა #{id.slice(0, 8).toUpperCase()}
          </h1>
          <p className="text-sm text-muted-foreground">{createdAt}</p>
        </div>
        <OrderStatusSelect orderId={order.id} status={order.status} colors={statusColors} />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Customer */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <h2 className="font-medium text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <Package className="w-3.5 h-3.5 text-primary" />
            </span>
            მომხმარებელი
          </h2>

          <div className="space-y-2.5 text-sm">
            <p className="font-medium text-foreground text-base">
              {order.first_name} {order.last_name}
            </p>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="w-3.5 h-3.5 shrink-0" />
              <a href={`tel:${order.phone}`} className="hover:text-foreground transition-colors">
                {order.phone}
              </a>
            </div>
            {order.email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="w-3.5 h-3.5 shrink-0" />
                <a href={`mailto:${order.email}`} className="hover:text-foreground transition-colors">
                  {order.email}
                </a>
              </div>
            )}
            <div className="flex items-start gap-2 text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 shrink-0 mt-0.5" />
              <span>{order.address}, {order.city}</span>
            </div>
          </div>
        </div>

        {/* Order meta */}
        <div className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
          <h2 className="font-medium text-foreground flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
              <StickyNote className="w-3.5 h-3.5 text-primary" />
            </span>
            დეტალები
          </h2>

          <div className="space-y-2.5 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">გადახდის ტიპი</span>
              <span className="text-foreground font-medium">ნაღდი მიწოდებისას</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">სულ პროდუქტი</span>
              <span className="text-foreground font-medium">{items.length}</span>
            </div>
            {order.gift_wrap && (
              <div className="flex items-center gap-2 text-primary">
                <Gift className="w-3.5 h-3.5" />
                <span>საჩუქრად შეფუთვა</span>
              </div>
            )}
            {order.notes && (
              <div className="pt-2 border-t border-border/50">
                <p className="text-muted-foreground text-xs mb-1">შენიშვნა</p>
                <p className="text-foreground">{order.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 bg-card rounded-2xl border border-border/50 overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50">
          <h2 className="font-medium text-foreground">შეკვეთილი პროდუქტები</h2>
        </div>

        <div className="divide-y divide-border/50">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 px-6 py-4">
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-muted shrink-0">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="w-5 h-5 text-muted-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{item.name}</p>
                <p className="text-sm text-muted-foreground">{item.quantity} ცალი × {Number(item.price).toFixed(0)}₾</p>
              </div>
              <p className="font-semibold text-foreground shrink-0">
                {(item.quantity * Number(item.price)).toFixed(0)}₾
              </p>
            </div>
          ))}
        </div>

        {/* Totals */}
        <div className="px-6 py-4 border-t border-border/50 space-y-2">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>ქვეჯამი</span>
            <span>{subtotal.toFixed(0)}₾</span>
          </div>
          {Number(order.subtotal) !== Number(order.total) && (
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>მიწოდება</span>
              <span>{(Number(order.total) - subtotal).toFixed(0)}₾</span>
            </div>
          )}
          <div className="flex justify-between font-semibold text-foreground text-base pt-1 border-t border-border/50">
            <span>სულ</span>
            <span>{Number(order.total).toFixed(0)}₾</span>
          </div>
        </div>
      </div>
    </div>
  )
}
