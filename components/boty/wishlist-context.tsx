"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

export interface WishlistItem {
  id: string
  name: string
  price: number
  image: string
  originalPrice?: number
}

interface WishlistContextType {
  items: WishlistItem[]
  toggleItem: (item: WishlistItem) => void
  addItem: (item: WishlistItem) => void
  removeItem: (id: string) => void
  isInWishlist: (id: string) => boolean
  clearWishlist: () => void
  count: number
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

const WISHLIST_STORAGE_KEY = "samkaulebi_wishlist"

function loadFromStorage(): WishlistItem[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(WISHLIST_STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function saveToStorage(items: WishlistItem[]) {
  if (typeof window === "undefined") return
  try {
    localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items))
  } catch {
    // storage quota exceeded or private mode
  }
}

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([])
  const [hydrated, setHydrated] = useState(false)

  // Hydrate from localStorage after mount (avoids SSR mismatch)
  useEffect(() => {
    setItems(loadFromStorage())
    setHydrated(true)
  }, [])

  // Persist whenever items change (after hydration)
  useEffect(() => {
    if (hydrated) saveToStorage(items)
  }, [items, hydrated])

  // Cross-tab sync
  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === WISHLIST_STORAGE_KEY) setItems(loadFromStorage())
    }
    window.addEventListener("storage", onStorage)
    return () => window.removeEventListener("storage", onStorage)
  }, [])

  const addItem = (item: WishlistItem) => {
    setItems(current => (current.some(i => i.id === item.id) ? current : [...current, item]))
  }

  const removeItem = (id: string) => {
    setItems(current => current.filter(i => i.id !== id))
  }

  const toggleItem = (item: WishlistItem) => {
    setItems(current =>
      current.some(i => i.id === item.id)
        ? current.filter(i => i.id !== item.id)
        : [...current, item]
    )
  }

  const isInWishlist = (id: string) => items.some(i => i.id === id)
  const clearWishlist = () => setItems([])
  const count = items.length

  return (
    <WishlistContext.Provider
      value={{ items, toggleItem, addItem, removeItem, isInWishlist, clearWishlist, count }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const context = useContext(WishlistContext)
  if (context === undefined) {
    throw new Error("useWishlist must be used within a WishlistProvider")
  }
  return context
}
