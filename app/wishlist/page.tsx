"use client"

import Link from "next/link"
import Image from "next/image"
import { Heart, ShoppingBag, X, ChevronRight } from "lucide-react"
import { Header } from "@/components/boty/header"
import { Footer } from "@/components/boty/footer"
import { useWishlist } from "@/components/boty/wishlist-context"
import { useCart } from "@/components/boty/cart-context"

export default function WishlistPage() {
  const { items, removeItem } = useWishlist()
  const { addItem } = useCart()

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
            <Link href="/" className="hover:text-foreground transition-colors">მთავარი</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-foreground">სურვილების სია</span>
          </nav>

          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif text-3xl md:text-4xl text-foreground">სურვილების სია</h1>
              {items.length > 0 && (
                <p className="text-sm text-muted-foreground">{items.length} პროდუქტი</p>
              )}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-5">
                <Heart className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-6">სურვილების სია ცარიელია</p>
              <Link
                href="/shop"
                className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-full font-medium hover:bg-primary/90 transition-colors text-sm"
              >
                პროდუქტების დათვალიერება
              </Link>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {items.map(product => (
                <div key={product.id} className="group bg-card rounded-3xl overflow-hidden boty-shadow">
                  <div className="relative aspect-square bg-muted overflow-hidden">
                    <Link href={`/product/${product.id}`}>
                      <Image
                        src={product.image || "/placeholder.svg"}
                        alt={product.name}
                        fill
                        className="object-cover boty-transition group-hover:scale-105"
                      />
                    </Link>
                    <button
                      type="button"
                      onClick={() => removeItem(product.id)}
                      aria-label="წაშლა"
                      className="absolute top-3 right-3 w-9 h-9 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center boty-shadow hover:bg-background boty-transition"
                    >
                      <X className="w-4 h-4 text-foreground" />
                    </button>
                  </div>

                  <div className="p-5">
                    <Link href={`/product/${product.id}`}>
                      <h3 className="font-serif text-lg text-foreground mb-1 line-clamp-1 hover:text-primary boty-transition">
                        {product.name}
                      </h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="font-medium text-foreground">{product.price}₾</span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{product.originalPrice}₾</span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        addItem({
                          id: product.id,
                          name: product.name,
                          description: "",
                          price: product.price,
                          image: product.image,
                        })
                      }
                      className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 boty-transition"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      კალათაში დამატება
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
