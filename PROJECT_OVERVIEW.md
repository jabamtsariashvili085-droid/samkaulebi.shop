# 🌟 Project Overview: samkaulebi.shop

> Last updated: **2026-05-27**

## 📖 Introduction
**samkaulebi.shop** is a production-deployed Georgian e-commerce platform for jewelry (სამკაულები), fragrances (სუნამოები), and personal care products (თავის მოვლა). The UI follows a premium, luxury aesthetic and the full stack — frontend, admin panel, image pipeline, and database — is wired up and live.

Originally scaffolded from a **v0.app** template and progressively rebuilt into a real product.

---

## 🛠 Tech Stack

### Frontend
- **Next.js 15** (App Router) + **React 19**
- **Tailwind CSS v4** with native PostCSS
- **Radix UI** primitives (Dialog, Accordion, Checkbox, etc.)
- **Lucide React** icons
- **react-hook-form** + **zod** for forms & validation
- **embla-carousel-react** for carousels
- Fonts: **DM Sans** (UI) + **Playfair Display** (luxury headings)

### Backend & Infrastructure
- **Supabase** (PostgreSQL 17) — database, RLS, auth
- **Cloudflare R2** — image storage with presigned URL uploads
- **Sharp** — server-side image processing (WebP / JPEG / PNG)
- **GitHub** → **Vercel** continuous deployment pipeline
- **JSZip** — bulk download in the image optimizer

### Live URLs
- **Production:** `samkaulebi-shop.vercel.app` (custom domain `samkaulebi.shop` planned)
- **Repo:** `github.com/jabamtsariashvili085-droid/samkaulebi.shop` (public, Hobby plan)
- **Supabase project:** `albjycaewmvxworrhdsh` (region: West EU / Ireland)

---

## 📂 Directory Structure

```
samkaulebi.shop/
├── app/
│   ├── (storefront)
│   │   ├── page.tsx                  # Homepage
│   │   ├── shop/                     # Catalog
│   │   ├── category/[slug]/          # Category & subcategory pages
│   │   ├── product/[id]/             # Product detail
│   │   └── checkout/                 # Checkout form
│   ├── admin/                        # Admin panel (login required)
│   │   ├── page.tsx                  # Dashboard
│   │   ├── products/                 # CRUD products
│   │   ├── orders/                   # View & update orders
│   │   ├── categories/               # Manage categories
│   │   └── optimizer/                # Batch image optimizer
│   └── api/
│       ├── admin/products/           # Service-role product writes
│       ├── admin/upload/             # R2 presigned upload
│       ├── admin/optimize/           # Sharp pipeline
│       └── orders/                   # Public order creation
├── components/
│   ├── boty/                         # Storefront sections
│   └── ui/                           # Shared UI primitives
├── lib/
│   ├── supabase/                     # client, server, admin (service_role)
│   ├── r2/                           # R2 SDK wrapper
│   └── data/                         # Legacy static data (being phased out)
└── public/                           # Static assets
```

---

## 💾 Database Schema (Supabase)

All tables have **RLS enabled**. Writes go through API routes using the **service_role admin client** (RLS bypassed). Reads (categories, subcategories, products) are exposed to `anon`/`authenticated` via `SELECT` policies.

```
categories  ──1:N─→  subcategories      [CASCADE delete]
     └──────1:N─→  products              [NO ACTION]
                       └──1:N─→ order_items  [SET NULL on product delete — preserves order history]
                                   └─N:1─→ orders  [CASCADE delete]
```

### Constraints in place (added 2026-05-27)
- `orders.status` CHECK — allowed values: `pending`, `confirmed`, `shipped`, `delivered`, `cancelled`
- Non-negative price guards: `products.price`, `products.original_price`, `orders.subtotal`, `orders.total`, `order_items.price`
- `order_items.quantity > 0`
- `products.stock` NOT NULL (default 0)
- Unique: `categories.slug`, `products.sku`, `(subcategories.category_id, slug)`

