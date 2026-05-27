import { createAdminClient } from "@/lib/supabase/admin"
import CategoriesClient from "./categories-client"

export default async function AdminCategoriesPage() {
  const supabase = createAdminClient()
  const { data: categories } = await supabase
    .from('categories')
    .select('*, subcategories(id, name, name_en, slug)')
    .order('name')

  return <CategoriesClient initialCategories={categories ?? []} />
}
