import { createAdminClient } from "@/lib/supabase/admin"
import ProductForm from "../product-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function NewProductPage() {
  const supabase = createAdminClient()
  const { data: cats } = await supabase
    .from('categories')
    .select('id, name, subcategories(id, name)')
    .order('name')

  const categories = (cats ?? []).map(c => ({
    id: c.id,
    name: c.name,
    subcategories: (c.subcategories as {id: string; name: string}[]) ?? [],
  }))

  return (
    <div className="p-8">
      <Link href="/admin/products" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
        <ChevronLeft className="w-4 h-4" />
        პროდუქტები
      </Link>
      <h1 className="font-serif text-3xl text-foreground mb-8">ახალი პროდუქტი</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
