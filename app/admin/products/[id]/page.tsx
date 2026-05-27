import { createAdminClient } from "@/lib/supabase/admin"
import { notFound } from "next/navigation"
import ProductForm from "../product-form"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = createAdminClient()

  const [{ data: product }, { data: cats }] = await Promise.all([
    supabase.from('products').select('*').eq('id', id).single(),
    supabase.from('categories').select('id, name, subcategories(id, name)').order('name'),
  ])

  if (!product) notFound()

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
      <h1 className="font-serif text-3xl text-foreground mb-8">პროდუქტის რედაქტირება</h1>
      <ProductForm categories={categories} initial={product} />
    </div>
  )
}
