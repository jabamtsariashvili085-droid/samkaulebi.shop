import { Header } from "@/components/boty/header"
import { Hero } from "@/components/boty/hero"
import { TrustBadges } from "@/components/boty/trust-badges"
import { CategoryShowcase } from "@/components/boty/category-showcase"
import { ProductGrid } from "@/components/boty/product-grid"
import { FeatureSection } from "@/components/boty/feature-section"
import { Testimonials } from "@/components/boty/testimonials"
import { CTABanner } from "@/components/boty/cta-banner"
import { Newsletter } from "@/components/boty/newsletter"
import { Footer } from "@/components/boty/footer"
import { getAllProducts } from "@/lib/supabase/products"
import { JsonLd } from "@/components/seo/json-ld"
import { SITE_URL, SITE_NAME, SITE_DESCRIPTION } from "@/lib/site"

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const products = await getAllProducts()

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
  }
  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <main>
      <JsonLd data={[organizationLd, websiteLd]} />
      <Header />
      <Hero />
      <TrustBadges />
      <CategoryShowcase />
      <ProductGrid products={products} />
      <FeatureSection />
      <Testimonials />
      <CTABanner />
      <Newsletter />
      <Footer />
    </main>
  )
}
