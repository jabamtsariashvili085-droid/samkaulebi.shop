"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ShoppingBag, SlidersHorizontal, X, ChevronDown, ChevronRight } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { WishlistButton } from "@/components/boty/wishlist-button"
import { StockBadge } from "@/components/boty/stock-badge"
import type { CategorySlug, SubcategorySlug, Product, Category } from "@/lib/data/types"

export function ShopClient({ products, categories }: { products: Product[]; categories: Category[] }) {
  const [selectedCategory, setSelectedCategory] = useState<CategorySlug | "all">("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<SubcategorySlug | null>(null)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000])
  const [selectedBadge, setSelectedBadge] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<string>("featured")
  const [showFilters, setShowFilters] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<string[]>(["jewelry", "fragrances", "haircare"])
  const [isVisible, setIsVisible] = useState(false)
  const gridRef = useRef<HTMLDivElement>(null)
  const { addItem } = useCart()

  // Filter products
  let filteredProducts = products.filter(p => {
    if (selectedCategory !== "all" && p.categoryId !== selectedCategory) return false
    if (selectedSubcategory && p.subcategoryId !== selectedSubcategory) return false
    if (p.price < priceRange[0] || p.price > priceRange[1]) return false
    if (selectedBadge && p.badge !== selectedBadge) return false
    return true
  })

  // Sort products
  filteredProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return a.price - b.price
      case "price-high":
        return b.price - a.price
      case "name":
        return a.name.localeCompare(b.name)
      case "newest":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      default:
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
    }
  })

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (gridRef.current) {
      observer.observe(gridRef.current)
    }

    return () => {
      if (gridRef.current) {
        observer.unobserve(gridRef.current)
      }
    }
  }, [])

  useEffect(() => {
    setIsVisible(false)
    const timer = setTimeout(() => setIsVisible(true), 50)
    return () => clearTimeout(timer)
  }, [selectedCategory, selectedSubcategory, selectedBadge, sortBy])

  const toggleCategory = (categorySlug: string) => {
    setExpandedCategories(prev => 
      prev.includes(categorySlug) 
        ? prev.filter(c => c !== categorySlug)
        : [...prev, categorySlug]
    )
  }

  const clearFilters = () => {
    setSelectedCategory("all")
    setSelectedSubcategory(null)
    setPriceRange([0, 2000])
    setSelectedBadge(null)
    setSortBy("featured")
  }

  const getBadgeStyle = (badge: string | null) => {
    switch (badge) {
      case 'sale': return 'bg-destructive/10 text-destructive'
      case 'new': return 'bg-primary/10 text-primary'
      case 'bestseller': return 'bg-accent text-accent-foreground'
      default: return 'bg-white text-black'
    }
  }

  const getBadgeLabel = (badge: string | null) => {
    switch (badge) {
      case 'sale': return 'ფასდაკლება'
      case 'new': return 'ახალი'
      case 'bestseller': return 'ბესტსელერი'
      default: return ''
    }
  }

  return (
    <main className="min-h-screen">
      <Header />
      
      <div className="pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="text-sm tracking-[0.3em] uppercase text-primary mb-4 block">
              ჩვენი კოლექცია
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground mb-4 text-balance">
              ყველა პროდუქტი
            </h1>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              აღმოაჩინე პრემიუმ სამკაულები, სუნამოები და თავის მოვლის საშუალებები
            </p>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden flex items-center justify-between mb-6">
            <button
              type="button"
              onClick={() => setShowFilters(true)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card boty-shadow text-sm"
            >
              <SlidersHorizontal className="w-4 h-4" />
              ფილტრები
            </button>
            <span className="text-sm text-muted-foreground">
              {filteredProducts.length} პროდუქტი
            </span>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-28 space-y-6">
                {/* Categories */}
                <div className="bg-card rounded-2xl p-5 boty-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-foreground">კატეგორიები</h3>
                    {(selectedCategory !== "all" || selectedSubcategory) && (
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory("all"); setSelectedSubcategory(null) }}
                        className="text-xs text-primary"
                      >
                        გასუფთავება
                      </button>
                    )}
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => { setSelectedCategory("all"); setSelectedSubcategory(null) }}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm boty-transition mb-2 ${
                      selectedCategory === "all" 
                        ? "bg-primary text-primary-foreground" 
                        : "hover:bg-foreground/5"
                    }`}
                  >
                    ყველა პროდუქტი
                  </button>

                  {categories.map(category => (
                    <div key={category.id} className="mb-1">
                      <button
                        type="button"
                        onClick={() => toggleCategory(category.slug)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm boty-transition ${
                          selectedCategory === category.slug && !selectedSubcategory
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-foreground/5"
                        }`}
                      >
                        <span 
                          onClick={(e) => { 
                            e.stopPropagation(); 
                            setSelectedCategory(category.slug); 
                            setSelectedSubcategory(null) 
                          }}
                        >
                          {category.name}
                        </span>
                        <ChevronDown className={`w-4 h-4 boty-transition ${expandedCategories.includes(category.slug) ? 'rotate-180' : ''}`} />
                      </button>
                      
                      {expandedCategories.includes(category.slug) && (
                        <div className="ml-3 mt-1 space-y-1">
                          {category.subcategories.map(sub => (
                            <button
                              key={sub.id}
                              type="button"
                              onClick={() => { setSelectedCategory(category.slug); setSelectedSubcategory(sub.slug) }}
                              className={`w-full text-left px-3 py-1.5 rounded-lg text-sm boty-transition ${
                                selectedSubcategory === sub.slug 
                                  ? "bg-primary/10 text-primary font-medium" 
                                  : "text-muted-foreground hover:text-foreground"
                              }`}
                            >
                              {sub.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Badge Filter */}
                <div className="bg-card rounded-2xl p-5 boty-shadow">
                  <h3 className="font-medium text-foreground mb-4">სტატუსი</h3>
                  <div className="space-y-2">
                    {[
                      { value: null, label: "ყველა" },
                      { value: "new", label: "ახალი" },
                      { value: "bestseller", label: "ბესტსელერი" },
                      { value: "sale", label: "ფასდაკლება" },
                    ].map(badge => (
                      <button
                        key={badge.value || "all"}
                        type="button"
                        onClick={() => setSelectedBadge(badge.value)}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm boty-transition ${
                          selectedBadge === badge.value 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-foreground/5"
                        }`}
                      >
                        {badge.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sort */}
                <div className="bg-card rounded-2xl p-5 boty-shadow">
                  <h3 className="font-medium text-foreground mb-4">დალაგება</h3>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-background border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="featured">პოპულარული</option>
                    <option value="newest">უახლესი</option>
                    <option value="price-low">ფასი: დაბალიდან</option>
                    <option value="price-high">ფასი: მაღლიდან</option>
                    <option value="name">სახელით</option>
                  </select>
                </div>
              </div>
            </aside>

            {/* Mobile Filters Drawer */}
            {showFilters && (
              <div className="lg:hidden fixed inset-0 z-50 bg-background">
                <div className="p-6 h-full overflow-y-auto">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="font-serif text-2xl text-foreground">ფილტრები</h2>
                    <button
                      type="button"
                      onClick={() => setShowFilters(false)}
                      className="p-2 text-foreground/70 hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Mobile Categories */}
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-4">კატეგორიები</h3>
                    <div className="space-y-2">
                      <button
                        type="button"
                        onClick={() => { setSelectedCategory("all"); setSelectedSubcategory(null); setShowFilters(false) }}
                        className={`w-full text-left px-4 py-3 rounded-xl text-sm boty-transition ${
                          selectedCategory === "all" ? "bg-primary text-primary-foreground" : "bg-card"
                        }`}
                      >
                        ყველა პროდუქტი
                      </button>
                      {categories.map(category => (
                        <div key={category.id}>
                          <button
                            type="button"
                            onClick={() => { setSelectedCategory(category.slug); setSelectedSubcategory(null); setShowFilters(false) }}
                            className={`w-full text-left px-4 py-3 rounded-xl text-sm boty-transition ${
                              selectedCategory === category.slug && !selectedSubcategory ? "bg-primary text-primary-foreground" : "bg-card"
                            }`}
                          >
                            {category.name}
                          </button>
                          <div className="ml-4 mt-1 space-y-1">
                            {category.subcategories.map(sub => (
                              <button
                                key={sub.id}
                                type="button"
                                onClick={() => { setSelectedCategory(category.slug); setSelectedSubcategory(sub.slug); setShowFilters(false) }}
                                className={`w-full text-left px-4 py-2 rounded-lg text-sm ${
                                  selectedSubcategory === sub.slug ? "text-primary font-medium" : "text-muted-foreground"
                                }`}
                              >
                                {sub.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Mobile Badge Filter */}
                  <div className="mb-6">
                    <h3 className="font-medium text-foreground mb-4">სტატუსი</h3>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { value: null, label: "ყველა" },
                        { value: "new", label: "ახალი" },
                        { value: "bestseller", label: "ბესტსელერი" },
                        { value: "sale", label: "ფასდაკლება" },
                      ].map(badge => (
                        <button
                          key={badge.value || "all"}
                          type="button"
                          onClick={() => { setSelectedBadge(badge.value); setShowFilters(false) }}
                          className={`px-4 py-2 rounded-full text-sm boty-transition ${
                            selectedBadge === badge.value 
                              ? "bg-primary text-primary-foreground" 
                              : "bg-card"
                          }`}
                        >
                          {badge.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Clear Filters */}
                  <button
                    type="button"
                    onClick={() => { clearFilters(); setShowFilters(false) }}
                    className="w-full px-4 py-3 rounded-xl bg-foreground/5 text-foreground text-sm"
                  >
                    ფილტრების გასუფთავება
                  </button>
                </div>
              </div>
            )}

            {/* Product Grid */}
            <div className="flex-1">
              {/* Desktop Sort & Count */}
              <div className="hidden lg:flex items-center justify-between mb-6 pb-4 border-b border-border/50">
                <span className="text-sm text-muted-foreground">
                  {filteredProducts.length} პროდუქტი ნაპოვნია
                </span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-muted-foreground mb-4">პროდუქტი ვერ მოიძებნა</p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="text-primary hover:underline"
                  >
                    ფილტრების გასუფთავება
                  </button>
                </div>
              ) : (
                <div 
                  ref={gridRef}
                  className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                >
                  {filteredProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id}
                      product={product}
                      index={index}
                      isVisible={isVisible}
                      onAddToCart={() => addItem({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.images[0]
                      })}
                      getBadgeStyle={getBadgeStyle}
                      getBadgeLabel={getBadgeLabel}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  )
}

function ProductCard({ 
  product, 
  index, 
  isVisible,
  onAddToCart,
  getBadgeStyle,
  getBadgeLabel
}: { 
  product: Product
  index: number
  isVisible: boolean
  onAddToCart: () => void
  getBadgeStyle: (badge: string | null) => string
  getBadgeLabel: (badge: string | null) => string
}) {
  const [imageLoaded, setImageLoaded] = useState(false)

  return (
    <Link
      href={`/product/${product.id}`}
      className={`group transition-all duration-700 ease-out ${
        isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      <div className="bg-card rounded-3xl overflow-hidden boty-shadow boty-transition group-hover:scale-[1.02]">
        {/* Image */}
        <div className="relative aspect-square bg-muted overflow-hidden">
          <div 
            className={`absolute inset-0 bg-gradient-to-br from-muted via-muted/50 to-muted animate-pulse transition-opacity duration-500 ${
              imageLoaded ? 'opacity-0' : 'opacity-100'
            }`}
          />
          
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className={`object-cover boty-transition group-hover:scale-105 transition-opacity duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {product.badge && (
            <span className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide ${getBadgeStyle(product.badge)}`}>
              {getBadgeLabel(product.badge)}
            </span>
          )}
          <WishlistButton
            product={{ id: product.id, name: product.name, price: product.price, image: product.images[0], originalPrice: product.originalPrice }}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center boty-shadow boty-transition"
          />
          
          <button
            type="button"
            className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 boty-transition boty-shadow"
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              onAddToCart()
            }}
            aria-label="კალათაში დამატება"
          >
            <ShoppingBag className="w-5 h-5 text-foreground" />
          </button>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="font-serif text-xl text-foreground mb-1">{product.name}</h3>
          <p className="text-sm text-muted-foreground mb-4 line-clamp-1">{product.description}</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-medium text-foreground">{product.price}₾</span>
            {product.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice}₾
              </span>
            )}
          </div>
          <StockBadge stock={product.stock} className="mt-3" />
        </div>
      </div>
    </Link>
  )
}
