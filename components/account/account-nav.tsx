"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { LayoutDashboard, ShoppingBag, User, LogOut } from "lucide-react"

const items = [
  { href: "/account", label: "მთავარი", icon: LayoutDashboard },
  { href: "/account/orders", label: "შეკვეთები", icon: ShoppingBag },
  { href: "/account/profile", label: "პროფილი", icon: User },
]

export function AccountNav() {
  const pathname = usePathname()
  const router = useRouter()

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/account/login")
    router.refresh()
  }

  return (
    <aside className="md:w-56 shrink-0">
      <nav className="flex md:flex-col gap-1 bg-card rounded-2xl p-2 border border-border/50">
        {items.map(({ href, label, icon: Icon }) => {
          const active = href === "/account" ? pathname === href : pathname.startsWith(href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                active ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          )
        })}
        <button
          onClick={signOut}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          გასვლა
        </button>
      </nav>
    </aside>
  )
}
