"use client"

import React, { useState } from "react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from "lucide-react"

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = (e: React.BaseSyntheticEvent) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-32 pb-20">
        <div className="text-center mb-16">
          <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">კონტაქტი</span>
          <h1 className="font-serif text-5xl md:text-6xl text-foreground mb-4">დაგვიკავშირდი</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            კითხვა? წინადადება? ვთქვათ — ვპასუხობთ 24 საათში.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {[
              { icon: Phone, label: "ტელეფონი", value: "+995 555 000 000", href: "tel:+995555000000" },
              { icon: Mail, label: "ელ-ფოსტა", value: "info@samkaulebi.shop", href: "mailto:info@samkaulebi.shop" },
              { icon: MapPin, label: "მისამართი", value: "თბილისი, საქართველო", href: "#" },
              { icon: Clock, label: "სამუშაო საათები", value: "ორშ–პარ: 10:00–19:00", href: "#" },
            ].map(({ icon: Icon, label, value, href }) => (
              <a
                key={label}
                href={href}
                className="flex items-center gap-5 p-6 bg-card rounded-2xl boty-shadow boty-transition hover:scale-[1.01] group"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 boty-transition">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5 uppercase tracking-wider">{label}</p>
                  <p className="font-medium text-foreground">{value}</p>
                </div>
              </a>
            ))}
          </div>

          {/* Contact Form */}
          {sent ? (
            <div className="bg-card rounded-3xl p-8 boty-shadow flex flex-col items-center justify-center text-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h2 className="font-serif text-2xl text-foreground">შეტყობინება გაიგზავნა!</h2>
              <p className="text-muted-foreground">მადლობა! ჩვენ 24 საათში დაგიკავშირდებით.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }) }}
                className="mt-2 text-primary hover:underline text-sm"
              >
                ახალი შეტყობინება
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-card rounded-3xl p-8 boty-shadow space-y-5">
              <h2 className="font-serif text-2xl text-foreground mb-2">შეტყობინების გაგზავნა</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">სახელი *</label>
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    type="text"
                    placeholder="შენი სახელი"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm boty-transition"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground mb-1.5 block">ელ-ფოსტა *</label>
                  <input
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    type="email"
                    placeholder="email@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm boty-transition"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">თემა</label>
                <input
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  type="text"
                  placeholder="შეტყობინების თემა"
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm boty-transition"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-1.5 block">შეტყობინება *</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  placeholder="დაწერე შეტყობინება..."
                  className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm boty-transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-3 bg-primary text-primary-foreground px-8 py-4 rounded-full text-sm tracking-wide boty-transition hover:bg-primary/90 boty-shadow"
              >
                <Send className="w-4 h-4" />
                გაგზავნა
              </button>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </main>
  )
}
