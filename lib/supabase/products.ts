// =============================================================================
// lib/supabase/products.ts
// samkaulebi.shop — server-side storefront product reads (Supabase, RLS public_read)
// =============================================================================
// Source of truth for storefront product data. Replaces the static lib/data/products.ts.
// Uses the anon server client (cookie-aware) + RLS `public_read_products` policy.
//
// DB columns are snake_case; the storefront UI expects the camelCase `Product` type
// (lib/data/types.ts). mapProduct() bridges that — and crucially coerces numeric
// columns (price/original_price), which supabase-js returns as STRINGS, to numbers
// so client-side filtering/sorting/maths work.
// =============================================================================

import { createClient } from '@/lib/supabase/server'
import type { Product, CategorySlug, SubcategorySlug, ProductBadge } from '@/lib/data/types'

interface ProductRow {
  id: string
  name: string
  name_en: string | null
  description: string | null
  price: number | string
  original_price: number | string | null
  images: string[] | null
  category_id: string | null
  subcategory_id: string | null
  badge: string | null
  stock: number | null
  sku: string | null
  specifications: Record<string, unknown> | null
  featured: boolean | null
  created_at: string | null
  image_alt: string | null
  tags: string[] | null
}

// explicit column list (keeps payload tight + intentional)
const PRODUCT_COLUMNS =
  'id,name,name_en,description,price,original_price,images,category_id,subcategory_id,badge,stock,sku,specifications,featured,created_at,image_alt,tags'

function mapProduct(row: ProductRow): Product {
  return {
    id: row.id,
    name: row.name,
    nameEn: row.name_en ?? '',
    description: row.description ?? '',
    descriptionEn: '', // no description_en column in DB yet
    price: Number(row.price) || 0,
    originalPrice: row.original_price != null ? Number(row.original_price) : undefined,
    images: row.images ?? [],
    categoryId: (row.category_id ?? '') as CategorySlug,
    subcategoryId: (row.subcategory_id ?? '') as SubcategorySlug,
    badge: (row.badge ?? null) as ProductBadge,
    stock: row.stock ?? 0,
    sku: row.sku ?? '',
    createdAt: row.created_at ? new Date(row.created_at) : new Date(),
    featured: row.featured ?? false,
    specifications: (row.specifications as Record<string, string>) ?? {},
    imageAlt: row.image_alt ?? undefined,
    tags: row.tags ?? [],
  }
}

/** All products, oldest first (stable order). Returns [] on error (never throws). */
export async function getAllProducts(): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[products] getAllProducts:', error.message)
    return []
  }
  return ((data as ProductRow[]) ?? []).map(mapProduct)
}

/** Featured products for the homepage. */
export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('featured', true)
    .order('created_at', { ascending: false })
    .limit(limit)
  if (error) {
    console.error('[products] getFeaturedProducts:', error.message)
    return []
  }
  return ((data as ProductRow[]) ?? []).map(mapProduct)
}

/** Single product by id. Returns null if not found (page should call notFound()). */
export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('id', id)
    .maybeSingle()
  if (error) {
    console.error('[products] getProductById:', error.message)
    return null
  }
  return data ? mapProduct(data as ProductRow) : null
}

/** Products in a category (by slug, e.g. 'jewelry'). */
export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('category_id', categorySlug)
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[products] getProductsByCategory:', error.message)
    return []
  }
  return ((data as ProductRow[]) ?? []).map(mapProduct)
}

/** Products in a subcategory (by slug, e.g. 'rings'). */
export async function getProductsBySubcategory(subcategorySlug: string): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('subcategory_id', subcategorySlug)
    .order('created_at', { ascending: true })
  if (error) {
    console.error('[products] getProductsBySubcategory:', error.message)
    return []
  }
  return ((data as ProductRow[]) ?? []).map(mapProduct)
}

/** Related products: same category, excluding the current product. */
export async function getRelatedProducts(
  productId: string,
  categorySlug: string,
  limit = 4
): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('products')
    .select(PRODUCT_COLUMNS)
    .eq('category_id', categorySlug)
    .neq('id', productId)
    .limit(limit)
  if (error) {
    console.error('[products] getRelatedProducts:', error.message)
    return []
  }
  return ((data as ProductRow[]) ?? []).map(mapProduct)
}
