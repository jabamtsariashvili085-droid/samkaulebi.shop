"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, ShoppingBag, Truck, Shield, CreditCard } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart()
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const shipping = 0
  const total = subtotal + shipping

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    notes: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          items: items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, image: i.image })),
          subtotal,
          total,
        }),
      })

      if (!res.ok) throw new Error('შეკვეთა ვერ გაიგზავნა')

      clearCart()
      setSubmitted(true)
    } catch {
      setError('შეცდომა. გთხოვ სცადო თავიდან.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-primary" />
            </div>
            <h1 className="font-serif text-3xl text-foreground mb-3">შეკვეთა მიღებულია!</h1>
            <p className="text-muted-foreground mb-8">
              მადლობა შეკვეთისთვის. ჩვენ დაგიკავშირდებით {form.phone || form.email} -ზე შეკვეთის დასადასტურებლად.
            </p>
            <Link
              href="/"
              className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors"
            >
              მთავარ გვერდზე დაბრუნება
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <ShoppingBag className="w-16 h-16 text-muted-foreground/50 mx-auto mb-4" />
            <h1 className="font-serif text-2xl text-foreground mb-2">კალათა ცარიელია</h1>
            <p className="text-muted-foreground mb-6">შეკვეთის გასაფორმებლად ჯერ პროდუქტი დაამატე კალათაში</p>
            <Link href="/shop" className="inline-block bg-primary text-primary-foreground px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors">
              მაღაზიაში გადასვლა
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">მთავარი</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">შეკვეთის გაფორმება</span>
          </nav>

          <h1 className="font-serif text-3xl md:text-4xl text-foreground mb-10">შეკვეთის გაფორმება</h1>

          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-[1fr_400px] gap-10">
              {/* Left — Customer Info */}
              <div className="space-y-8">
                {/* Personal Info */}
                <div className="bg-card rounded-2xl p-6 border border-border/50">
                  <h2 className="font-semibold text-lg text-foreground mb-5">პირადი ინფორმაცია</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">სახელი *</label>
                      <input
                        name="firstName"
                        value={form.firstName}
                        onChange={handleChange}
                        required
                        placeholder="სახელი"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">გვარი *</label>
                      <input
                        name="lastName"
                        value={form.lastName}
                        onChange={handleChange}
                        required
                        placeholder="გვარი"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">ტელეფონი *</label>
                      <input
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        type="tel"
                        placeholder="+995 5XX XXX XXX"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">ელ-ფოსტა</label>
                      <input
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        type="email"
                        placeholder="email@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Delivery Info */}
                <div className="bg-card rounded-2xl p-6 border border-border/50">
                  <h2 className="font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                    <Truck className="w-5 h-5 text-primary" />
                    მიტანის ინფორმაცია
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">ქალაქი *</label>
                      <input
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        required
                        placeholder="თბილისი"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">მისამართი *</label>
                      <input
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                        placeholder="ქუჩა, კორპუსი, ბინა"
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-muted-foreground mb-1.5 block">შენიშვნა კურიერისთვის</label>
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="დამატებითი ინფორმაცია მიტანაზე..."
                        className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm transition-all resize-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Payment */}
                <div className="bg-card rounded-2xl p-6 border border-border/50">
                  <h2 className="font-semibold text-lg text-foreground mb-5 flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-primary" />
                    გადახდის მეთოდი
                  </h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-4 rounded-xl border-2 border-primary bg-primary/5 cursor-pointer">
                      <div className="w-4 h-4 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-primary" />
                      </div>
                      <span className="font-medium text-sm">ნაღდი ფული კურიერთან</span>
                    </label>
                    <div className="flex items-center gap-3 p-4 rounded-xl border border-border/50 opacity-50">
                      <div className="w-4 h-4 rounded-full border-2 border-border" />
                      <span className="text-sm text-muted-foreground">ბარათით გადახდა (მალე)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right — Order Summary */}
              <div className="space-y-6">
                <div className="bg-card rounded-2xl p-6 border border-border/50 sticky top-24">
                  <h2 className="font-semibold text-lg text-foreground mb-5">შეკვეთის შეჯამება</h2>

                  {/* Items */}
                  <div className="space-y-4 mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex gap-3 items-center">
                        <div className="relative w-16 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary text-primary-foreground rounded-full text-xs flex items-center justify-center font-medium">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground line-clamp-1">{item.name}</p>
                        </div>
                        <p className="text-sm font-medium text-foreground flex-shrink-0">{item.price * item.quantity}₾</p>
                      </div>
                    ))}
                  </div>

                  {/* Totals */}
                  <div className="space-y-2 text-sm border-t border-border/50 pt-4 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>ჯამი</span>
                      <span>{subtotal}₾</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>მიტანა</span>
                      <span className="text-primary font-medium">უფასო</span>
                    </div>
                    <div className="flex justify-between text-base font-semibold text-foreground pt-2 border-t border-border/50">
                      <span>სულ</span>
                      <span>{total}₾</span>
                    </div>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 text-center">{error}</p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-primary text-primary-foreground py-4 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm tracking-wide disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? 'გაიგზავნება...' : 'შეკვეთის დადასტურება'}
                  </button>

                  {/* Trust */}
                  <div className="flex items-center justify-center gap-2 mt-4 text-xs text-muted-foreground">
                    <Shield className="w-3.5 h-3.5" />
                    <span>14-დღიანი დაბრუნების გარანტია</span>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  )
}
