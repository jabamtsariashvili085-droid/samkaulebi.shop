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

export const dynamic = "force-dynamic"

export default async function HomePage() {
  const products = await getAllProducts()
  return (
    <main>
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
