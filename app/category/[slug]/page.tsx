import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getSubcategoriesByCategory } from "@/lib/supabase/categories"
import { getProductsByCategory } from "@/lib/supabase/products"
import { CategoryClient } from "./category-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: "კატეგორია ვერ მოიძებნა" }

  const description = category.description?.trim() || `${category.name} — samkaulebi.shop`
  const path = `/category/${category.slug}`
  return {
    title: category.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: category.name,
      description,
      images: category.image ? [category.image] : undefined,
    },
  }
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const subcategories = await getSubcategoriesByCategory(category.id)
  const categoryProducts = await getProductsByCategory(category.slug)
  const subProductCounts = Object.fromEntries(
    subcategories.map((s) => [s.id, categoryProducts.filter((p) => p.subcategoryId === s.slug).length])
  )

  return (
    <CategoryClient
      category={category}
      subcategories={subcategories}
      categoryProducts={categoryProducts}
      subProductCounts={subProductCounts}
    />
  )
}
