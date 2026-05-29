import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { categories } from "@/lib/data/categories"
import { getProductsBySubcategory } from "@/lib/supabase/products"
import { SubcategoryClient } from "./subcategory-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string; subslug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subslug } = await params
  const category = categories.find((c) => c.slug === slug)
  const subcategory = category?.subcategories.find((s) => s.slug === subslug)
  if (!category || !subcategory) return { title: "ვერ მოიძებნა" }

  const title = `${subcategory.name} — ${category.name}`
  const description = subcategory.description?.trim() || `${subcategory.name} — samkaulebi.shop`
  const path = `/category/${category.slug}/${subcategory.slug}`
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { type: "website", url: path, title, description },
  }
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, subslug } = await params
  const category = categories.find((c) => c.slug === slug)
  const subcategory = category?.subcategories.find((s) => s.slug === subslug)
  if (!category || !subcategory) notFound()

  const subcategoryProducts = await getProductsBySubcategory(subcategory.slug)

  return (
    <SubcategoryClient
      category={category}
      subcategory={subcategory}
      subcategoryProducts={subcategoryProducts}
    />
  )
}
