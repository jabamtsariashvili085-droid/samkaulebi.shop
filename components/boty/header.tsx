"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Menu, X, ShoppingBag, Search, User, ChevronDown, Gem, Sparkles, Droplets } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"
import { categories } from "@/lib/data/categories"
import { products } from "@/lib/data/products"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  gem: Gem,
  sparkles: Sparkles,
  droplets: Droplets,
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const { setIsOpen, itemCount } = useCart()
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  const searchResults = searchQuery.trim().length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchRef.current?.focus(), 50)
    } else {
      setSearchQuery("")
    }
  }, [searchOpen])

  // Close search on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSearchOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchOpen(false)
    }
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 pt-4">
        <nav
          className="max-w-7xl mx-auto px-6 lg:px-8 backdrop-blur-md rounded-lg py-0 my-0 animate-scale-fade-in bg-[rgba(255,255,255,0.4)] border border-[rgba(255,255,255,0.32)]"
          style={{ boxShadow: 'rgba(0, 0, 0, 0.1) 0px 10px 50px' }}
        >
          <div className="flex items-center justify-between h-[68px]">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-foreground/80 hover:text-foreground boty-transition"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="მენიუ"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Navigation - Left */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.icon]
                return (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setActiveCategory(category.slug)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <Link
                      href={`/shop/${category.slug}`}
                      className="flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-foreground/70 hover:text-foreground boty-transition rounded-full hover:bg-foreground/5"
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {category.name}
                      <ChevronDown className={`w-3 h-3 boty-transition ${activeCategory === category.slug ? 'rotate-180' : ''}`} />
                    </Link>

                    {/* Mega Menu Dropdown */}
                    {activeCategory === category.slug && (
                      <div
                        className="absolute top-full left-0 pt-2 z-50"
                        onMouseEnter={() => setActiveCategory(category.slug)}
                        onMouseLeave={() => setActiveCategory(null)}
                      >
                        <div className="bg-background/95 backdrop-blur-lg rounded-2xl shadow-xl border border-border/50 p-4 min-w-[220px]">
                          <div className="space-y-1">
                            {category.subcategories.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/shop/${category.slug}/${sub.slug}`}
                                className="block px-4 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-lg boty-transition"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-border/50">
                            <Link
                              href={`/shop/${category.slug}`}
                              className="block px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 boty-transition"
                            >
                              ყველა {category.name}
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            {/* Logo */}
            <Link href="/" className="absolute left-1/2 -translate-x-1/2">
              <h1 className="font-serif text-2xl lg:text-3xl tracking-wider text-foreground">
                samkaulebi<span className="text-primary">.shop</span>
              </h1>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2 text-foreground/70 hover:text-foreground boty-transition rounded-full hover:bg-foreground/5"
                aria-label="ძიება"
              >
                <Search className="w-5 h-5" />
              </button>
              <Link
                href="/account"
                className="hidden sm:block p-2 text-foreground/70 hover:text-foreground boty-transition rounded-full hover:bg-foreground/5"
                aria-label="ანგარიში"
              >
                <User className="w-5 h-5" />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="relative p-2 text-foreground/70 hover:text-foreground boty-transition rounded-full hover:bg-foreground/5"
                aria-label="კალათა"
              >
                <ShoppingBag className="w-5 h-5" />
                {itemCount > 0 && (
                  <span className="absolute -top-0 -right-0 w-4 h-4 bg-primary text-primary-foreground text-[10px] flex items-center justify-center rounded-full font-bold">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <CartDrawer />

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden boty-transition ${
              isMenuOpen ? "max-h-[500px] pb-6" : "max-h-0"
            }`}
          >
            <div className="flex flex-col gap-2 pt-4 border-t border-border/50">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.icon]
                return (
                  <div key={category.id}>
                    <Link
                      href={`/shop/${category.slug}`}
                      className="flex items-center gap-3 px-2 py-2 text-base font-medium text-foreground"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {IconComponent && <IconComponent className="w-5 h-5 text-primary" />}
                      {category.name}
                    </Link>
                    <div className="ml-10 space-y-1">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/shop/${category.slug}/${sub.slug}`}
                          className="block py-1.5 text-sm text-foreground/60 hover:text-foreground"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}
              <div className="pt-4 mt-2 border-t border-border/50">
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-2 py-2 text-sm text-foreground/70 hover:text-foreground"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  ჩემი ანგარიში
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* ── Search Overlay ── */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm search-overlay-enter"
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <div className="max-w-2xl mx-auto px-4 pt-32">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative bg-background rounded-2xl boty-shadow overflow-hidden border border-border/50">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="მოძებნე სამკაულები, სუნამოები..."
                  className="w-full pl-14 pr-14 py-5 bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-lg"
                />
                <button
                  type="button"
                  onClick={() => setSearchOpen(false)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground boty-transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-background rounded-2xl border border-border/50 boty-shadow overflow-hidden">
                {searchResults.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => setSearchOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/50 boty-transition ${
                      index < searchResults.length - 1 ? 'border-b border-border/30' : ''
                    }`}
                  >
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{product.description}</p>
                    </div>
                    <span className="font-medium text-foreground text-sm flex-shrink-0">{product.price}₾</span>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <div className="mt-2 bg-background rounded-2xl border border-border/50 p-6 text-center text-muted-foreground text-sm boty-shadow">
                &ldquo;{searchQuery}&rdquo; — ვერ მოიძებნა
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
