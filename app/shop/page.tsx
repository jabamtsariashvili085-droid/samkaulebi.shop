import { getAllProducts } from "@/lib/supabase/products"
import { categories } from "@/lib/data/categories"
import { ShopClient } from "./shop-client"

// Storefront reads live data from Supabase — opt out of static optimization.
export const dynamic = "force-dynamic"

export default async function ShopPage() {
  const products = await getAllProducts()
  return <ShopClient products={products} categories={categories} />
}
