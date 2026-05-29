# samkaulebi.shop — Feature Roadmap & Product Brief

> დოკუმენტი შედგენილია Claude Code-სთვის სრული კონტექსტის მისაწოდებლად.
> პროექტი: Georgian luxury e-commerce — სამკაულები / სუნამოები / თავის მოვლა

---

## 🧱 პროექტის კონტექსტი

### Tech Stack
- **Frontend:** Next.js 15 (App Router) + React 19 + Tailwind CSS v4
- **Backend:** Supabase (PostgreSQL 17) + RLS + service_role API routes
- **Storage:** Cloudflare R2 (presigned URL uploads) + Sharp (image processing)
- **Deploy:** GitHub → Vercel (Hobby plan, continuous deployment)
- **Auth:** Supabase Auth — admin only, customer auth არ არის

### სამუშაო სტატუსი
- ✅ Admin panel (products CRUD, orders, categories, image optimizer)
- ✅ Storefront shell (header, hero, cart drawer, checkout → Supabase)
- ✅ DB schema hardened (constraints, indexes, RLS policies)
- ⚠️ Storefront კვლავ `lib/data/` სტატიკურ ფაილებს კითხულობს — Supabase-ზე გადაყვანა საჭიროა
- ⚠️ Checkout: cash-on-delivery only, გადახდის სისტემა არ არის
- ⚠️ Cart: in-memory only (React Context), persistence არ არის

### DB Schema (მოკლედ)
```
categories ──1:N──> subcategories ──1:N──> products ──1:N──> order_items ──N:1──> orders
```

---

## 🗺️ Feature Roadmap — პრიორიტეტების მიხედვით

---

## ✅ TIER 0 — Foundation (სანამ სხვა რამეს ააშენებ)

### 0.1 Supabase Wiring — Storefront
**რა:** `lib/data/` სტატიკური ფაილების ამოღება. ყველა storefront გვერდი Supabase-ს კითხულობდეს.
**სად:** `app/(storefront)/shop/`, `category/[slug]/`, `product/[id]/`, homepage featured section
**როგორ:** `supabase.from('products').select(...)` server components-ში, `export const dynamic = 'force-dynamic'`

### 0.2 Cart Persistence
**რა:** In-memory cart → localStorage (minimum) ან Supabase `carts` table (authenticated users)
**სად:** `components/boty/CartDrawer` + `CartContext`
**DB (optional):** `carts(id, session_id, product_id, quantity, created_at)`

### 0.3 Custom Domain
**რა:** `samkaulebi.shop` → Vercel DNS configuration
**სად:** Vercel Dashboard → Domains

### 0.4 Payment Gateway
**რა:** BOG ან TBC e-commerce API (Georgian market), Stripe (international)
**სად:** `/api/orders/` route გაფართოება, Checkout form
**Priority:** BOG პირველი — ქართველი მომხმარებელი ადგილობრივ ბანკს ენდობა

---

## 🔴 TIER 1 — Conversion (პირდაპირ გაყიდვებზე მოქმედებს)

### 1.1 Product Reviews & Ratings ⭐
**რა:** მომხმარებელი ტოვებს review-ს (1-5 ვარსკვლავი + ტექსტი). ჩნდება product detail გვერდზე.
**DB:**
```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  order_id uuid REFERENCES orders(id),  -- verified purchase only
  rating int CHECK (rating BETWEEN 1 AND 5),
  body text,
  author_name text,
  created_at timestamptz DEFAULT now()
);
```
**UI:** Star rating widget + review list on `/product/[id]`, aggregate rating badge on product cards
**Admin:** Review moderation panel (approve/reject)

### 1.2 Wishlist / "გულის" ღილაკი ❤️
**რა:** Heart icon ყოველ პროდუქტზე. Wishlist გვერდი.
**DB:**
```sql
CREATE TABLE wishlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text,  -- anonymous
  user_id uuid REFERENCES auth.users,  -- authenticated (future)
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);
```
**UI:** Heart toggle on product cards + `/wishlist` dedicated page
**Behavior:** Anonymous (localStorage fallback) + auth sync

### 1.3 Gift Wrapping + Gift Message 🎁
**რა:** Checkout-ზე checkbox "საჩუქრად შეფუთვა" + text field "შეტყობინება"
**DB:** `orders` table-ზე დამატება:
```sql
ALTER TABLE orders ADD COLUMN gift_wrap boolean DEFAULT false;
ALTER TABLE orders ADD COLUMN gift_message text;
ALTER TABLE orders ADD COLUMN gift_wrap_fee numeric DEFAULT 0;
```
**UI:** Checkout form-ში collapsible section, admin orders view-ში ჩანდეს

