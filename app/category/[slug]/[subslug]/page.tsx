import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryBySlug, getSubcategory } from "@/lib/supabase/categories"
import { getProductsBySubcategory } from "@/lib/supabase/products"
import { SubcategoryClient } from "./subcategory-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string; subslug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, subslug } = await params
  const category = await getCategoryBySlug(slug)
  const subcategory = await getSubcategory(slug, subslug)
  if (!category || !subcategory) return { title: "ვერ მოიძებნა" }

  const title = `${subcategory.name} — ${category.name}`
  const description = subcategory.description?.trim() || `${subcategory.name} — samkaulebi.shop`
  const path = `/category/${category.slug}/${subcategory.slug}`
  const ogImage = subcategory.image || category.image
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  }
}

export default async function SubcategoryPage({ params }: PageProps) {
  const { slug, subslug } = await params
  const category = await getCategoryBySlug(slug)
  const subcategory = await getSubcategory(slug, subslug)
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
