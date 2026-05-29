// =============================================================================
// lib/supabase/categories.ts — server-side category/subcategory reads (with images)
// =============================================================================
// Categories & subcategories are managed in the admin panel (DB). The static
// lib/data/categories.ts remains the nav/icon config, but anything that needs the
// admin-uploaded image (category pages, homepage showcase) reads from here.
// Uses the anon server client + RLS public_read policies.
// =============================================================================

import { createClient } from "@/lib/supabase/server"

export interface CategoryRow {
  id: string
  name: string
  name_en: string | null
  slug: string
  icon: string | null
  image: string | null
  description: string | null
}

export interface SubcategoryRow {
  id: string
  name: string
  name_en: string | null
  slug: string
  category_id: string
  image: string | null
  description: string | null
}

export async function getCategoryBySlug(slug: string): Promise<CategoryRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").eq("slug", slug).maybeSingle()
  if (error) {
    console.error("[categories] getCategoryBySlug:", error.message)
    return null
  }
  return (data as CategoryRow) ?? null
}

export async function getSubcategoriesByCategory(categoryId: string): Promise<SubcategoryRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categoryId)
    .order("name")
  if (error) {
    console.error("[categories] getSubcategoriesByCategory:", error.message)
    return []
  }
  return (data as SubcategoryRow[]) ?? []
}

/** A single subcategory by category + subcategory slug. */
export async function getSubcategory(categorySlug: string, subSlug: string): Promise<SubcategoryRow | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("subcategories")
    .select("*")
    .eq("category_id", categorySlug)
    .eq("slug", subSlug)
    .maybeSingle()
  if (error) {
    console.error("[categories] getSubcategory:", error.message)
    return null
  }
  return (data as SubcategoryRow) ?? null
}

/** All categories with their image — for the homepage showcase. */
export async function getCategoriesWithImages(): Promise<CategoryRow[]> {
  const supabase = await createClient()
  const { data, error } = await supabase.from("categories").select("*").order("name")
  if (error) {
    console.error("[categories] getCategoriesWithImages:", error.message)
    return []
  }
  return (data as CategoryRow[]) ?? []
}
