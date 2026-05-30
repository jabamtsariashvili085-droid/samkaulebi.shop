// =============================================
// samkaulebi.shop - Type Definitions
// =============================================

// კატეგორიების ტიპები
export type CategorySlug = 'jewelry' | 'fragrances' | 'haircare'
export type SubcategorySlug = 
  // სამკაულები
  | 'rings' | 'necklaces' | 'earrings' | 'bracelets'
  // სუნამოები
  | 'womens-perfumes' | 'mens-perfumes' | 'unisex'
  // თავის მოვლა
  | 'shampoos' | 'hair-oils' | 'body-care'

// კატეგორიის ინტერფეისი
export interface Subcategory {
  id: string
  name: string
  nameEn: string
  slug: SubcategorySlug
  description?: string
}

export interface Category {
  id: string
  name: string
  nameEn: string
  slug: CategorySlug
  icon: string
  image: string
  description: string
  subcategories: Subcategory[]
}

// პროდუქტის ბეჯის ტიპი
export type ProductBadge = 'new' | 'bestseller' | 'sale' | null

// პროდუქტის ინტერფეისი
export interface Product {
  id: string
  name: string
  nameEn: string
  description: string
  descriptionEn: string
  price: number
  originalPrice?: number
  images: string[]
  categoryId: CategorySlug
  subcategoryId: SubcategorySlug
  badge: ProductBadge
  stock: number
  sku: string
  createdAt: Date
  featured?: boolean
  specifications?: Record<string, string>
  imageAlt?: string
  tags?: string[]
}

// მომხმარებლის ინტერფეისი
export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: Address
  createdAt: Date
}

// მისამართის ინტერფეისი
export interface Address {
  street: string
  city: string
  postalCode?: string
  country: string
}

// შეკვეთის სტატუსის ტიპი
export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'

// შეკვეთის ელემენტის ინტერფეისი
export interface OrderItem {
  productId: string
  productName: string
  quantity: number
  price: number
  image: string
}

// შეკვეთის ინტერფეისი
export interface Order {
  id: string
  orderNumber: string
  customer: Customer
  items: OrderItem[]
  status: OrderStatus
  subtotal: number
  shipping: number
  total: number
  notes?: string
  createdAt: Date
  updatedAt: Date
}

// Dashboard სტატისტიკის ინტერფეისი
export interface DashboardStats {
  totalOrders: number
  totalRevenue: number
  totalProducts: number
  totalCustomers: number
  ordersChange: number
  revenueChange: number
  productsChange: number
  customersChange: number
}
