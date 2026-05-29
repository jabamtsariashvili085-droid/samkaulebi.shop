"use client"

import { Heart } from "lucide-react"
import { useWishlist, type WishlistItem } from "./wishlist-context"

/**
 * Reusable heart toggle for product cards / detail pages.
 * Stops link navigation so it can live inside a clickable card.
 */
export function WishlistButton({
  product,
  className,
  size = 16,
}: {
  product: WishlistItem
  className?: string
  size?: number
}) {
  const { isInWishlist, toggleItem } = useWishlist()
  const active = isInWishlist(product.id)

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggleItem(product)
      }}
      aria-label={active ? "სურვილების სიიდან წაშლა" : "სურვილების სიაში დამატება"}
      aria-pressed={active}
      className={
        className ??
        "w-10 h-10 rounded-full bg-background/90 backdrop-blur-sm flex items-center justify-center boty-shadow boty-transition"
      }
    >
      <Heart
        style={{ width: size, height: size }}
        className={`boty-transition ${active ? "fill-red-500 text-red-500" : "text-foreground"}`}
      />
    </button>
  )
}
