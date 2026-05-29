import { notFound } from "next/navigation"
import { getProductById, getRelatedProducts } from "@/lib/supabase/products"
import { categories, subcategories } from "@/lib/data/categories"
import { ProductDetailClient } from "./product-detail-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const product = await getProductById(decodedId)
  if (!product) notFound()

  const category = categories.find((c) => c.slug === product.categoryId) ?? null
  const subcategory = subcategories.find((s) => s.slug === product.subcategoryId) ?? null
  const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

  return (
    <ProductDetailClient
      product={product}
      category={category}
      subcategory={subcategory}
      relatedProducts={relatedProducts}
    />
  )
}
