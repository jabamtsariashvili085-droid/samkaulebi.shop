"use client"

import { useRouter } from "next/navigation"
import { Trash2 } from "lucide-react"

export default function DeleteProductButton({ productId }: { productId: string }) {
  const router = useRouter()

  const handleDelete = async () => {
    if (!confirm("პროდუქტის წაშლა? ეს მოქმედება ვერ გაიუქმება.")) return
    await fetch(`/api/admin/products/${productId}`, { method: 'DELETE' })
    router.refresh()
  }

  return (
    <button
      onClick={handleDelete}
      className="p-1.5 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-colors"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  )
}
