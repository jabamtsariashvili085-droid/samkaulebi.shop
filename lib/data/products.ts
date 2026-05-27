// =============================================
// samkaulebi.shop - პროდუქტების მონაცემები
// =============================================

import type { Product } from './types'

export const products: Product[] = [
  // ===============================
  // სამკაულები - ბეჭდები
  // ===============================
  {
    id: 'ring-gold-classic',
    name: 'ოქროს კლასიკური ბეჭედი',
    nameEn: 'Classic Gold Ring',
    description: '585 სინჯის ოქროს ელეგანტური ბეჭედი, მინიმალისტური დიზაინი',
    descriptionEn: 'Elegant 585 gold ring with minimalist design',
    price: 450,
    images: ['/images/products/serum-bottles-1.png'],
    categoryId: 'jewelry',
    subcategoryId: 'rings',
    badge: 'bestseller',
    stock: 15,
    sku: 'JW-RNG-001',
    createdAt: new Date('2024-01-15'),
    featured: true,
    specifications: { 'მასალა': 'ოქრო 585', 'წონა': '3.5გ' }
  },
  {
    id: 'ring-silver-stone',
    name: 'ვერცხლის ბეჭედი თვლით',
    nameEn: 'Silver Ring with Stone',
    description: '925 სინჯის ვერცხლის ბეჭედი ცირკონის თვლით',
    descriptionEn: '925 silver ring with zirconia stone',
    price: 89,
    originalPrice: 120,
    images: ['/images/products/eye-serum-bottles.png'],
    categoryId: 'jewelry',
    subcategoryId: 'rings',
    badge: 'sale',
    stock: 28,
    sku: 'JW-RNG-002',
    createdAt: new Date('2024-02-10'),
    specifications: { 'მასალა': 'ვერცხლი 925', 'თვალი': 'ცირკონი' }
  },
  {
    id: 'ring-engagement',
    name: 'ნიშნობის ბეჭედი',
    nameEn: 'Engagement Ring',
    description: 'ბრილიანტის თვლიანი ოქროს ნიშნობის ბეჭედი',
    descriptionEn: 'Gold engagement ring with diamond',
    price: 1200,
    images: ['/images/products/amber-dropper-bottles.png'],
    categoryId: 'jewelry',
    subcategoryId: 'rings',
    badge: 'new',
    stock: 5,
    sku: 'JW-RNG-003',
    createdAt: new Date('2024-03-01'),
    featured: true,
    specifications: { 'მასალა': 'ოქრო 750', 'თვალი': 'ბრილიანტი 0.5ct' }
  },
  
  // ===============================
  // სამკაულები - ყელსაბამები
  // ===============================
  {
    id: 'necklace-pearl',
    name: 'მარგალიტის ყელსაბამი',
    nameEn: 'Pearl Necklace',
    description: 'ბუნებრივი მარგალიტის ყელსაბამი ოქროს საკეტით',
    descriptionEn: 'Natural pearl necklace with gold clasp',
    price: 320,
    images: ['/images/products/spray-bottles.png'],
    categoryId: 'jewelry',
    subcategoryId: 'necklaces',
    badge: 'bestseller',
    stock: 12,
    sku: 'JW-NCK-001',
    createdAt: new Date('2024-01-20'),
    featured: true,
    specifications: { 'მასალა': 'მარგალიტი, ოქრო 585', 'სიგრძე': '45სმ' }
  },
  {
    id: 'necklace-chain-gold',
    name: 'ოქროს ჯაჭვი',
    nameEn: 'Gold Chain',
    description: 'კლასიკური ოქროს ჯაჭვი, იტალიური სტილი',
    descriptionEn: 'Classic Italian style gold chain',
    price: 580,
    images: ['/images/products/cream-jars-colored.png'],
    categoryId: 'jewelry',
    subcategoryId: 'necklaces',
    badge: null,
    stock: 18,
    sku: 'JW-NCK-002',
    createdAt: new Date('2024-02-05'),
    specifications: { 'მასალა': 'ოქრო 585', 'სიგრძე': '50სმ', 'სტილი': 'იტალიური' }
  },
  
  // ===============================
  // სამკაულები - საყურეები
  // ===============================
  {
    id: 'earrings-diamond',
    name: 'ბრილიანტის საყურეები',
    nameEn: 'Diamond Earrings',
    description: 'ბრილიანტის თვლებიანი ოქროს საყურეები',
    descriptionEn: 'Gold earrings with diamond stones',
    price: 890,
    images: ['/images/products/tube-bottles.png'],
    categoryId: 'jewelry',
    subcategoryId: 'earrings',
    badge: 'new',
    stock: 8,
    sku: 'JW-EAR-001',
    createdAt: new Date('2024-03-10'),
    featured: true,
    specifications: { 'მასალა': 'ოქრო 750', 'თვალი': 'ბრილიანტი' }
  },
  {
    id: 'earrings-hoop-silver',
    name: 'ვერცხლის რგოლი საყურეები',
    nameEn: 'Silver Hoop Earrings',
    description: 'მინიმალისტური ვერცხლის რგოლი საყურეები',
    descriptionEn: 'Minimalist silver hoop earrings',
    price: 65,
    images: ['/images/products/jars-wooden-lid.png'],
    categoryId: 'jewelry',
    subcategoryId: 'earrings',
    badge: null,
    stock: 35,
    sku: 'JW-EAR-002',
    createdAt: new Date('2024-01-25'),
    specifications: { 'მასალა': 'ვერცხლი 925', 'დიამეტრი': '2.5სმ' }
  },
  
  // ===============================
  // სამკაულები - სამაჯურები
  // ===============================
  {
    id: 'bracelet-tennis',
    name: 'ტენისის სამაჯური',
    nameEn: 'Tennis Bracelet',
    description: 'ბრილიანტებით მოჭედილი ტენისის სამაჯური',
    descriptionEn: 'Tennis bracelet studded with diamonds',
    price: 1500,
    images: ['/images/products/pump-bottles-lavender.png'],
    categoryId: 'jewelry',
    subcategoryId: 'bracelets',
    badge: 'bestseller',
    stock: 4,
    sku: 'JW-BRC-001',
    createdAt: new Date('2024-02-15'),
    featured: true,
    specifications: { 'მასალა': 'ოქრო 750', 'თვლები': 'ბრილიანტი 2ct' }
  },
  {
    id: 'bracelet-charm',
    name: 'ჩარმ სამაჯური',
    nameEn: 'Charm Bracelet',
    description: 'ვერცხლის სამაჯური დეკორატიული ჩარმებით',
    descriptionEn: 'Silver bracelet with decorative charms',
    price: 145,
    originalPrice: 180,
    images: ['/images/products/pump-bottles-cream.png'],
    categoryId: 'jewelry',
    subcategoryId: 'bracelets',
    badge: 'sale',
    stock: 22,
    sku: 'JW-BRC-002',
    createdAt: new Date('2024-01-30'),
    specifications: { 'მასალა': 'ვერცხლი 925', 'სიგრძე': '18სმ' }
  },
  
  // ===============================
  // სუნამოები - ქალის
  // ===============================
  {
    id: 'perfume-floral-dream',
    name: 'Floral Dream',
    nameEn: 'Floral Dream',
    description: 'ფლორალური არომატი ვარდისა და ჟასმინის ნოტებით',
    descriptionEn: 'Floral fragrance with rose and jasmine notes',
    price: 180,
    images: ['/images/products/serum-bottles-1.png'],
    categoryId: 'fragrances',
    subcategoryId: 'womens-perfumes',
    badge: 'bestseller',
    stock: 45,
    sku: 'FR-WMN-001',
    createdAt: new Date('2024-01-05'),
    featured: true,
    specifications: { 'მოცულობა': '100მლ', 'ტიპი': 'Eau de Parfum' }
  },
  {
    id: 'perfume-midnight-rose',
    name: 'Midnight Rose',
    nameEn: 'Midnight Rose',
    description: 'მისტიური საღამოს არომატი შავი ვარდის ესენციით',
    descriptionEn: 'Mysterious evening fragrance with black rose essence',
    price: 220,
    images: ['/images/products/amber-dropper-bottles.png'],
    categoryId: 'fragrances',
    subcategoryId: 'womens-perfumes',
    badge: 'new',
    stock: 30,
    sku: 'FR-WMN-002',
    createdAt: new Date('2024-03-05'),
    specifications: { 'მოცულობა': '75მლ', 'ტიპი': 'Eau de Parfum Intense' }
  },
  {
    id: 'perfume-spring-bloom',
    name: 'Spring Bloom',
    nameEn: 'Spring Bloom',
    description: 'სასიამოვნო გაზაფხულის არომატი ყვავილების ნოტებით',
    descriptionEn: 'Pleasant spring fragrance with floral notes',
    price: 135,
    originalPrice: 165,
    images: ['/images/products/spray-bottles.png'],
    categoryId: 'fragrances',
    subcategoryId: 'womens-perfumes',
    badge: 'sale',
    stock: 55,
    sku: 'FR-WMN-003',
    createdAt: new Date('2024-02-20'),
    specifications: { 'მოცულობა': '50მლ', 'ტიპი': 'Eau de Toilette' }
  },
  
  // ===============================
  // სუნამოები - კაცის
  // ===============================
  {
    id: 'perfume-ocean-breeze',
    name: 'Ocean Breeze',
    nameEn: 'Ocean Breeze',
    description: 'სასიამოვნო ზღვის არომატი ციტრუსის ნოტებით',
    descriptionEn: 'Pleasant ocean fragrance with citrus notes',
    price: 160,
    images: ['/images/products/eye-serum-bottles.png'],
    categoryId: 'fragrances',
    subcategoryId: 'mens-perfumes',
    badge: 'bestseller',
    stock: 40,
    sku: 'FR-MEN-001',
    createdAt: new Date('2024-01-10'),
    featured: true,
    specifications: { 'მოცულობა': '100მლ', 'ტიპი': 'Eau de Toilette' }
  },
  {
    id: 'perfume-leather-wood',
    name: 'Leather & Wood',
    nameEn: 'Leather & Wood',
    description: 'მასკულინური არომატი ტყავისა და ხის ნოტებით',
    descriptionEn: 'Masculine fragrance with leather and wood notes',
    price: 195,
    images: ['/images/products/cream-jars-colored.png'],
    categoryId: 'fragrances',
    subcategoryId: 'mens-perfumes',
    badge: 'new',
    stock: 25,
    sku: 'FR-MEN-002',
    createdAt: new Date('2024-03-08'),
    specifications: { 'მოცულობა': '75მლ', 'ტიპი': 'Eau de Parfum' }
  },
  
  // ===============================
  // სუნამოები - უნისექსი
  // ===============================
  {
    id: 'perfume-pure-musk',
    name: 'Pure Musk',
    nameEn: 'Pure Musk',
    description: 'უნივერსალური მუშკის არომატი ყველასთვის',
    descriptionEn: 'Universal musk fragrance for everyone',
    price: 175,
    images: ['/images/products/tube-bottles.png'],
    categoryId: 'fragrances',
    subcategoryId: 'unisex',
    badge: 'bestseller',
    stock: 60,
    sku: 'FR-UNI-001',
    createdAt: new Date('2024-01-15'),
    featured: true,
    specifications: { 'მოცულობა': '100მლ', 'ტიპი': 'Eau de Parfum' }
  },
  {
    id: 'perfume-white-amber',
    name: 'White Amber',
    nameEn: 'White Amber',
    description: 'თბილი ქარვისა და ვანილის არომატი',
    descriptionEn: 'Warm amber and vanilla fragrance',
    price: 210,
    images: ['/images/products/jars-wooden-lid.png'],
    categoryId: 'fragrances',
    subcategoryId: 'unisex',
    badge: null,
    stock: 35,
    sku: 'FR-UNI-002',
    createdAt: new Date('2024-02-25'),
    specifications: { 'მოცულობა': '75მლ', 'ტიპი': 'Eau de Parfum Intense' }
  },
  
  // ===============================
  // თავის მოვლა - შამპუნები
  // ===============================
  {
    id: 'shampoo-repair',
    name: 'აღმდგენი შამპუნი',
    nameEn: 'Repair Shampoo',
    description: 'დაზიანებული თმის აღმდგენი შამპუნი კერატინით',
    descriptionEn: 'Repairing shampoo with keratin for damaged hair',
    price: 28,
    images: ['/images/products/pump-bottles-lavender.png'],
    categoryId: 'haircare',
    subcategoryId: 'shampoos',
    badge: 'bestseller',
    stock: 80,
    sku: 'HC-SHP-001',
    createdAt: new Date('2024-01-08'),
    featured: true,
    specifications: { 'მოცულობა': '250მლ', 'ტიპი': 'დაზიანებული თმისთვის' }
  },
  {
    id: 'shampoo-volume',
    name: 'მოცულობის შამპუნი',
    nameEn: 'Volume Shampoo',
    description: 'თხელი თმისთვის მოცულობის მიმცემი შამპუნი',
    descriptionEn: 'Volumizing shampoo for thin hair',
    price: 24,
    images: ['/images/products/pump-bottles-cream.png'],
    categoryId: 'haircare',
    subcategoryId: 'shampoos',
    badge: null,
    stock: 95,
    sku: 'HC-SHP-002',
    createdAt: new Date('2024-02-12'),
    specifications: { 'მოცულობა': '300მლ', 'ტიპი': 'თხელი თმისთვის' }
  },
  {
    id: 'shampoo-color-protect',
    name: 'ფერის დამცავი შამპუნი',
    nameEn: 'Color Protect Shampoo',
    description: 'შეღებილი თმის ფერის შემანარჩუნებელი შამპუნი',
    descriptionEn: 'Color protecting shampoo for dyed hair',
    price: 32,
    originalPrice: 40,
    images: ['/images/products/serum-bottles-1.png'],
    categoryId: 'haircare',
    subcategoryId: 'shampoos',
    badge: 'sale',
    stock: 65,
    sku: 'HC-SHP-003',
    createdAt: new Date('2024-01-22'),
    specifications: { 'მოცულობა': '250მლ', 'ტიპი': 'შეღებილი თმისთვის' }
  },
  
  // ===============================
  // თავის მოვლა - თმის ზეთები
  // ===============================
  {
    id: 'oil-argan',
    name: 'არგანის ზეთი',
    nameEn: 'Argan Oil',
    description: 'მაროკოს არგანის ბუნებრივი ზეთი თმისთვის',
    descriptionEn: 'Natural Moroccan argan oil for hair',
    price: 45,
    images: ['/images/products/amber-dropper-bottles.png'],
    categoryId: 'haircare',
    subcategoryId: 'hair-oils',
    badge: 'bestseller',
    stock: 70,
    sku: 'HC-OIL-001',
    createdAt: new Date('2024-01-12'),
    featured: true,
    specifications: { 'მოცულობა': '50მლ', 'შემადგენლობა': '100% არგანის ზეთი' }
  },
  {
    id: 'oil-coconut-hair',
    name: 'ქოქოსის თმის ზეთი',
    nameEn: 'Coconut Hair Oil',
    description: 'მკვებავი ქოქოსის ზეთი თმის მოვლისთვის',
    descriptionEn: 'Nourishing coconut oil for hair care',
    price: 35,
    images: ['/images/products/eye-serum-bottles.png'],
    categoryId: 'haircare',
    subcategoryId: 'hair-oils',
    badge: 'new',
    stock: 85,
    sku: 'HC-OIL-002',
    createdAt: new Date('2024-03-02'),
    specifications: { 'მოცულობა': '100მლ', 'შემადგენლობა': 'ქოქოსის ზეთი' }
  },
  
  // ===============================
  // თავის მოვლა - სხეულის მოვლა
  // ===============================
  {
    id: 'body-lotion-shea',
    name: 'შეას კარაქის ლოსიონი',
    nameEn: 'Shea Butter Lotion',
    description: 'დამატენიანებელი სხეულის ლოსიონი შეას კარაქით',
    descriptionEn: 'Moisturizing body lotion with shea butter',
    price: 38,
    images: ['/images/products/spray-bottles.png'],
    categoryId: 'haircare',
    subcategoryId: 'body-care',
    badge: 'bestseller',
    stock: 100,
    sku: 'HC-BDY-001',
    createdAt: new Date('2024-01-18'),
    featured: true,
    specifications: { 'მოცულობა': '200მლ', 'ტიპი': 'დამატენიანებელი' }
  },
  {
    id: 'body-scrub-coffee',
    name: 'ყავის სკრაბი',
    nameEn: 'Coffee Scrub',
    description: 'ანტიცელულიტური ყავის სხეულის სკრაბი',
    descriptionEn: 'Anti-cellulite coffee body scrub',
    price: 32,
    originalPrice: 42,
    images: ['/images/products/cream-jars-colored.png'],
    categoryId: 'haircare',
    subcategoryId: 'body-care',
    badge: 'sale',
    stock: 55,
    sku: 'HC-BDY-002',
    createdAt: new Date('2024-02-08'),
    specifications: { 'მოცულობა': '250გ', 'ტიპი': 'სკრაბი' }
  },
  {
    id: 'body-oil-rose',
    name: 'ვარდის სხეულის ზეთი',
    nameEn: 'Rose Body Oil',
    description: 'მომაკვდავი სხეულის ზეთი ვარდის ესენციით',
    descriptionEn: 'Nourishing body oil with rose essence',
    price: 48,
    images: ['/images/products/tube-bottles.png'],
    categoryId: 'haircare',
    subcategoryId: 'body-care',
    badge: 'new',
    stock: 40,
    sku: 'HC-BDY-003',
    createdAt: new Date('2024-03-12'),
    specifications: { 'მოცულობა': '100მლ', 'არომატი': 'ვარდი' }
  }
]

// პროდუქტის მიღება ID-ით
export function getProductById(id: string): Product | undefined {
  return products.find(p => p.id === id)
}

// პროდუქტების მიღება კატეგორიის მიხედვით
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId)
}

// პროდუქტების მიღება ქვეკატეგორიის მიხედვით
export function getProductsBySubcategory(categoryId: string, subcategoryId: string): Product[] {
  return products.filter(p => p.categoryId === categoryId && p.subcategoryId === subcategoryId)
}

// Featured პროდუქტების მიღება
export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.featured)
}

// პროდუქტების ძიება
export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase()
  return products.filter(p => 
    p.name.toLowerCase().includes(lowerQuery) ||
    p.nameEn.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery)
  )
}

// ბეჯის მიხედვით პროდუქტები
export function getProductsByBadge(badge: 'new' | 'bestseller' | 'sale'): Product[] {
  return products.filter(p => p.badge === badge)
}

// მსგავსი პროდუქტების მიღება (Related Products)
export function getRelatedProducts(currentId: string, categoryId: string, limit = 4): Product[] {
  return products
    .filter(p => p.categoryId === categoryId && p.id !== currentId)
    .slice(0, limit)
}
