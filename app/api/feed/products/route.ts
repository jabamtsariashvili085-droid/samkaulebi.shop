import { NextResponse } from "next/server"
import { getAllProducts } from "@/lib/supabase/products"
import { SITE_URL } from "@/lib/site"

// Structured product feed for AI agents / shopping crawlers (TODO 1.2).
export const dynamic = "force-dynamic"

const toAbsolute = (img: string | undefined) =>
  !img ? null : img.startsWith("http") ? img : `${SITE_URL}${img}`

export async function GET() {
  const products = await getAllProducts()

  const feed = products.map((p) => ({
    id: p.id,
    title: p.name,
    description: p.description,
    price: p.price,
    currency: "GEL",
    availability: p.stock > 0 ? "in_stock" : "out_of_stock",
    image: toAbsolute(p.images[0]),
    category: p.categoryId,
    subcategory: p.subcategoryId,
    url: `${SITE_URL}/product/${encodeURIComponent(p.id)}`,
  }))

  return NextResponse.json(
    { generated_at: new Date().toISOString(), count: feed.length, products: feed },
    { headers: { "Cache-Control": "public, max-age=0, s-maxage=3600" } }
  )
}
