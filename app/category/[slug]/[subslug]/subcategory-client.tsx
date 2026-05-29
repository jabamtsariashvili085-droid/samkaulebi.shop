"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, SlidersHorizontal, Grid3X3, LayoutGrid, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import { WishlistButton } from "@/components/boty/wishlist-button"
import { StockBadge } from "@/components/boty/stock-badge"
import type { Product } from "@/lib/data/types"
import type { CategoryRow, SubcategoryRow } from "@/lib/supabase/categories"

interface SubcategoryClientProps {
  category: CategoryRow
  subcategory: SubcategoryRow
  subcategoryProducts: Product[]
}

export function SubcategoryClient({ category, subcategory, subcategoryProducts }: SubcategoryClientProps) {
  const [priceRange, setPriceRange] = useState([0, 500])
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sortBy, setSortBy] = useState<string>("newest")
  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  const { addItem } = useCart()

  const filteredProducts = useMemo(() => {
    let filtered = [...subcategoryProducts]

    // Filter by price
    filtered = filtered.filter(p => p.price >= priceRange[0] && p.price <= priceRange[1])

    // Filter by stock
    if (inStockOnly) {
      filtered = filtered.filter(p => p.stock > 0)
    }

    // Sort
    switch (sortBy) {
      case "price-asc":
        filtered.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        filtered.sort((a, b) => b.price - a.price)
        break
      case "name":
        filtered.sort((a, b) => a.name.localeCompare(b.name, 'ka'))
        break
      case "newest":
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    }

    return filtered
  }, [subcategoryProducts, priceRange, inStockOnly, sortBy])

  const clearFilters = () => {
    setPriceRange([0, 500])
    setInStockOnly(false)
  }

  const activeFiltersCount = (inStockOnly ? 1 : 0) + (priceRange[0] > 0 || priceRange[1] < 500 ? 1 : 0)

  const FiltersContent = () => (
    <div className="space-y-6">
      {/* Price Range */}
      <div>
        <h3 className="font-medium mb-3 text-foreground">ფასი</h3>
        <Slider
          value={priceRange}
          onValueChange={setPriceRange}
          min={0}
          max={500}
          step={10}
          className="mb-2"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>{priceRange[0]}₾</span>
          <span>{priceRange[1]}₾</span>
        </div>
      </div>

      {/* Stock */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <Checkbox
            checked={inStockOnly}
            onCheckedChange={(checked) => setInStockOnly(checked as boolean)}
          />
          <span className="text-sm text-muted-foreground">მხოლოდ მარაგში</span>
        </label>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
          <X className="w-4 h-4 mr-2" />
          ფილტრების გასუფთავება
        </Button>
      )}
    </div>
  )

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Hero Banner */}
        <div
          className="relative h-48 md:h-56 bg-cover bg-center"
          style={(subcategory.image || category.image) ? { backgroundImage: `url(${subcategory.image || category.image})` } : undefined}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="relative z-10 h-full flex flex-col items-center justify-center text-white">
            <h1 className="text-3xl md:text-4xl font-serif font-bold mb-2">{subcategory.name}</h1>
            {subcategory.description && (
              <p className="text-white/80 text-center max-w-xl px-4">{subcategory.description}</p>
            )}
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground transition-colors">მთავარი</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/shop" className="hover:text-foreground transition-colors">მაღაზია</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href={`/category/${category.slug}`} className="hover:text-foreground transition-colors">{category.name}</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">{subcategory.name}</span>
          </nav>
        </div>

        <div className="container mx-auto px-4 pb-16">
          {/* Toolbar */}
          <div className="flex items-center justify-between gap-4 mb-6 pb-4 border-b border-border">
            <div className="flex items-center gap-4">
              {/* Mobile Filter Button */}
              <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm" className="lg:hidden">
                    <SlidersHorizontal className="w-4 h-4 mr-2" />
                    ფილტრები
                    {activeFiltersCount > 0 && (
                      <Badge variant="secondary" className="ml-2">{activeFiltersCount}</Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>ფილტრები</SheetTitle>
                  </SheetHeader>
                  <div className="mt-6">
                    <FiltersContent />
                  </div>
                </SheetContent>
              </Sheet>

              <p className="text-sm text-muted-foreground hidden sm:block">
                {filteredProducts.length} პროდუქტი
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-border rounded-lg px-3 py-2 bg-background text-foreground"
              >
                <option value="newest">უახლესი</option>
                <option value="price-asc">ფასი: დაბალიდან</option>
                <option value="price-desc">ფასი: მაღალიდან</option>
                <option value="name">სახელით</option>
              </select>

              {/* Grid Toggle */}
              <div className="hidden md:flex items-center gap-1 border border-border rounded-lg p-1">
                <button
                  onClick={() => setGridCols(2)}
                  className={`p-1.5 rounded ${gridCols === 2 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <Grid3X3 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setGridCols(3)}
                  className={`p-1.5 rounded ${gridCols === 3 ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:text-foreground'}`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <h2 className="font-semibold mb-4 text-foreground">ფილტრები</h2>
                <FiltersContent />
              </div>
            </aside>

            {/* Product Grid */}
            <div className="flex-1">
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16">
                  <p className="text-muted-foreground mb-4">პროდუქტი ვერ მოიძებნა</p>
                  <Button variant="outline" onClick={clearFilters}>ფილტრების გასუფთავება</Button>
                </div>
              ) : (
                <div className={`grid gap-6 ${
                  gridCols === 2 ? 'grid-cols-1 sm:grid-cols-2' :
                  gridCols === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' :
                  'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
                }`}>
                  {filteredProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onAddToCart={() => addItem({
                        id: product.id,
                        name: product.name,
                        description: product.description,
                        price: product.price,
                        image: product.images[0],
                      })}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: () => void }) {
  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  return (
    <div className="group">
      <Link href={`/product/${product.id}`} className="block">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted mb-3">
          <Image
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discount > 0 && (
            <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
              -{discount}%
            </Badge>
          )}
          <WishlistButton
            product={{ id: product.id, name: product.name, price: product.price, image: product.images[0], originalPrice: product.originalPrice }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center boty-shadow boty-transition"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <span className="text-white font-medium">არ არის მარაგში</span>
            </div>
          )}
        </div>
      </Link>

      <div className="space-y-1">
        <Link href={`/product/${product.id}`}>
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-foreground">{product.price}₾</span>
          {product.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">{product.originalPrice}₾</span>
          )}
        </div>
        <StockBadge stock={product.stock} />
        <Button
          size="sm"
          className="w-full mt-2"
          onClick={(e) => {
            e.preventDefault()
            onAddToCart()
          }}
          disabled={product.stock === 0}
        >
          კალათაში დამატება
        </Button>
      </div>
    </div>
  )
}
