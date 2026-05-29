"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { User } from "lucide-react"

export default function AccountLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("არასწორი ელ-ფოსტა ან პაროლი")
      setLoading(false)
      return
    }

    router.push("/account")
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 pt-28 pb-16">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <User className="w-7 h-7 text-primary" />
            </div>
            <h1 className="font-serif text-2xl text-foreground">შესვლა</h1>
            <p className="text-sm text-muted-foreground mt-1">შედი შენს ანგარიშზე</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-card rounded-2xl p-6 border border-border/50 space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-1.5 block">ელ-ფოსტა</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoFocus
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
                className="w-full px-4 py-3 rounded-xl bg-background border border-border focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
              />
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-primary-foreground py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? "შესვლა..." : "შესვლა"}
            </button>

            <p className="text-center text-sm text-muted-foreground">
              არ გაქვს ანგარიში?{" "}
              <Link href="/account/register" className="text-primary hover:underline">რეგისტრაცია</Link>
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  )
}
