"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter, usePathname } from "next/navigation"
import { Menu, X, ShoppingBag, Search, User, ChevronDown, Gem, Sparkles, Droplets, ArrowRight } from "lucide-react"
import { CartDrawer } from "./cart-drawer"
import { useCart } from "./cart-context"
import { categories } from "@/lib/data/categories"
import { createClient } from "@/lib/supabase/client"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  gem: Gem,
  sparkles: Sparkles,
  droplets: Droplets,
}

const categoryDescriptions: Record<string, string> = {
  jewelry: "ბეჭდები, ყელსაბამები, სამაჯურები",
  fragrances: "სუნამოები და ეთერზეთები",
  haircare: "შამპუნები, ზეთები, სერუმები",
}

type SearchProduct = {
  id: string
  name: string
  nameEn: string
  description: string
  price: number
  images: string[]
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [scrolled, setScrolled] = useState(false)
  const { setIsOpen, itemCount } = useCart()
  const searchRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const [allProducts, setAllProducts] = useState<SearchProduct[]>([])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    setIsMenuOpen(false)
    setActiveCategory(null)
  }, [pathname])

  const searchResults = searchQuery.trim().length > 1
    ? allProducts.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : []

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchRef.current?.focus(), 50)
    else setSearchQuery("")
  }, [searchOpen])

  // Lazy-load products from Supabase the first time search opens
  useEffect(() => {
    if (!searchOpen || allProducts.length > 0) return
    const supabase = createClient()
    supabase
      .from("products")
      .select("id,name,name_en,description,price,images")
      .then(({ data }) => {
        if (!data) return
        setAllProducts(
          data.map((p) => ({
            id: p.id as string,
            name: p.name as string,
            nameEn: (p.name_en as string) ?? "",
            description: (p.description as string) ?? "",
            price: Number(p.price) || 0,
            images: (p.images as string[]) ?? [],
          }))
        )
      })
  }, [searchOpen, allProducts.length])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setSearchOpen(false) }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  const handleSearchSubmit = (e: React.BaseSyntheticEvent) => {
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
          className={`max-w-7xl mx-auto px-6 lg:px-8 rounded-2xl transition-all duration-500 ${
            scrolled
              ? "bg-[rgba(247,244,239,0.95)] backdrop-blur-xl border border-[rgba(0,0,0,0.08)] shadow-[0_8px_32px_rgba(0,0,0,0.08)]"
              : "bg-[rgba(255,255,255,0.35)] backdrop-blur-md border border-[rgba(255,255,255,0.4)] shadow-[0_4px_24px_rgba(0,0,0,0.06)]"
          }`}
        >
          <div className="grid grid-cols-[1fr_auto_1fr] items-center h-[68px]">
            {/* Mobile menu button */}
            <button
              type="button"
              className="lg:hidden p-2 text-foreground/70 hover:text-foreground transition-colors justify-self-start"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="მენიუ"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            {/* Desktop Nav — Left */}
            <div className="hidden lg:flex items-center gap-1">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.icon]
                const isActive = activeCategory === category.slug
                return (
                  <div
                    key={category.id}
                    className="relative"
                    onMouseEnter={() => setActiveCategory(category.slug)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                    <button
                      className={`flex items-center gap-2 px-4 py-2 text-sm tracking-wide rounded-xl transition-all duration-200 ${
                        isActive
                          ? "text-foreground bg-foreground/6"
                          : "text-foreground/65 hover:text-foreground hover:bg-foreground/5"
                      }`}
                    >
                      {IconComponent && <IconComponent className="w-3.5 h-3.5" />}
                      {category.name}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isActive ? "rotate-180" : ""}`} />
                    </button>

                    {/* Mega Dropdown */}
                    <div
                      className={`absolute top-full left-0 pt-3 z-50 transition-all duration-200 ${
                        isActive ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1 pointer-events-none"
                      }`}
                    >
                      <div className="bg-[rgba(247,244,239,0.98)] backdrop-blur-xl rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.12)] border border-border/40 p-5 min-w-[260px]">
                        {/* Category header */}
                        <div className="mb-3 pb-3 border-b border-border/50">
                          <p className="text-xs text-muted-foreground uppercase tracking-widest font-medium">
                            {categoryDescriptions[category.slug] ?? category.name}
                          </p>
                        </div>

                        {/* Subcategory list */}
                        <div className="space-y-0.5">
                          {category.subcategories.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/category/${category.slug}/${sub.slug}`}
                              className="flex items-center justify-between px-3 py-2.5 text-sm text-foreground/70 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all duration-150 group"
                            >
                              <span>{sub.name}</span>
                              <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all duration-150" />
                            </Link>
                          ))}
                        </div>

                        {/* Footer link */}
                        <div className="mt-3 pt-3 border-t border-border/50">
                          <Link
                            href={`/category/${category.slug}`}
                            className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-primary hover:text-primary/80 hover:bg-primary/5 rounded-xl transition-all duration-150"
                          >
                            ყველა {category.name}
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              <Link
                href="/shop"
                className="flex items-center gap-2 px-4 py-2 text-sm tracking-wide text-foreground/65 hover:text-foreground hover:bg-foreground/5 rounded-xl transition-all duration-200"
              >
                ყველა
              </Link>
            </div>

            {/* Logo */}
            <Link href="/" className="justify-self-center">
              <span className="font-serif text-2xl lg:text-3xl tracking-wider text-foreground">
                samkaulebi<span className="text-primary">.shop</span>
              </span>
            </Link>

            {/* Right Actions */}
            <div className="flex items-center gap-1 justify-self-end">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-foreground/65 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 rounded-xl"
                aria-label="ძიება"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
              <Link
                href="/account"
                className="hidden sm:flex p-2.5 text-foreground/65 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 rounded-xl"
                aria-label="ანგარიში"
              >
                <User className="w-[18px] h-[18px]" />
              </Link>
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="relative p-2.5 text-foreground/65 hover:text-foreground hover:bg-foreground/5 transition-all duration-200 rounded-xl"
                aria-label="კალათა"
              >
                <ShoppingBag className="w-[18px] h-[18px]" />
                {itemCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-primary-foreground text-[9px] flex items-center justify-center rounded-full font-bold leading-none">
                    {itemCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          <CartDrawer />

          {/* Mobile Navigation */}
          <div
            className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-[600px] pb-5 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="flex flex-col pt-4 border-t border-border/50">
              {categories.map((category) => {
                const IconComponent = categoryIcons[category.icon]
                return (
                  <div key={category.id} className="mb-2">
                    <Link
                      href={`/category/${category.slug}`}
                      className="flex items-center gap-3 px-3 py-2.5 text-base font-medium text-foreground rounded-xl hover:bg-foreground/5 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {IconComponent && <IconComponent className="w-4 h-4 text-primary" />}
                      {category.name}
                    </Link>
                    <div className="ml-10 space-y-0.5">
                      {category.subcategories.map((sub) => (
                        <Link
                          key={sub.id}
                          href={`/category/${category.slug}/${sub.slug}`}
                          className="block py-1.5 px-3 text-sm text-foreground/55 hover:text-foreground rounded-lg hover:bg-foreground/5 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )
              })}

              <div className="pt-3 mt-1 border-t border-border/50 space-y-1">
                <Link
                  href="/shop"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/65 hover:text-foreground rounded-xl hover:bg-foreground/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ყველა პროდუქტი
                </Link>
                <Link
                  href="/account"
                  className="flex items-center gap-3 px-3 py-2.5 text-sm text-foreground/65 hover:text-foreground rounded-xl hover:bg-foreground/5 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-4 h-4" />
                  ჩემი ანგარიში
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          style={{ animation: "blur-in 0.2s ease-out" }}
          onClick={(e) => { if (e.target === e.currentTarget) setSearchOpen(false) }}
        >
          <div className="max-w-2xl mx-auto px-4 pt-28">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative bg-background rounded-2xl overflow-hidden border border-border/50 shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
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
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </form>

            {searchResults.length > 0 && (
              <div className="mt-2 bg-background rounded-2xl border border-border/50 shadow-[0_20px_60px_rgba(0,0,0,0.15)] overflow-hidden">
                {searchResults.map((product, index) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.id}`}
                    onClick={() => setSearchOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 hover:bg-muted/50 transition-colors ${
                      index < searchResults.length - 1 ? "border-b border-border/30" : ""
                    }`}
                  >
                    <div className="w-11 h-11 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                      <img src={product.images[0] || "/placeholder.svg"} alt={product.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{product.name}</p>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">{product.description}</p>
                    </div>
                    <span className="font-semibold text-foreground text-sm flex-shrink-0">{product.price}₾</span>
                  </Link>
                ))}
              </div>
            )}

            {searchQuery.trim().length > 1 && searchResults.length === 0 && (
              <div className="mt-2 bg-background rounded-2xl border border-border/50 p-6 text-center text-muted-foreground text-sm shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
                &ldquo;{searchQuery}&rdquo; — ვერ მოიძებნა
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
