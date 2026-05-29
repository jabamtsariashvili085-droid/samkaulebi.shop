# ✅ TODO — samkaulebi.shop

> **მიზანი:** ეს ფაილი არის actionable სამუშაო-სია Antigravity-ში მომუშავე AI agent-ისთვის (Opus 4.7).
> თითო ამოცანას აქვს: **რა** / **სად** / **Acceptance Criteria** / **Dependencies**.
> ამოცანა დასრულებულად ითვლება მხოლოდ მაშინ, როცა ყველა Acceptance Criteria ✅-ია.
>
> წყარო: PROJECT_OVERVIEW.md + samkaulebi_feature_roadmap.md + 2026 global e-commerce research
> შედგენილია: 2026-05-29 | senior architect pass

---

## 🧭 როგორ წავიკითხო ეს ფაილი (agent-ისთვის)

- ამოცანები **მკაცრად პრიორიტეტულია**. ზევიდან ქვევით. ნუ გადახვალ Phase-ზე, სანამ წინა Phase-ის ყველა `[BLOCKER]` არ დასრულდა.
- `[BLOCKER]` = ამას ვერაფერი გვერდს უვლის. სხვა ფუნქცია ამაზეა დამოკიდებული.
- `[2026]` = ახალი ფუნქცია 2026 global trend research-იდან (roadmap-ში არ იყო).
- `[LEGAL]` = სამართლებრივად სავალდებულო, არა nice-to-have.
- ცვლილების შემდეგ: `npm run build` უნდა გავიდეს errors-ის გარეშე + `git commit` აღწერითი message-ით.
- ყველა admin write → `/api/admin/*` route via `supabase-admin` (service_role). არასდროს client-side write.
- ყველა admin page: `export const dynamic = 'force-dynamic'`.
- Supabase project ID: `albjycaewmvxworrhdsh` (West EU / Ireland).

---

# 🔴 PHASE 0 — Foundation (ამის გარეშე არაფერი მუშაობს)

> **არქიტექტორის შენიშვნა:** Storefront ჯერ კიდევ `lib/data/`-ს კითხულობს. სანამ ეს არ მოგვარდება,
> ყველა Phase 1+ ფუნქცია (reviews, wishlist, stock) ფიქტიურ მონაცემებზე აშენდება. **ეს არის #1.**

### [ ] 0.1 — Storefront → Supabase wiring `[BLOCKER]`
- **რა:** ამოიღე ყველა `lib/data/` სტატიკური წყარო, ყველა storefront გვერდმა Supabase წაიკითხოს.
- **სად:** `app/(storefront)/shop/`, `category/[slug]/`, `product/[id]/`, homepage featured section
- **როგორ:** server component-ში `supabase.from('products').select(...)`, `export const dynamic = 'force-dynamic'`
- **Acceptance:**
  - [ ] `/shop` აჩვენებს DB-ის რეალურ პროდუქტებს, არა `lib/data/products.ts`-ს
  - [ ] `/category/[slug]` ფილტრავს `category_id`-ით DB-დან
  - [ ] `/product/[id]` ერთ პროდუქტს იღებს DB-დან, 404 თუ არ არსებობს
  - [ ] homepage `featured` section იყენებს `products.featured = true` partial index-ს
  - [ ] `lib/data/` წაშლილია ან მხოლოდ ტიპებისთვის რჩება
- **Depends on:** —

### [ ] 0.2 — რეალური პროდუქტების ჩასმა `[BLOCKER]`
- **რა:** წაშალე 25 v0 placeholder, ჩასვი რეალური პროდუქტები (admin panel-ით)
- **Acceptance:**
  - [ ] DB-ში 0 placeholder პროდუქტი
  - [ ] მინიმუმ რეალური კატალოგი ჩატვირთული (სამკაულები / სუნამოები / თავის მოვლა)
  - [ ] თითო პროდუქტს აქვს: სახელი, ფასი, ≥1 R2 სურათი, კატეგორია, stock
