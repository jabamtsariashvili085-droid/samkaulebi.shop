"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { UserPlus } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [info, setInfo] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setInfo("")

    const supabase = createClient()
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (error) {
      setError(
        error.message.includes("already registered")
          ? "ეს ელ-ფოსტა უკვე რეგისტრირებულია"
          : "რეგისტრაცია ვერ მოხერხდა. სცადე თავიდან."
      )
      setLoading(false)
      return
    }

    if (data.session) {
      router.push("/account")
      router.refresh()
    } else {
      setInfo("ანგარიში შეიქმნა! შესვლამდე დაადასტურე ელ-ფოსტა (გამოგზავნილია ბმული).")
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <UserPlus className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-serif text-2xl text-foreground">რეგისტრაცია</h1>
            <p className="text-sm text-muted-foreground mt-1">შექმენი ანგარიში samkaulebi.shop-ზე</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">სახელი და გვარი</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
                autoFocus
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">ელ-ფოსტა</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">პაროლი</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="მინ. 6 სიმბოლო"
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            {info && <p className="text-sm text-green-600">{info}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? "იქმნება..." : "რეგისტრაცია"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              უკვე გაქვს ანგარიში?{" "}
              <Link href="/account/login" className="text-primary hover:underline">შესვლა</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
