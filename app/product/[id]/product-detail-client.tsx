"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Minus, Plus, ShoppingBag, Truck, RotateCcw, Shield, Star } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useCart } from "@/components/boty/cart-context"
import type { Product } from "@/lib/data/types"

interface ProductDetailClientProps {
  product: Product
  category: { slug: string; name: string } | null
  subcategory: { slug: string; name: string } | null
  relatedProducts: Product[]
}

export function ProductDetailClient({ product, category, subcategory, relatedProducts }: ProductDetailClientProps) {
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)
  const { addItem } = useCart()

  const discount = product.originalPrice
    ? Math.round((1 - product.price / product.originalPrice) * 100)
    : 0

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        image: product.images[0],
      })
    }
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1">
        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-28 pb-4">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground flex-wrap">
            <Link href="/" className="hover:text-foreground boty-transition">მთავარი</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/shop" className="hover:text-foreground boty-transition">მაღაზია</Link>
            {category && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/category/${category.slug}`} className="hover:text-foreground boty-transition">
                  {category.name}
                </Link>
              </>
            )}
            {subcategory && (
              <>
                <ChevronRight className="w-3 h-3" />
                <Link href={`/category/${category?.slug}/${subcategory.slug}`} className="hover:text-foreground boty-transition">
                  {subcategory.name}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground font-medium line-clamp-1">{product.name}</span>
          </nav>
        </div>

        {/* Product Section */}
        <div className="max-w-7xl mx-auto px-6 lg:px-8 pb-16">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

            {/* ── Images ── */}
            <div className="space-y-4">
              <div className="relative aspect-square rounded-3xl overflow-hidden bg-muted boty-shadow">
                <Image
                  src={product.images[selectedImage] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-cover"
                  priority
                />
                {discount > 0 && (
                  <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs tracking-wide bg-destructive/10 text-destructive font-medium">
                    -{discount}%
                  </span>
                )}
                {product.badge && (
                  <span className={`absolute top-4 ${discount > 0 ? 'left-24' : 'left-4'} px-3 py-1 rounded-full text-xs tracking-wide font-medium ${
                    product.badge === 'new' ? 'bg-primary/10 text-primary' :
                    product.badge === 'bestseller' ? 'bg-accent text-accent-foreground' :
                    'bg-destructive/10 text-destructive'
                  }`}>
                    {product.badge === 'new' ? 'ახალი' : product.badge === 'bestseller' ? 'ბესტსელერი' : 'ფასდაკლება'}
                  </span>
                )}
              </div>

              {product.images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 boty-transition ${
                        selectedImage === index ? 'border-primary' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={image} alt={`${product.name} ${index + 1}`} fill className="object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* ── Product Info ── */}
            <div className="space-y-6 lg:pt-4">
              {/* SKU */}
              <p className="text-xs text-muted-foreground tracking-widest uppercase">SKU: {product.sku}</p>

              {/* Name */}
              <h1 className="font-serif text-3xl md:text-4xl text-foreground leading-tight">{product.name}</h1>

              {/* Stars placeholder */}
              <div className="flex items-center gap-2">
                {[1,2,3,4,5].map(i => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
                <span className="text-sm text-muted-foreground ml-1">(94 შეფასება)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-bold text-foreground">{product.price}₾</span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">{product.originalPrice}₾</span>
                )}
                {discount > 0 && (
                  <span className="text-sm text-destructive font-medium bg-destructive/10 px-2 py-0.5 rounded-full">
                    -{discount}% დაზოგვა
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed">{product.description}</p>

              {/* Stock */}
              <div className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-green-700' : 'text-red-500'}`}>
                  {product.stock > 0 ? `მარაგშია (${product.stock} ერთეული)` : 'არ არის მარაგში'}
                </span>
              </div>

              {/* Quantity + Add to Cart */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex items-center border border-border rounded-full overflow-hidden boty-shadow">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted boty-transition"
                    disabled={quantity <= 1}
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-muted boty-transition"
                    disabled={quantity >= product.stock}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className={`flex-1 inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full text-sm tracking-wide font-medium boty-transition boty-shadow ${
                    added
                      ? 'bg-green-600 text-white'
                      : product.stock === 0
                      ? 'bg-muted text-muted-foreground cursor-not-allowed'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  {added ? '✓ დამატებულია' : 'კალათაში დამატება'}
                </button>
              </div>

              {/* Trust Badges */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-border/50">
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Truck className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">უფასო მიწოდება 100₾-დან</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <RotateCcw className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">14 დღიანი დაბრუნება</span>
                </div>
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-xs text-muted-foreground">გარანტირებული ხარისხი</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Specifications ── */}
          {product.specifications && Object.keys(product.specifications).length > 0 && (
            <div className="mt-16 bg-card rounded-3xl p-8 boty-shadow">
              <h2 className="font-serif text-2xl text-foreground mb-6">მახასიათებლები</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-3 border-b border-border/50">
                    <dt className="text-muted-foreground text-sm">{key}</dt>
                    <dd className="font-medium text-foreground text-sm">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}

          {/* ── Related Products ── */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="font-serif text-3xl text-foreground mb-8">მსგავსი პროდუქტები</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map(related => (
                  <Link
                    key={related.id}
                    href={`/product/${related.id}`}
                    className="group"
                  >
                    <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted mb-3 boty-shadow">
                      <Image
                        src={related.images[0] || "/placeholder.svg"}
                        alt={related.name}
                        fill
                        className="object-cover boty-transition group-hover:scale-105"
                      />
                    </div>
                    <h3 className="font-serif text-sm text-foreground group-hover:text-primary boty-transition line-clamp-1">
                      {related.name}
                    </h3>
                    <p className="font-medium text-foreground mt-1 text-sm">{related.price}₾</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
