import { notFound } from "next/navigation"
import { categories, getSubcategoriesByParent } from "@/lib/data/categories"
import { getProductsByCategory } from "@/lib/supabase/products"
import { CategoryClient } from "./category-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params
  const category = categories.find((c) => c.slug === slug)
  if (!category) notFound()

  const subcategories = getSubcategoriesByParent(category.id)
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
