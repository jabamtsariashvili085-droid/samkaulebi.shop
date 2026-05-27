const R2_BASE_URL = process.env.NEXT_PUBLIC_R2_URL ?? ''

export function r2(path: string): string {
  if (!path) return '/placeholder.svg'
  if (path.startsWith('http')) return path
  const clean = path.startsWith('/') ? path.slice(1) : path
  return `${R2_BASE_URL}/${clean}`
}

// r2('products/ring-gold-classic-1.jpg')
// → https://pub-xxx.r2.dev/products/ring-gold-classic-1.jpg
