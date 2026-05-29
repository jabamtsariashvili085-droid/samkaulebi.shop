import { notFound } from "next/navigation"
import { categories } from "@/lib/data/categories"
import { getProductsBySubcategory } from "@/lib/supabase/products"
import { SubcategoryClient } from "./subcategory-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string; subslug: string }>
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
