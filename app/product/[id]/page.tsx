import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getProductById, getRelatedProducts } from "@/lib/supabase/products"
import { categories, subcategories } from "@/lib/data/categories"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL } from "@/lib/site"
import { ProductDetailClient } from "./product-detail-client"

export const dynamic = "force-dynamic"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const product = await getProductById(decodeURIComponent(id))
  if (!product) return { title: "პროდუქტი ვერ მოიძებნა" }

  const description = (product.description?.trim() || `${product.name} — samkaulebi.shop`).slice(0, 160)
  const image = product.images[0]
  const path = `/product/${encodeURIComponent(product.id)}`

  return {
    title: product.name,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: product.name,
      description,
      images: image ? [{ url: image, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : undefined,
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { id } = await params
  const decodedId = decodeURIComponent(id)
  const product = await getProductById(decodedId)
  if (!product) notFound()

  const category = categories.find((c) => c.slug === product.categoryId) ?? null
  const subcategory = subcategories.find((s) => s.slug === product.subcategoryId) ?? null
  const relatedProducts = await getRelatedProducts(product.id, product.categoryId)

  const url = `${SITE_URL}/product/${encodeURIComponent(product.id)}`
  const toAbsolute = (img: string) => (img.startsWith("http") ? img : `${SITE_URL}${img}`)

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || undefined,
    image: product.images.map(toAbsolute),
    sku: product.sku || undefined,
    category: category?.name,
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "GEL",
      availability:
        product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    },
  }

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "მთავარი", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "მაღაზია", item: `${SITE_URL}/shop` },
      ...(category
        ? [{ "@type": "ListItem", position: 3, name: category.name, item: `${SITE_URL}/category/${category.slug}` }]
        : []),
      { "@type": "ListItem", position: category ? 4 : 3, name: product.name, item: url },
    ],
  }

  return (
    <>
      <JsonLd data={[productLd, breadcrumbLd]} />
      <ProductDetailClient
        product={product}
        category={category}
        subcategory={subcategory}
        relatedProducts={relatedProducts}
      />
    </>
  )
}
