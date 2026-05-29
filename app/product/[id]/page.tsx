import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById, getRelatedProducts } from "@/lib/supabase/products"
import { categories, subcategories } from "@/lib/data/categories"
import { ProductDetailClient } from "./product-detail-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(decodeURIComponent(id))
  if (!product) return { title: "პროდუქტი ვერ მოიძებნა" }

  const description = (product.description?.trim() || `${product.name} — samkaulebi.shop`).slice(0, 160)
  const image = product.images[0]
  const path = `/product/${encodeURIComponent(product.id)}`

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: product.name,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  }
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
