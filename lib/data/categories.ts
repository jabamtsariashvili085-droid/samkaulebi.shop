// =============================================
// samkaulebi.shop - კატეგორიების მონაცემები
// =============================================

import type { Category, CategorySlug, SubcategorySlug } from './types'

export const categories: Category[] = [
  {
    id: 'cat-jewelry',
    name: 'სამკაულები',
    nameEn: 'Jewelry',
    slug: 'jewelry',
    icon: 'gem',
    image: '/images/categories/jewelry.jpg',
    description: 'უნიკალური და ელეგანტური სამკაულების კოლექცია',
    subcategories: [
      {
        id: 'sub-rings',
        name: 'ბეჭდები',
        nameEn: 'Rings',
        slug: 'rings',
        description: 'ოქროს და ვერცხლის ბეჭდების კოლექცია'
      },
      {
        id: 'sub-necklaces',
        name: 'ყელსაბამები',
        nameEn: 'Necklaces',
        slug: 'necklaces',
        description: 'თვლებიანი და უბრალო ყელსაბამები'
      },
      {
        id: 'sub-earrings',
        name: 'საყურეები',
        nameEn: 'Earrings',
        slug: 'earrings',
        description: 'სხვადასხვა სტილის საყურეები'
      },
      {
        id: 'sub-bracelets',
        name: 'სამაჯურები',
        nameEn: 'Bracelets',
        slug: 'bracelets',
        description: 'ელეგანტური სამაჯურების კოლექცია'
      }
    ]
  },
  {
    id: 'cat-fragrances',
    name: 'სუნამოები',
    nameEn: 'Fragrances',
    slug: 'fragrances',
    icon: 'sparkles',
    image: '/images/categories/fragrances.jpg',
    description: 'პრემიუმ სუნამოების კოლექცია ქალებისა და კაცებისთვის',
    subcategories: [
      {
        id: 'sub-womens-perfumes',
        name: 'ქალის სუნამოები',
        nameEn: "Women's Perfumes",
        slug: 'womens-perfumes',
        description: 'ქალის სუნამოების კოლექცია'
      },
      {
        id: 'sub-mens-perfumes',
        name: 'კაცის სუნამოები',
        nameEn: "Men's Perfumes",
        slug: 'mens-perfumes',
        description: 'კაცის სუნამოების კოლექცია'
      },
      {
        id: 'sub-unisex',
        name: 'უნისექსი',
        nameEn: 'Unisex',
        slug: 'unisex',
        description: 'უნივერსალური სუნამოები'
      }
    ]
  },
  {
    id: 'cat-haircare',
    name: 'თავის მოვლა',
    nameEn: 'Hair Care',
    slug: 'haircare',
    icon: 'droplets',
    image: '/images/categories/haircare.jpg',
    description: 'თმისა და სხეულის მოვლის საშუალებები',
    subcategories: [
      {
        id: 'sub-shampoos',
        name: 'შამპუნები',
        nameEn: 'Shampoos',
        slug: 'shampoos',
        description: 'პროფესიონალური შამპუნები'
      },
      {
        id: 'sub-hair-oils',
        name: 'თმის ზეთები',
        nameEn: 'Hair Oils',
        slug: 'hair-oils',
        description: 'მკვებავი თმის ზეთები'
      },
      {
        id: 'sub-body-care',
        name: 'სხეულის მოვლა',
        nameEn: 'Body Care',
        slug: 'body-care',
        description: 'სხეულის მოვლის საშუალებები'
      }
    ]
  }
]

// კატეგორიის მიღება slug-ით
export function getCategoryBySlug(slug: CategorySlug): Category | undefined {
  return categories.find(cat => cat.slug === slug)
}

// ქვეკატეგორიის მიღება slug-ით
export function getSubcategoryBySlug(
  categorySlug: CategorySlug, 
  subcategorySlug: SubcategorySlug
): { category: Category; subcategory: Category['subcategories'][0] } | undefined {
  const category = getCategoryBySlug(categorySlug)
  if (!category) return undefined
  
  const subcategory = category.subcategories.find(sub => sub.slug === subcategorySlug)
  if (!subcategory) return undefined
  
  return { category, subcategory }
}

// ყველა ქვეკატეგორიის მიღება
export function getAllSubcategories() {
  return categories.flatMap(cat => 
    cat.subcategories.map(sub => ({
      ...sub,
      categoryId: cat.slug,
      categoryName: cat.name
    }))
  )
}

// ბრტყელი სია ქვეკატეგორიების — product detail page-სთვის
export const subcategories = categories.flatMap(cat =>
  cat.subcategories.map(sub => ({ ...sub, categoryId: cat.slug, categoryName: cat.name }))
)

// კატეგორიის მიღება ID (slug) -ით
export function getCategoryById(id: string) {
  return categories.find(cat => cat.slug === id || cat.id === id)
}

// ქვეკატეგორიების მიღება მშობელი კატეგორიის ID-ით
export function getSubcategoriesByParent(categoryId: string) {
  const category = categories.find(c => c.id === categoryId || c.slug === categoryId)
  return category?.subcategories ?? []
}