### Indexes
- All PKs (UUID for orders/order_items, text for products/categories/subcategories)
- `orders.created_at DESC` — admin order list sort
- `orders.status` — future filtering
- `order_items.order_id` — JOIN to orders
- `order_items.product_id` — JOIN to products (added 2026-05-27)
- `products.category_id`, `products.subcategory_id`, `products.featured` (partial)

---

## 🔐 Auth & Security

- **Admin login** via Supabase Auth (`/admin/login`).
- **RLS pattern:** `anon`/`authenticated` get SELECT on public catalog tables only. All writes (products, orders, categories) go through Next.js API routes that use the `service_role` admin client.
- **Service-role key** is server-only (`SUPABASE_SERVICE_ROLE_KEY` — not exposed via `NEXT_PUBLIC_`).
- **R2 access:** PUT via short-lived presigned URLs minted on the server.

---

## 🚀 Key Features Live Today

### Storefront
- Responsive header with mega-dropdowns, scroll-aware glass effect, search overlay (live results across products)
- Hero section with luxury styling, premium badge, key stats
- Newsletter section with background banner image
- Product grid, category browsing, product detail pages
- Shopping cart drawer (in-memory via React Context)
- Checkout form → saves real `orders` + `order_items` to Supabase
- Footer + analytics (`@vercel/analytics`)

### Admin Panel (`/admin`)
- **Dashboard** — product / order counts, recent orders
- **Products CRUD** — full create/edit/delete, multi-image upload to R2
- **Orders** — view all orders + items, change status inline
- **Categories** — view & edit category tree
- **Image Optimizer** — batch upload, Sharp-powered WebP/JPEG/PNG conversion, ZIP download, bulk push to R2

All admin pages use `export const dynamic = 'force-dynamic'` so fresh DB data is always rendered.

---

## 🧱 Today's Work (2026-05-27)

### Infrastructure
- Connected GitHub repo and Vercel project, fixed lockfile conflict (pnpm → npm), imported env vars, made repo public to unblock Hobby-plan deploys
- Connected Supabase MCP for direct DB administration

### UX redesign (senior pass)
- Header: switched to CSS Grid 3-column layout to fix logo/nav overlap, added scroll-aware glass background
- Hero: new headline & badge, cleaner gradient, three premium stats, scroll indicator animation
- Newsletter: iterated dark green → cream → gold → final banner-background design

### Admin panel
- Built Image Optimizer module (single image → expanded to batch with ZIP download & bulk R2 upload)
- Added `force-dynamic` to all admin server pages (Dashboard, Products, Orders, Categories) — they were being statically cached at build time so fresh data never showed

### API & data
- Fixed RLS-blocked product creation by routing all admin writes through service-role API endpoints
- Same fix applied to `/api/orders` (was failing on checkout due to missing SELECT policy needed by `INSERT ... RETURNING`)

### Database hardening
- Added 5 CHECK constraints (non-negative prices, status enum)
- Changed `order_items.product_id` FK to `ON DELETE SET NULL` — preserves order history when products are removed
- Added `order_items.product_id` index (resolved performance advisor)
- `products.stock` set NOT NULL
- Dropped unused "always true" anon insert policies on `orders` / `order_items` (resolved security advisor warnings)

---

## 🚧 Known Pending Work

### Data
- **The 25 products currently in DB are v0.dev placeholders** — to be deleted and replaced with real products
- Storefront pages (`/shop`, `/category/[slug]`, `/product/[id]`, homepage featured) still read from static `lib/data/` files — need to be wired to Supabase

### Features
- Custom domain (`samkaulebi.shop`) — to be connected to Vercel
- Payment gateway (Stripe or TBC/BoG e-commerce API) — checkout currently records cash-on-delivery only
- Cart persistence (localStorage or DB-backed) — currently in-memory only
- User accounts (sign up, order history, wishlists) — admin auth exists, customer auth not yet
- Video optimization — image optimizer is image-only; FFmpeg CLI suggested for local video work
- Dynamic SEO metadata + Open Graph for product pages

### Nice-to-haves
- Enable Supabase Auth "Leaked Password Protection" if customer accounts are added
- Drop unused indexes if they stay unused after data grows
