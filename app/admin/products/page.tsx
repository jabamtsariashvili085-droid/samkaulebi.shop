import { createAdminClient } from "@/lib/supabase/admin"
import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import DeleteProductButton from "./delete-product-button"

export const dynamic = 'force-dynamic'

export default async function AdminProductsPage() {
  const supabase = createAdminClient()
  const { data: products } = await supabase
    .from('products')
    .select('id, name, price, original_price, category_id, badge, stock, images, featured')
    .order('created_at', { ascending: false })

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-serif text-3xl text-foreground">პროდუქტები</h1>
          <p className="text-muted-foreground mt-1">{products?.length ?? 0} პროდუქტი</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          ახალი პროდუქტი
        </Link>
      </div>

      <div className="bg-card rounded-2xl border border-border/50 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-border/50 bg-muted/30">
            <tr>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">პროდუქტი</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">კატეგორია</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">ფასი</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">მარაგი</th>
              <th className="text-left px-5 py-3 text-muted-foreground font-medium">Badge</th>
              <th className="px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/50">
            {products?.map(product => (
              <tr key={product.id} className="hover:bg-muted/20 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                      {product.images?.[0] ? (
                        <Image src={product.images[0]} alt={product.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-muted" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-foreground line-clamp-1">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-muted-foreground">{product.category_id}</td>
                <td className="px-5 py-3.5">
                  <span className="font-medium text-foreground">{product.price}₾</span>
                  {product.original_price && (
                    <span className="text-xs text-muted-foreground line-through ml-1.5">{product.original_price}₾</span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <span className={`text-sm font-medium ${product.stock === 0 ? 'text-red-500' : product.stock < 10 ? 'text-yellow-500' : 'text-green-600'}`}>
                    {product.stock}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {product.badge && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">
                      {product.badge}
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2 justify-end">
                    <Link
                      href={`/admin/products/${product.id}`}
                      className="text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors text-foreground"
                    >
                      რედაქტირება
                    </Link>
                    <DeleteProductButton productId={product.id} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
