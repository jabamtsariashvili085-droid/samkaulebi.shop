import { Flame } from "lucide-react"

/**
 * Scarcity pill — shows "მხოლოდ X დარჩა" only when stock is low (1–4).
 * Pure presentational; renders nothing when out of stock or comfortably stocked.
 */
export function StockBadge({ stock, className }: { stock: number; className?: string }) {
  if (stock <= 0 || stock >= 5) return null
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-medium text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full ${className ?? ""}`}
    >
      <Flame className="w-3 h-3" />
      მხოლოდ {stock} დარჩა
    </span>
  )
}