### 1.4 Abandoned Cart Recovery 📧
**რა:** მომხმარებელმა კალათაში ჩადო, არ იყიდა → email 1 საათის შემდეგ
**Stack:** Resend API + Supabase Edge Function (cron) ან Webhook
**Flow:**
1. Cart item-ი ემატება → `carts` table-ში `updated_at` timestamp
2. Edge Function 1 საათში run: unsent reminders for abandoned carts
3. Email: "კალათაში გელოდება..." + product სურათები + CTA

### 1.5 Stock Scarcity + "Back in Stock" Alert 📦
**რა:** Product page-ზე "მხოლოდ 3 დარჩა!" badge (`products.stock < 5`). Out-of-stock: "მარაგი ამოიწურა" + email გამოწერა.
**DB:**
```sql
CREATE TABLE stock_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text REFERENCES products(id) ON DELETE CASCADE,
  email text NOT NULL,
  notified_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```
**Trigger:** Stock update → Edge Function → გაუგზავნე registered emails

### 1.6 Discount Codes / Promo System 🏷️
**DB:**
```sql
CREATE TABLE discount_codes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text CHECK (type IN ('percent', 'fixed')),
  value numeric NOT NULL,
  min_order numeric DEFAULT 0,
  max_uses int,
  used_count int DEFAULT 0,
  expires_at timestamptz,
  active boolean DEFAULT true
);
```
**UI:** Checkout-ზე promo code field + validation API route
**Admin:** Code generator panel

---

## 🟡 TIER 2 — Retention (მომხმარებელი ბრუნდება)

### 2.1 Customer Accounts + Order History 👤
**რა:** Sign up / Login for customers (Supabase Auth-ს customer role). Order history გვერდი.
**Routes:** `/account/login`, `/account/register`, `/account/orders`, `/account/wishlist`
**DB:** `orders.user_id` column (nullable, for guest orders backward compat)
**Note:** Admin auth უკვე გაქვს — customer auth separate role-ით

### 2.2 Email Marketing Automation 📨
**რა:** Transactional + marketing emails
**Stack:** Resend ან Brevo (Next.js-თან native integration)
**Flows:**
- Welcome series (registration) → 3 email sequence
- Order confirmation → immediate
- Shipping update → status change trigger
- Post-purchase follow-up (7 days later → review request)
- Birthday greeting (თუ date of birth ვინახავთ)
- Smart Restock Reminder: "X სუნამო 3 თვის წინ იყიდე — შესაძლოა გამოგეცალა?"

### 2.3 Loyalty / Points სისტემა 🏆
**რა:** ყოველ ყიდვაზე ქულები → ფასდაკლება ან უფასო shipping
**DB:**
```sql
CREATE TABLE loyalty_points (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  order_id uuid REFERENCES orders(id),
  points int NOT NULL,
  type text CHECK (type IN ('earned', 'redeemed', 'expired')),
  created_at timestamptz DEFAULT now()
);
```
**Logic:** 1 GEL = 1 ქულა, 100 ქულა = 5 GEL ფასდაკლება
**UI:** Account dashboard-ში ქულების ბალანსი + history

### 2.4 "Recently Viewed" + "You Might Also Like" 🔄
**რა:** Browse history (localStorage) → related products section
**UI:** Product page-ზე "ბოლოს ნანახი" carousel + "მსგავსი პროდუქტები" (same category/subcategory)
**Advanced:** Claude API-ით AI-powered recommendations (ნანახი + კალათა + კატეგორია → suggestions)

### 2.5 Referral Program 🤝
**რა:** "მოიწვიე მეგობარი — ორივეს 10% ფასდაკლება"
**DB:**
```sql
CREATE TABLE referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid REFERENCES auth.users,
  referred_email text,
  status text CHECK (status IN ('pending', 'signed_up', 'purchased')),
  reward_issued boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```
**UI:** Account page-ში unique referral link + stats

---

## 🟢 TIER 3 — Premium UX (Luxury Feeling)

### 3.1 Fragrance Scent Quiz / AI Stylist 🧴
**რა:** "იპოვე შენი სუნამო" — 5 კითხვა (occasion, mood, preferred notes, season, budget) → recommended products
**Stack:** Claude API (`claude-sonnet-4-20250514`) + quiz UI
**Route:** `/api/quiz/recommend` — POST quiz answers → Claude → product IDs
**UI:** `/quiz` dedicated page, also accessible from homepage hero

### 3.2 "Shop by Occasion / Mood" ფილტრი 🎯
**რა:** Navigation-ში და shop გვერდზე: "საჩუქრად", "საქორწინოდ", "ყოველდღიური", "სეზონური"
**DB:** `products` table-ზე `tags text[]` column ან separate `product_tags` junction table
**UI:** Tag filter chips on `/shop`

