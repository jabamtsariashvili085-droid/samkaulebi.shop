import type { MetadataRoute } from "next"
import { SITE_URL } from "@/lib/site"
import { categories } from "@/lib/data/categories"
import { getAllProducts } from "@/lib/supabase/products"

// Products come from the DB, so regenerate on demand.
export const dynamic = "force-dynamic"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const products = await getAllProducts()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/shop`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/faq`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/shipping`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/returns`, lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ]

  const categoryRoutes: MetadataRoute.Sitemap = categories.flatMap((c) => [
    { url: `${SITE_URL}/category/${c.slug}`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    ...c.subcategories.map((s) => ({
      url: `${SITE_URL}/category/${c.slug}/${s.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
  ])

  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/product/${encodeURIComponent(p.id)}`,
    lastModified: p.createdAt ?? now,
    changeFrequency: "weekly",
    priority: 0.9,
  }))

  return [...staticRoutes, ...categoryRoutes, ...productRoutes]
}
