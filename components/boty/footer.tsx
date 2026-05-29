"use client"

import Link from "next/link"
import { Instagram, Facebook, Send } from "lucide-react"
import { categories } from "@/lib/data/categories"

const footerLinks = {
  support: [
    { name: "კონტაქტი", href: "/contact" },
    { name: "ხშირად დასმული კითხვები", href: "/faq" },
    { name: "მიწოდება", href: "/shipping" },
    { name: "დაბრუნება", href: "/returns" }
  ],
  company: [
    { name: "ჩვენს შესახებ", href: "/about" },
    { name: "ბლოგი", href: "/blog" },
    { name: "კარიერა", href: "/careers" }
  ]
}

export function Footer() {
  return (
    <footer className="bg-card pt-20 pb-10 relative overflow-hidden">
      {/* Giant Background Text */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 pointer-events-none select-none z-0">
        <span className="font-serif text-[120px] sm:text-[160px] md:text-[240px] lg:text-[300px] xl:text-[360px] font-bold text-white/20 whitespace-nowrap leading-none">
          samkaulebi
        </span>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-16">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <h2 className="font-serif text-2xl text-foreground mb-4">
              samkaulebi<span className="text-primary">.shop</span>
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              პრემიუმ სამკაულები, სუნამოები და თავის მოვლის საშუალებები. საუკეთესო ხარისხი საუკეთესო ფასად.
            </p>
            <div className="flex gap-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://t.me"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-background flex items-center justify-center text-foreground/60 hover:text-foreground boty-transition boty-shadow"
                aria-label="Telegram"
              >
                <Send className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* კატეგორიები */}
          <div>
            <h3 className="font-medium text-foreground mb-4">კატეგორიები</h3>
            <ul className="space-y-3">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/category/${category.slug}`}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/shop"
                  className="text-sm text-primary hover:text-primary/80 boty-transition"
                >
                  ყველა პროდუქტი
                </Link>
              </li>
            </ul>
          </div>

          {/* დახმარება */}
          <div>
            <h3 className="font-medium text-foreground mb-4">დახმარება</h3>
            <ul className="space-y-3">
              {footerLinks.support.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* კომპანია */}
          <div>
            <h3 className="font-medium text-foreground mb-4">კომპანია</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground boty-transition"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} samkaulebi.shop. ყველა უფლება დაცულია.
            </p>
            <div className="flex gap-6">
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                კონფიდენციალურობა
              </Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground boty-transition">
                პირობები
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