- **Depends on:** 0.1

### [ ] 0.3 — Cart persistence `[BLOCKER]`
- **რა:** in-memory cart → `localStorage` (minimum), მოგვიანებით DB-backed authenticated users-ისთვის
- **სად:** `components/boty/CartDrawer` + `CartContext`
- **Acceptance:**
  - [ ] კალათა refresh-ის შემდეგ რჩება
  - [ ] tab-ებს შორის სინქრონია (`storage` event)
  - [ ] (optional) `carts(id, session_id, product_id, quantity, created_at)` table
- **Depends on:** 0.1
- **არქიტექტორის შენიშვნა:** ეს payment-ამდე გააკეთე — წინააღმდეგ შემთხვევაში checkout-ს ნორმალურად ვერ დაატესტავ.

### [ ] 0.4 — Custom domain
- **რა:** `samkaulebi.shop` → Vercel DNS
- **Acceptance:** [ ] domain live + SSL + `www` redirect

### [ ] 0.5 — Payment Gateway (BOG first) `[BLOCKER]`
- **რა:** BOG e-commerce API integration (https://developer.bog.ge). Stripe — საერთაშორისოსთვის მოგვიანებით.
- **სად:** `/api/orders/` გაფართოება + Checkout form + payment callback route
- **Acceptance:**
  - [ ] order იქმნება `pending` სტატუსით payment-ის ინიციაციამდე
  - [ ] BOG callback ამოწმებს signature-ს და აახლებს order status → `confirmed`
  - [ ] failed payment → order `cancelled`, stock ბრუნდება
  - [ ] cash-on-delivery კვლავ მუშაობს როგორც fallback
- **Depends on:** 0.3
- **არქიტექტორის შენიშვნა:** BOG e-commerce API native Apple/Google Pay ღილაკს არ აძლევს checkout-ს (იხ. 2.3). თუ wallet ღილაკი პრიორიტეტია, processor უნდა შეირჩეს მისი support-ით — მაგრამ Stripe-ის merchant რეგისტრაცია საქართველოში პრობლემურია. ამიტომ BOG = სწორი პირველი არჩევანი, wallet კი მოგვიანებითი ფაზა.

### [ ] 0.6 — Legal pages `[LEGAL]` `[2026]`
- **რა:** Terms of Service, Privacy Policy, Returns/Refund policy, Cookie consent
- **რატომ:** Supabase EU რეგიონი + EU/ქართველი მომხმარებლები → GDPR + საქართველოს პერსონალურ მონაცემთა დაცვის კანონი ვრცელდება. სავალდებულოა payment-ის გაშვებამდე.
- **სად:** `/terms`, `/privacy`, `/returns`, cookie banner `app/layout.tsx`-ში
- **Acceptance:**
  - [ ] სამივე გვერდი არსებობს და footer-დან ხელმისაწვდომია
  - [ ] cookie consent banner (analytics-ამდე)
  - [ ] privacy policy ასახელებს: Supabase, Cloudflare R2, Vercel Analytics, BOG

---

# 🟠 PHASE 1 — Trust & Production-readiness (პროდუქშენისთვის სავალდებულო)

### [ ] 1.1 — Dynamic SEO + Open Graph
- **რა:** `generateMetadata()` per product/category, dynamic OG images via `next/og`
- **სად:** `product/[id]`, `category/[slug]`, homepage
- **Acceptance:**
  - [ ] თითო პროდუქტს უნიკალური title/description
  - [ ] OG image პროდუქტის სურათით (social share-ისთვის)
  - [ ] `sitemap.xml` + `robots.txt` გენერირდება
- **Priority:** HIGH — Google indexing აქედან იწყება

### [ ] 1.2 — AI Discoverability / Agentic Commerce readiness `[2026]`
- **რა:** structured product feed + schema.org markup + `llms.txt` — რომ AI agent-ებმა (ChatGPT, Perplexity, Google) იპოვონ პროდუქტი.
- **რატომ:** AI-referral retail ტრაფიკი +393% YoY (2026 Q1). ეს არის წლის #1 discovery channel-ის ცვლილება. სრულ ACP Instant Checkout-ს ჯერ ვერ შეუერთდები (US-only), მაგრამ feed + schema საფუძველი ახლავე უნდა ჩაიყაროს.
- **სად:** `/api/feed/products` (JSON), `app/(storefront)/product/[id]` (JSON-LD), `public/llms.txt`
- **Acceptance:**
  - [ ] `/api/feed/products.json` აბრუნებს: id, title, description, price, currency, availability, image, category, URL
  - [ ] თითო product page-ს აქვს schema.org `Product` JSON-LD (`name`, `image`, `offers`, `aggregateRating` როცა reviews იქნება)
  - [ ] `llms.txt` აღწერს კატალოგს AI crawler-ებისთვის
  - [ ] feed daily refresh (Vercel cron ან Supabase Edge Function)
- **Depends on:** 0.1, 0.2

### [ ] 1.3 — Rate limiting + bot protection `[2026]`
- **რა:** public API routes-ის დაცვა spam-ისგან
- **სად:** `/api/orders`, `/api/admin/*`, checkout
- **Acceptance:**
  - [ ] `/api/orders` rate-limited per IP (მაგ. Vercel Edge Middleware ან Upstash)
  - [ ] checkout-ზე bot protection (Cloudflare Turnstile ან hCaptcha)
- **Depends on:** —

### [ ] 1.4 — Admin auth gate audit `[BLOCKER]`
- **რა:** დაამოწმე რომ ყველა `/api/admin/*` route ამოწმებს ავტორიზაციას მოქმედებამდე
- **რატომ:** RLS იქ bypass-ულია (service_role). auth შემოწმება არის **ერთადერთი** უსაფრთხოების ზღუდე.
- **Acceptance:**
  - [ ] თითო admin route იწყება session/role verification-ით
  - [ ] არა-authenticated request → 401
  - [ ] middleware ფარავს `/admin/*` და `/api/admin/*`

### [ ] 1.5 — Error monitoring `[2026]`
- **რა:** Sentry (ან მსგავსი) production error tracking
- **Acceptance:** [ ] client + server errors იჭერა; alert email აყენებს admin-ს

### [ ] 1.6 — Email deliverability setup `[2026]`
- **რა:** Resend integration + SPF/DKIM/DMARC დომენზე
- **Acceptance:**
  - [ ] order confirmation email იგზავნება (transactional)
  - [ ] SPF/DKIM/DMARC ჩაწერილია DNS-ში → inbox, არა spam
- **Depends on:** 0.4, 0.5

---

# 🟡 PHASE 2 — Conversion (პირდაპირ გაყიდვებზე)

### [ ] 2.1 — Product Reviews & Ratings ⭐
- **DB:** `reviews(id, product_id FK CASCADE, order_id FK, rating int CHECK 1-5, body, author_name, approved bool, created_at)`
- **Acceptance:**
  - [ ] verified-purchase only (order_id სავალდებულო)
  - [ ] star widget + review list `/product/[id]`-ზე
  - [ ] aggregate rating badge product card-ზე
  - [ ] admin moderation (approve/reject)
  - [ ] schema.org `aggregateRating` განახლდა (კავშირი 1.2-თან)
- **Depends on:** 0.1, 0.5

### [ ] 2.2 — Wishlist ❤️
- **DB:** `wishlists(id, session_id, user_id FK, product_id FK CASCADE, created_at)`
- **Acceptance:** [ ] heart toggle product card-ზე; [ ] `/wishlist` გვერდი; [ ] anonymous (localStorage) + auth sync

### [ ] 2.3 — Express / one-click checkout `[2026]`
- **რა:** guest checkout + auto-fill + მინიმალური ველები. (Apple Pay / Google Pay ღილაკები — მხოლოდ processor-ის support-ის შემდეგ, იხ. შენიშვნა.)
- **რატომ:** 2026 — "invisible checkout". guest checkout + ნაკლები ველი ნამდვილად ამცირებს cart abandonment-ს.
- **Acceptance (ახლავე გასაკეთებელი):**
  - [ ] guest checkout (account-ის გარეშე)
  - [ ] ≤5 ველი + browser auto-fill (`autocomplete` attributes)
  - [ ] transparent pricing (no hidden costs)
- **Acceptance (გადადებული — wallet):**
  - [ ] Apple Pay / Google Pay native ღილაკი — **მხოლოდ** მაშინ, როცა processor რომელიც მათ აჭერს ჩაირთვება
- **Depends on:** 0.5
- **არქიტექტორის შენიშვნა (🇬🇪 reality):** Apple/Google Pay native ღილაკი checkout-ში payment processor-ის გავლით ერთვება (Stripe/Adyen ა.შ.), არა თვითონ ღილაკის დადებით. **BOG e-commerce API (0.5) native wallet ღილაკს არ გაძლევს** — BOG-ის ჰოსტირებულ გვერდზე wallet შესაძლოა გამოჩნდეს მოწყობილობის მიხედვით, მაგრამ შენს checkout-ზე ცალკე ღილაკს ვერ დასვამ. ამიტომ ეს task ≠ "wallet ღილაკი"; ჯერ guest checkout გააკეთე, wallet მოგვიანებით. იხ. 0.5.

### [ ] 2.4 — Discount codes / promo system 🏷️
- **DB:** `discount_codes(id, code UNIQUE, type CHECK percent|fixed, value, min_order, max_uses, used_count, expires_at, active)`
- **Acceptance:** [ ] promo field checkout-ზე + validation API; [ ] admin code generator; [ ] usage tracking

### [ ] 2.5 — Stock scarcity + back-in-stock alerts 📦
- **DB:** `stock_alerts(id, product_id FK CASCADE, email, notified_at, created_at)`
- **Acceptance:** [ ] "მხოლოდ X დარჩა" badge (`stock < 5`); [ ] out-of-stock email signup; [ ] restock trigger → email
- **Depends on:** 1.6

### [ ] 2.6 — Gift wrapping + message 🎁
- **DB:** `orders` + `gift_wrap bool`, `gift_message text`, `gift_wrap_fee numeric`
- **Acceptance:** [ ] checkout collapsible section; [ ] admin orders view-ში ჩანს

### [ ] 2.7 — Abandoned cart recovery 📧
- **Stack:** Resend + Supabase Edge Function (cron)
- **Acceptance:** [ ] 1სთ-ში reminder email cart-ის სურათებით + CTA; [ ] არ იგზავნება თუ შეძენილია
- **Depends on:** 0.3, 1.6

---

# 🟢 PHASE 3 — Premium UX & Jewelry-specific `[2026]`

### [ ] 3.1 — Visual Search + Virtual Try-On `[2026]` 💍
- **რა:** (a) Visual Search: სურათის ატვირთვა → მსგავსი პროდუქტები; (b) Try-On: კამერით / static AR.
- **რატომ:** სამკაულისთვის #1 trust-gap solution-ია 2026-ში. live AR ძვირია (3D per SKU) — დაიწყე **AI-generated on-model photography**-ით ("static AR"), app/webcam-ის გარეშე.
- **Stack:** R2 + Sharp pipeline-ის გაფართოება; AI on-model imagery; (advanced) visual search embedding
- **Acceptance:**
  - [ ] Phase A: admin-ში AI on-model ფოტოს გენერაცია/ატვირთვა პროდუქტზე
  - [ ] Phase B: visual search — ატვირთე ფოტო → მსგავსი SKU-ები
  - [ ] (advanced) live AR try-on rings/necklaces (3rd-party SDK, მაგ. MirrAR/Banuba)
- **Depends on:** 0.1, 0.2

### [ ] 3.2 — Semantic / AI search `[2026]` 🔍
- **რა:** keyword search → intent-based ("ოქროს ყელსაბამი საქორწინოდ 200 ლარამდე")
- **Stack:** Supabase pgvector embeddings ან Claude API query-parsing
- **Acceptance:** [ ] natural-language query → relevant results; [ ] ნაკლები "no results"; [ ] scent quiz-თან ინტეგრაცია (3.4)

### [ ] 3.3 — "Recently Viewed" + "You Might Also Like" 🔄
- **Acceptance:** [ ] browse history (localStorage); [ ] related products (same category); [ ] (advanced) Claude API recommendations

### [ ] 3.4 — Fragrance Scent Quiz / AI Stylist 🧴
- **Stack:** Claude API (`claude-sonnet-4-20250514`, max_tokens 1000)
- **Route:** `/api/quiz/recommend` (POST answers → Claude → product IDs), `/quiz` page
- **Acceptance:** [ ] 5 კითხვა (occasion/mood/notes/season/budget); [ ] recommended products; [ ] homepage hero-დან წვდომა

### [ ] 3.5 — Shop by Occasion / Mood + Fragrance Notes 🎯🌸
- **DB:** `products.tags text[]` + `products.fragrance_notes jsonb`
- **Acceptance:** [ ] tag filter chips `/shop`-ზე; [ ] top/heart/base notes pyramid product page-ზე

### [ ] 3.6 — Variant selector (30/50/100ml) ⚗️
- **DB:** `product_variants` table ან `products.variants jsonb`
- **Acceptance:** [ ] variant selector; [ ] ფასი dynamically ახლდება

### [ ] 3.7 — Accessibility / WCAG `[2026]` ♿
- **რა:** WCAG 2.2 AA compliance — keyboard nav, alt text, contrast, ARIA, focus states
- **რატომ:** 2026-ში accessibility → competitive advantage + trust signal (luxury). ასევე SEO-ს ეხმარება.
- **Acceptance:** [ ] Lighthouse a11y ≥ 95; [ ] სრული keyboard navigation; [ ] ყველა სურათს alt text

---

# 🔵 PHASE 4 — Retention (მომხმარებელი ბრუნდება)

### [ ] 4.1 — Customer accounts + order history 👤
- **Routes:** `/account/login|register|orders|wishlist`
- **DB:** `orders.user_id` (nullable, guest backward-compat)
- **Acceptance:** [ ] customer auth (Supabase, admin-სგან განცალკევებული role); [ ] order history; [ ] Leaked Password Protection ჩართული

### [ ] 4.2 — Email marketing automation 📨
- **Flows:** welcome series, order confirmation, shipping update, post-purchase review request (7d), smart restock reminder
- **Depends on:** 1.6, 4.1

### [ ] 4.3 — Loyalty / points 🏆
- **DB:** `loyalty_points(id, user_id, order_id, points, type CHECK earned|redeemed|expired, created_at)`
- **Logic:** 1 GEL = 1 ქულა, 100 ქულა = 5 GEL
- **Depends on:** 4.1

### [ ] 4.4 — Referral program 🤝
- **DB:** `referrals(id, referrer_user_id, referred_email, status, reward_issued, created_at)`
- **Depends on:** 4.1, 2.4

---

# ⚫ PHASE 5 — Analytics & Operations

### [ ] 5.1 — Admin analytics dashboard 📊
- **Stack:** Supabase queries + Recharts
- **Metrics:** revenue chart, AOV, top products, CLV, conversion funnel, repeat purchase rate

### [ ] 5.2 — Heatmap / session recording 🔥
- **Stack:** Microsoft Clarity (free) `<Script>` `app/layout.tsx`-ში
- **Depends on:** 0.6 (cookie consent)

### [ ] 5.3 — Inventory alerts (admin) ⚠️
- **Acceptance:** [ ] low-stock warning dashboard-ში; [ ] email როცა `stock < threshold`

### [ ] 5.4 — A/B testing 🧪
- **Stack:** Vercel Edge Config + middleware

---

# 🟣 PHASE 6 — Growth (მოგვიანებით — scope-ს უფრთხილდი)

> **არქიტექტორის შენიშვნა:** ეს tier ნუ დაიწყებ სანამ Phase 0-2 არ დასრულდა და
> რეალური გაყიდვები არ გექნება. ეს growth-multiplier-ებია, არა foundation.

- [ ] 6.1 — UGC photo gallery 📸 (`ugc_photos` table + moderation)
- [ ] 6.2 — Influencer affiliate system 🌟 (`affiliates` table + commission tracking)
- [ ] 6.3 — Limited edition drops + pre-order 💎 (countdown, waitlist)
- [ ] 6.4 — Gift cards 🎴 (`gift_cards` table + redemption)
- [ ] 6.5 — Editorial blog / lookbook 📖 (SEO traffic; Tiptap editor)
- [ ] 6.6 — Live chat / AI assistant 💬 (Claude API + catalog system prompt)
- [ ] 6.7 — Subscription model 📬 ("Fragrance of the Month"; recurring billing)
- [ ] 6.8 — PWA + push notifications 📱 (`next-pwa`)
- [ ] 6.9 — Certificate of authenticity (QR) 🔏 (`/verify/[cert_code]`)

---

## 🗓️ რეკომენდებული რიგი (realistic, 1 dev + AI)

```
კვირა 1-2:  0.1 Supabase wiring + 0.2 რეალური პროდუქტები        ← BLOCKER, ყველაფერი ამაზეა
კვირა 3:    0.3 Cart persistence + 0.4 Custom domain
კვირა 4-5:  0.6 Legal pages + 0.5 Payment (BOG)                  ← პირველი რეალური ტრანზაქცია 🎯
კვირა 6:    1.4 Auth audit + 1.3 Rate limit + 1.5 Sentry + 1.6 Email
კვირა 7-8:  1.1 SEO + 1.2 AI discoverability feed
თვე 3:      2.1 Reviews + 2.2 Wishlist + 2.3 Express checkout
თვე 4:      2.4 Promo + 2.5 Stock + 2.7 Abandoned cart
თვე 5:      3.1 Visual/Try-On + 3.2 Semantic search + 3.4 Scent quiz
თვე 6+:     Phase 4 retention → Phase 5 analytics → Phase 6 growth
```

**ოქროს წესი:** პირველი რეალური ფასიანი ტრანზაქცია (კვირა 5) უმნიშვნელოვანესი milestone-ია.
ყველაფერი მის შემდეგ — optimization. ნუ ააშენებ Tier 6-ს სანამ ერთ ნივთს არ გაყიდი.

---

## 🔧 Technical reference (agent-ისთვის)

- Admin write → `/api/admin/*` via `supabase-admin` (service_role). არასდროს client-side.
- ყველა admin page: `export const dynamic = 'force-dynamic'`.
- Images: R2 presigned URLs + Sharp pipeline (მზადაა).
- Email: Resend (Next.js official partner) + SPF/DKIM/DMARC.
- Payments: BOG e-commerce API → https://developer.bog.ge (პირველი); Stripe (international).
- AI features: Anthropic API `claude-sonnet-4-20250514`, max_tokens 1000.
- Agentic Commerce reference: Agentic Commerce Protocol (OpenAI + Stripe) — https://developers.openai.com/commerce
- Supabase project: `albjycaewmvxworrhdsh` (West EU / Ireland).
- DB რელაციები: `categories → subcategories → products → order_items → orders`.

---

*TODO.md | samkaulebi.shop | 2026-05-29 | senior architect pass + 2026 global research*