### 3.3 Fragrance Notes Breakdown 🌸
**რა:** სუნამოს product page-ზე top/heart/base notes ვიზუალური breakdown
**DB:**
```sql
ALTER TABLE products ADD COLUMN fragrance_notes jsonb;
-- {"top": ["bergamot", "lemon"], "heart": ["rose", "jasmine"], "base": ["musk", "sandalwood"]}
```
**UI:** Three-tier pyramid visualization, note tags with Georgian სახელები

### 3.4 Product Video / 360° View 🎥
**რა:** Product images-ს გვerdზე video autoplay ან 360° rotation
**Storage:** R2-ში video upload (admin optimizer გაფართოება)
**UI:** Video thumbnail in image gallery, autoplay on hover
**Note:** `products` table-ზე `video_url text` column

### 3.5 Gift Cards 🎴
**DB:**
```sql
CREATE TABLE gift_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  initial_value numeric NOT NULL,
  remaining_value numeric NOT NULL,
  purchased_by_order_id uuid REFERENCES orders(id),
  recipient_email text,
  message text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```
**UI:** `/gift-card` purchase page, redemption at checkout

### 3.6 Size/Variant Selector for Fragrances ⚗️
**რა:** 30ml / 50ml / 100ml variants — სხვადასხვა ფასი
**DB:** `product_variants` table ან `products.variants jsonb`
**UI:** Variant selector on product page, price updates dynamically

---

## 🔵 TIER 4 — Social Commerce & Growth

### 4.1 UGC Photo Gallery 📸
**რა:** "ჩვენი კლიენტები" — მომხმარებლები ატვირთავენ ფოტოებს, product page-ზე ჩნდება
**DB:**
```sql
CREATE TABLE ugc_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text REFERENCES products(id) ON DELETE SET NULL,
  image_url text NOT NULL,
  author_name text,
  instagram_handle text,
  approved boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);
```
**Admin:** UGC moderation queue
**UI:** Product page-ზე "Real Photos" section + `/lookbook` gallery page

### 4.2 Influencer Affiliate System 🌟
**DB:**
```sql
CREATE TABLE affiliates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  code text UNIQUE NOT NULL,
  commission_rate numeric DEFAULT 0.10,
  total_sales numeric DEFAULT 0,
  created_at timestamptz DEFAULT now()
);
```
**Flow:** Affiliate code → checkout-ზე auto-apply → order-ში `affiliate_id` → commission tracking
**Admin:** Affiliate dashboard (sales, commissions, payouts)

### 4.3 Limited Edition Drops + Pre-Order 💎
**DB:**
```sql
ALTER TABLE products ADD COLUMN is_limited_edition boolean DEFAULT false;
ALTER TABLE products ADD COLUMN drop_date timestamptz;
ALTER TABLE products ADD COLUMN pre_order_available boolean DEFAULT false;
ALTER TABLE products ADD COLUMN pre_order_ships_at timestamptz;
```
**UI:** Countdown timer on product page, "Coming Soon" landing pages, email waitlist

### 4.4 VIP Early Access 👑
**რა:** Loyalty tier X-ზე ზემოთ → ახალ კოლექციებზე 24-სთ ადრე წვდომა
**Flow:** Product `drop_date` - 24h → loyalty members receive email → exclusive access link
**UI:** VIP badge on account, early access product pages

### 4.5 "Share & Get Discount" Mechanic 🔗
**რა:** Product page-ზე "გაუზიარე და მიიღე 5% ფასდაკლება"
**Flow:** Unique share URL → tracking → conversion → discount mint

---

## 🟣 TIER 5 — Subscription Model

### 5.1 "Fragrance of the Month" Subscription 📬
**რა:** ყოველთვიური სააბონენტო ყუთი — 1-3 სუნამო სინჯი
**DB:**
```sql
CREATE TABLE subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users,
  plan text CHECK (plan IN ('monthly', 'quarterly')),
  status text CHECK (status IN ('active', 'paused', 'cancelled')),
  next_billing_date date,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);
```
**Payment:** Recurring billing — BOG/Stripe subscription API
**UI:** `/subscribe` landing page, account subscription management

### 5.2 "Try Before You Buy" — Fragrance Samples 🧪
**რა:** 2ml-5ml სინჯები იაფ ფასად → satisfied? → სრული ბოთლი ყიდულობს
**DB:** `products` ახალი category/type `is_sample boolean`, `parent_product_id` reference
**UI:** "სინჯი სცადე" CTA on full-size fragrance pages → add sample to cart

---

## ⚫ TIER 6 — Analytics & Operations

### 6.1 Customer Analytics Dashboard (Admin) 📊
**რა:** Admin panel-ში ახალი section
**Metrics:**
- Total revenue (daily/weekly/monthly chart)
- Average Order Value (AOV)
- Top products by revenue
- Customer Lifetime Value (CLV) — top buyers
- Conversion funnel (visitors → add to cart → checkout → purchase)
- Repeat purchase rate

