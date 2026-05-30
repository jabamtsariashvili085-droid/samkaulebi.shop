"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { LayoutDashboard, Package, ShoppingBag, Users, Tag, LogOut, FolderOpen, Zap } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

const navItems = [
  { href: "/admin",           label: "Dashboard",   icon: LayoutDashboard },
  { href: "/admin/products",  label: "პროდუქტები",  icon: Package },
  { href: "/admin/orders",    label: "შეკვეთები",   icon: ShoppingBag },
  { href: "/admin/customers", label: "მომხმარებლები", icon: Users },
  { href: "/admin/categories", label: "კატეგორიები",  icon: FolderOpen },
  { href: "/admin/discounts", label: "ფასდაკლებები", icon: Tag },
  { href: "/admin/optimizer",  label: "ოპტიმიზატორი", icon: Zap },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  if (pathname === "/admin/login") return <>{children}</>

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-card border-r border-border/50 flex flex-col">
        <div className="p-5 border-b border-border/50">
          <p className="font-serif text-lg text-foreground">samkaulebi</p>
          <p className="text-xs text-muted-foreground">Admin Panel</p>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = href === "/admin" ? pathname === href : pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                  active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border/50">
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            გასვლა
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
