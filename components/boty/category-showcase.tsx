"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight, Gem, Sparkles, Droplets } from "lucide-react"
import { categories } from "@/lib/data/categories"

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  gem: Gem,
  sparkles: Sparkles,
  droplets: Droplets,
}

const categoryImages: Record<string, string> = {
  jewelry: '/images/products/serum-bottles-1.png',
  fragrances: '/images/products/amber-dropper-bottles.png',
  haircare: '/images/products/pump-bottles-lavender.png',
}

export function CategoryShowcase() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <span 
            className={`text-sm tracking-[0.3em] uppercase text-primary mb-4 block ${isVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`} 
            style={isVisible ? { animationDelay: '0.2s', animationFillMode: 'forwards' } : {}}
          >
            კატეგორიები
          </span>
          <h2 
            className={`font-serif leading-tight text-foreground mb-4 text-balance text-5xl md:text-6xl lg:text-7xl ${isVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`}
            style={isVisible ? { animationDelay: '0.4s', animationFillMode: 'forwards' } : {}}
          >
            აღმოაჩინე შენი სტილი
          </h2>
          <p 
            className={`text-lg text-muted-foreground max-w-md mx-auto ${isVisible ? 'animate-blur-in opacity-0' : 'opacity-0'}`}
            style={isVisible ? { animationDelay: '0.6s', animationFillMode: 'forwards' } : {}}
          >
            პრემიუმ პროდუქტები თითოეული კატეგორიისთვის
          </p>
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {categories.map((category, index) => {
            const IconComponent = categoryIcons[category.icon]
            return (
              <Link
                key={category.id}
                href={`/shop/${category.slug}`}
                className={`group relative overflow-hidden rounded-3xl bg-card boty-shadow boty-transition hover:scale-[1.02] ${
                  isVisible ? 'animate-blur-in opacity-0' : 'opacity-0'
                }`}
                style={isVisible ? { animationDelay: `${0.8 + index * 0.15}s`, animationFillMode: 'forwards' } : {}}
              >
                {/* Background Image */}
                <div className="aspect-[4/5] relative">
                  <div 
                    className="absolute inset-0 bg-cover bg-center boty-transition group-hover:scale-110"
                    style={{ backgroundImage: `url(${categoryImages[category.slug]})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                </div>

                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <div className="flex items-center gap-3 mb-3">
                    {IconComponent && (
                      <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                        <IconComponent className="w-5 h-5" />
                      </div>
                    )}
                    <h3 className="font-serif text-2xl">{category.name}</h3>
                  </div>
                  <p className="text-white/80 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm font-medium text-white/90 group-hover:text-white">
                    <span>აღმოაჩინე</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 boty-transition" />
                  </div>
                </div>

                {/* Subcategory Preview */}
                <div className="absolute top-4 right-4 flex flex-wrap gap-2 max-w-[200px] justify-end">
                  {category.subcategories.slice(0, 3).map((sub) => (
                    <span
                      key={sub.id}
                      className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs text-white"
                    >
                      {sub.name}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