**Stack:** Supabase queries + Recharts (already in Next.js stack)

### 6.2 Heatmap & Session Recording 🔥
**Stack:** Microsoft Clarity (უფასო) ან Hotjar
**Integration:** `<Script>` tag in `app/layout.tsx`
**Value:** სად ჩერდება მომხმარებელი, სად ტოვებს გვერდს — UX გადაწყვეტილებები data-ზე დაყრდნობით

### 6.3 A/B Testing 🧪
**Stack:** Vercel Edge Config + Next.js middleware
**Use cases:** Hero headline, CTA button text, product card layout, checkout flow

### 6.4 Inventory Alerts (Admin) ⚠️
**რა:** Admin dashboard-ში low stock warnings, email notification when stock < threshold
**DB trigger:** Supabase Edge Function on `products.stock` update

---

## 🌱 TIER 7 — Trust & Brand

### 7.1 Certificate of Authenticity (QR) 🔏
**რა:** სამკაულებისთვის — QR კოდი შეფუთვაზე → ციფრული სერტიფიკატი
**DB:**
```sql
CREATE TABLE authenticity_certs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id text REFERENCES products(id),
  order_id uuid REFERENCES orders(id),
  cert_code text UNIQUE NOT NULL,
  issued_at timestamptz DEFAULT now()
);
```
**Route:** `/verify/[cert_code]` — public page showing product details + order info

### 7.2 Editorial Blog / Lookbook 📖
**რა:** Content marketing — SEO traffic + brand authority
**Topics:** "5 სამკაული საქორწინო სეზონისთვის", "ზაფხულის სუნამოები", "მოვლის რუტინა"
**DB:**
```sql
CREATE TABLE blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title text NOT NULL,
  body text,
  cover_image_url text,
  published boolean DEFAULT false,
  published_at timestamptz,
  created_at timestamptz DEFAULT now()
);
```
**Routes:** `/blog`, `/blog/[slug]`
**Admin:** Rich text editor (Tiptap ან Quill)

### 7.3 Sustainability / Brand Story გვერდი 🌿
**რა:** Static page — "ჩვენი ღირებულებები", "ადგილობრივი ხელოსნები", "eco-friendly შეფუთვა"
**Route:** `/about`, `/sustainability`
**Value:** Trust signal — luxury shoppers pay premium for verified ethical sourcing

### 7.4 Live Chat / AI Assistant 💬
**რა:** Product recommendation chatbot + customer support
**Stack:** Claude API — system prompt includes product catalog
**UI:** Floating chat bubble → opens drawer → conversational product discovery
**Route:** `/api/chat` — streaming response with Claude Sonnet

---

## 📱 TIER 8 — Mobile & Performance

### 8.1 Progressive Web App (PWA)
**რა:** Add to homescreen, offline cache, push notifications
**Stack:** `next-pwa` plugin
**Value:** Mobile conversion rates 3-7x higher on apps vs mobile web

### 8.2 Push Notifications
**Stack:** Web Push API + Supabase Edge Functions
**Use cases:** Order status updates, back-in-stock alerts, flash sale announcements

### 8.3 Dynamic SEO (generateMetadata)
**რა:** Product pages, category pages — unique title/description/OG image
**Stack:** Next.js `generateMetadata()` per page + `next/og` for dynamic OG images
**Priority:** HIGH — Google indexing starts here

---

## 🗓️ Suggested Implementation Order

```
კვირა 1-2:   0.1 Supabase wiring + 0.3 Custom domain + 3.7 SEO metadata
კვირა 3-4:   0.4 Payment (BOG) + 0.2 Cart persistence
თვე 2:       1.1 Reviews + 1.2 Wishlist + 1.3 Gift wrap + 1.5 Stock alerts
თვე 3:       1.4 Abandoned cart + 1.6 Discount codes + 2.1 Customer accounts
თვე 4:       2.2 Email automation + 2.3 Loyalty + 3.1 Scent Quiz (Claude API)
თვე 5-6:     4.x Social commerce + 5.x Subscriptions + 6.x Analytics
```

---

## 🔧 Technical Notes for Claude Code

- ყველა admin write → `/api/admin/*` routes via `supabase-admin` (service_role)
- ყველა admin page: `export const dynamic = 'force-dynamic'`
- Images: R2 presigned URLs, Sharp pipeline უკვე მზადაა
- Email: Resend API გირჩევია (Next.js-ის ოფიციალური partner)
- Payments: BOG e-commerce API docs: https://developer.bog.ge
- AI features: Anthropic API `claude-sonnet-4-20250514`, max_tokens 1000
- Supabase project ID: `albjycaewmvxworrhdsh` (region: West EU / Ireland)

---

*დოკუმენტი: samkaulebi_feature_roadmap.md | შეიქმნა: 2026-05-27*
