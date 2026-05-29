# 🗺️ FEATURE MAP — Admin / Internal Tools

> **თარიღი:** 2026-05-29
> **scope:** მხოლოდ Admin Panel / Internal Tools (storefront ფუნქციები → იხ. TODO.md)
> **მიზანი:** standalone feature map Antigravity-ში მომუშავე AI agent-ისთვის (Opus 4.7).
> **AI provider (admin tools):** Gemini 2.5 Flash (API key უკვე არსებობს)
>
> ეს ფაილი **არ ცვლის** TODO.md-ს — ცალკე internal-tools რუკაა.
> Storefront / payment / SEO ამოცანებისთვის → TODO.md.

---

## 🧭 კონვენციები (agent-ისთვის)

- `[BLOCKER]` = სხვა ფუნქცია ამაზეა დამოკიდებული. ჯერ ეს.
- `[AI]` = იყენებს Gemini 2.5 Flash.
- `[DB]` = საჭიროებს DB migration-ს.
- ამოცანა დასრულებულია მხოლოდ მაშინ, როცა ყველა Acceptance Criteria ✅.
- ყველა admin write → `/api/admin/*` via `supabase-admin` (service_role). არასდროს client-side.
- ყველა admin page: `export const dynamic = 'force-dynamic'`.
- ცვლილების შემდეგ: `npm run build` errors-ის გარეშე + აღწერითი `git commit`.

---

## ⚠️ AI-ს მთავარი არქიტექტურული წესი (წაიკითხე ჯერ ეს)

**AI არასდროს არ არის ფინანსური სიმართლის წყარო.** LLM hallucination ფინანსებში კატასტროფაა.

1. **რიცხვებს ითვლის deterministic SQL** (Supabase aggregations) — ერთადერთი source of truth.
2. **AI მხოლოდ ინტერფეისია** — ბუნებრივ ენაზე კითხვას აქცევს tool-call-ად, შემდეგ *დათვლილ* შედეგს ხსნის ადამიანურად.
3. **AI არასდროს არ წერს raw SQL-ს production DB-ზე.** ამის ნაცვლად — წინასწარ განსაზღვრული, read-only, parameterized query ფუნქციების **whitelist**, გამოაჩენილი Gemini function-calling tool-ებად. LLM მხოლოდ ირჩევს რომელი გამოიძახოს და რა პარამეტრით.

```
მომხმარებელი → "რა იყო წინა თვეში ყველაზე გაყიდვადი?"
   → Gemini ირჩევს tool: getTopProducts({ period: "last_month", limit: 5 })
   → აპლიკაცია ასრულებს parameterized read-only query-ს
   → DB აბრუნებს რეალურ რიცხვებს ✅
   → Gemini ხსნის + კონტექსტს უმატებს (რიცხვი DB-დან, არა "მეხსიერებიდან")
```

---

## 🧱 PREREQUISITE — DB migration `[DB]` `[BLOCKER]`

### [ ] P.1 — `products.cost_price` სვეტი
- **რა:** დაამატე cost price სვეტი, რომ AI ბუღალტერმა რეალური მოგება (margin) დათვალოს, არა მხოლოდ ბრუნვა.
- **SQL:**
```sql
ALTER TABLE products ADD COLUMN cost_price numeric DEFAULT 0 CHECK (cost_price >= 0);
```
- **Acceptance:** [ ] სვეტი არსებობს; [ ] admin product form-ში ველი დაემატა; [ ] არსებულ პროდუქტებზე default 0

---

# 📊 A1 — Financial / Analytics Dashboard `[BLOCKER]`

> **არქიტექტორის შენიშვნა:** ეს არის AI ბუღალტრის *საძირკველი*. ჯერ ეს ააშენე — AI მის ზემოდან ჯდება.

### [ ] A1.1 — Revenue & profit dashboard
- **სად:** ახალი admin route `app/admin/finance/` (`force-dynamic`)
- **Stack:** Supabase aggregation queries + Recharts (უკვე stack-შია)
- **Metrics (deterministic SQL):**
  - Revenue chart — დღე / კვირა / თვე
  - Net profit = revenue − COGS (იყენებს `cost_price`-ს)
  - AOV (Average Order Value)
  - Top products by revenue
  - დღგ / VAT 18% — გადასახდელი თანხა (საქართველო)
  - Repeat purchase rate
- **Acceptance:**
  - [ ] ყველა რიცხვი SQL-ით დათვლილი (არა client-side mock)
  - [ ] period filter (today / week / month / custom range)
  - [ ] charts იტვირთება DB-დან, არა `lib/data`
- **Depends on:** P.1

### [ ] A1.2 — Query functions library `[BLOCKER]`
- **რა:** წინასწარ განსაზღვრული read-only query ფუნქციების ბიბლიოთეკა. ეს ფუნქციები **ორივეს** ემსახურება — dashboard-ს და AI ბუღალტერს.
- **სად:** `lib/finance/queries.ts`
- **მაგალითი ფუნქციები (ყველა read-only, parameterized):**
  - `getRevenue(period)` → `{ total, currency }`
  - `getProfit(period)` → `{ revenue, cogs, net }`
  - `getTopProducts(period, limit)` → `[{ product, units, revenue }]`
  - `getLowStock(threshold)` → `[{ product, stock }]`
  - `getOrderStats(period)` → `{ count, by_status }`
  - `getVatOwed(period)` → `{ taxable, vat }`
  - `getRepeatRate(period)` → `number`
- **Acceptance:**
  - [ ] თითო ფუნქცია parameterized (არა string-concatenated SQL)
  - [ ] ყველა read-only (SELECT only)
  - [ ] dashboard A1.1 იყენებს ამ ფუნქციებს
- **Depends on:** P.1

---

# 🤖 A2 — AI ბუღალტერი (Gemini 2.5 Flash) `[AI]`

> ჯდება A1-ის ზემოდან. რიცხვებს A1.2-ის query functions აწვდის — Gemini მხოლოდ ხსნის.

### [ ] A2.1 — Gemini function-calling layer
- **სად:** `/api/admin/ai/accountant` route + chat UI admin panel-ში
- **Stack:** Gemini 2.5 Flash (`gemini-2.5-flash`), function calling
- **როგორ:**
  1. A1.2-ის query functions გამოაჩინე Gemini-ს **function-calling tools**-ად (schema: სახელი + პარამეტრები + აღწერა)
  2. user message → Gemini ირჩევს tool(s) → აპლიკაცია ასრულებს parameterized query-ს → შედეგი უბრუნდება Gemini-ს → ბუნებრივ ენაზე პასუხი
  3. **არასდროს** გადასცე Gemini-ს raw DB წვდომა ან SQL execution უფლება
- **Acceptance:**
  - [ ] "რამდენი გავყიდე ამ თვეში?" → სწორი რიცხვი DB-დან
  - [ ] "ყველაზე გაყიდვადი 5 პროდუქტი?" → `getTopProducts` tool call
  - [ ] "რამდენი დღგ მმართებს?" → `getVatOwed` tool call
  - [ ] Gemini ვერ ასრულებს arbitrary SQL (security test)
- **Depends on:** A1.2

### [ ] A2.2 — Anomaly detection
- **რა:** AI ამჩნევს უჩვეულო პატერნებს და admin dashboard-ზე flag-ავს
- **მაგალითი alerts:**
  - "გუშინ 5 order გაუქმდა — ჩვეულებრივ 0-1-ია"
  - "X პროდუქტს მარაგი 2-ზე ჩამოუვიდა"
  - "ამ კვირას revenue −30% წინა კვირასთან"
- **როგორ:** scheduled job (Vercel cron / Supabase Edge Function) → query functions → Gemini ადარებს baseline-ს → flag
- **Acceptance:** [ ] dashboard-ზე anomaly cards; [ ] threshold-ები კონფიგურირებადი
- **Depends on:** A2.1

### [ ] A2.3 — Tax / accounting export
- **რა:** დღგ-ს ანგარიში + transaction export ბუღალტრისთვის / RS.ge-სთვის
- **Acceptance:** [ ] CSV/Excel export period-ით; [ ] VAT 18% გამოყოფილი; [ ] Gemini ამზადებს მოკლე summary-ს export-თან ერთად
- **Depends on:** A1.2

---

# 📦 A3 — Order Fulfillment Workflow

### [ ] A3.1 — Shipping & tracking
- **რა:** ახლა status ხელით იცვლება — დაამატე shipping/tracking სრული flow
- **DB:** `orders` + `tracking_number text`, `courier text`, `shipped_at timestamptz`
- **Acceptance:**
  - [ ] tracking number ველი order detail-ზე
  - [ ] courier ინტეგრაცია (ჩვ. ფოსტა / ადგილობრივი კურიერი)
  - [ ] ბეჭდვადი order/shipping ფორმა
  - [ ] status change → customer email (კავშირი TODO.md 1.6-თან)
- **Depends on:** —

### [ ] A3.2 — Refunds / returns
- **DB:** `refunds(id, order_id FK, amount, reason, status, created_at)`
- **Acceptance:** [ ] partial / full refund; [ ] return reason; [ ] payment gateway refund API; [ ] stock ბრუნდება

---

# 📈 A4 — Inventory Management `[AI]`

### [ ] A4.1 — Stock movement & low-stock alerts
- **DB:** `stock_movements(id, product_id FK, change int, reason, created_at)`
- **Acceptance:**
  - [ ] stock history (რა / როდის / რამდენი / რატომ)
  - [ ] low-stock dashboard warnings (`stock < threshold`)
  - [ ] email alert admin-ს

### [ ] A4.2 — Restock forecasting `[AI]`
- **რა:** Gemini წარსული გაყიდვებიდან პროგნოზირებს restock საჭიროებას
- **მაგალითი:** "ეს სუნამო ~2 კვირაში ამოიწურება მიმდინარე ტემპით — შეუკვეთე ახლა"
- **როგორ:** sales velocity query → Gemini → restock recommendation
- **Acceptance:** [ ] თითო low-stock პროდუქტზე forecast; [ ] suggested reorder quantity
- **Depends on:** A4.1, A1.2

---

# ✍️ A5 — AI Content Tools (Gemini 2.5 Flash) `[AI]`

> **არქიტექტორის შენიშვნა:** ეს შენთვის უზარმაზარ დროს დაზოგავს. ასობით პროდუქტის ხელით აღწერა მძიმეა.

### [ ] A5.1 — AI product description generator
- **რა:** რამდენიმე ატრიბუტი → Gemini წერს premium product copy ქართულად
- **სად:** product create/edit form-ში "✨ აღწერის გენერაცია" ღილაკი
- **Acceptance:**
  - [ ] input: სახელი, კატეგორია, მასალა/notes, ფასი → output: ქართული აღწერა
  - [ ] luxury tone (brand voice system prompt-ში)
  - [ ] editable შედეგი (admin ასწორებს დასტურამდე)
  - [ ] (bonus) SEO meta description-იც გენერირდება

### [ ] A5.2 — AI image auto-tagging (Gemini vision) `[AI]`
- **რა:** optimizer-ში ატვირთული სურათიდან ავტომატური კატეგორია / ტეგები / alt-text
- **სად:** არსებული `app/admin/optimizer/` გაფართოება
- **Acceptance:**
  - [ ] ატვირთულ სურათზე Gemini vision → suggested category + tags
  - [ ] auto alt-text generation (SEO + accessibility)
  - [ ] admin ადასტურებს/ასწორებს
- **Depends on:** — (optimizer უკვე არსებობს)

---

# 👥 A6 — Customer / CRM View `[AI]`

### [ ] A6.1 — Customer list & segments
- **რა:** ვინ ყიდულობს, repeat customers, CLV, segments
- **Acceptance:** [ ] customer list AOV/CLV-ით; [ ] repeat vs one-time; [ ] order history per customer

### [ ] A6.2 — AI customer insights `[AI]`
- **რა:** Gemini segment-ებიდან action-ებს თავაზობს
- **მაგალითი:** "ეს 12 VIP კლიენტი 3 თვეა არ ყიდულობს — გაუგზავნე შეთავაზება"
- **Depends on:** A6.1, A1.2

---

# 🔐 A7 — Security & Operations

### [ ] A7.1 — Audit log `[DB]` `[BLOCKER]`
- **რა:** ვინ რა შეცვალა და როდის (multi-user + service_role security)
- **DB:** `audit_log(id, actor, action, entity, entity_id, before jsonb, after jsonb, created_at)`
- **Acceptance:** [ ] თითო admin write → audit entry; [ ] admin-ში filterable log view

### [ ] A7.2 — Settings page
- **რა:** store info, shipping rates, payment config, AI provider keys — ერთ ადგილას (hardcode-ის ნაცვლად)
- **Acceptance:** [ ] settings UI; [ ] DB ან env-backed config

### [ ] A7.3 — Notifications center
- **რა:** new order / low stock / failed payment / anomaly — ერთ feed-ში
- **Acceptance:** [ ] real-time ან polling notifications; [ ] read/unread state

---

## 🗓️ რეკომენდებული build order

```
1.  P.1 cost_price migration                          ← BLOCKER, ყველაფერი ამაზეა
2.  A1.1 + A1.2 Financial dashboard + query library   ← AI ბუღალტრის საძირკველი
3.  A2.1 AI ბუღალტერი (Gemini function calling)       ← ჯდება A1-ის ზემოდან
4.  A7.1 Audit log                                    ← უსაფრთხოება, ადრე უმჯობესია
5.  A5.1 + A5.2 AI content tools                       ← მაღალი დროის ეკონომია
6.  A3.x Fulfillment + A4.x Inventory
7.  A2.2/A2.3 Anomaly + tax export
8.  A6.x CRM + A7.2/A7.3 settings & notifications
```

**ოქროს წესი:** A1 (რეალური dashboard) → A2 (AI ზემოდან). არასდროს დაიწყო A2 სანამ A1.2 query library არ არსებობს — თორემ AI-ს არ ექნება საიდან აიღოს ზუსტი რიცხვები.

---

## 🔧 Technical reference — Gemini 2.5 Flash

- **Model:** `gemini-2.5-flash`
- **REST endpoint:** `POST https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent`
- **Auth:** API key (server-only env var — არასdros `NEXT_PUBLIC_`). მაგ: `GEMINI_API_KEY`
- **Function calling:** გადასცი `tools` მასივი function declarations-ით; Gemini აბრუნებს `functionCall`-ს; აპლიკაცია ასრულებს; უბრუნებ `functionResponse`-ს.
- **SDK:** Google Gen AI SDK (Node). **agent: დაადასტურე მიმდინარე package სახელი/ვერსია Google-ის official docs-ში build-ამდე.**
- **Security:**
  - API key მხოლოდ server-side (API route-ში), არასdros client bundle-ში
  - AI tools = read-only query functions whitelist (არა raw SQL)
  - ფინანსური რიცხვი ყოველთვის DB-დან, არა LLM output-იდან

### სტანდარტული call (reference)
```ts
// app/api/admin/ai/accountant/route.ts (server-only)
// 1. define read-only query function tools (schema)
// 2. send user message + tools to gemini-2.5-flash
// 3. on functionCall → run lib/finance/queries.ts function (parameterized, read-only)
// 4. return functionResponse → gemini → natural-language answer
// API key: process.env.GEMINI_API_KEY (server-only)
```

---

*FEATURE_MAP_2026-05-29.md | samkaulebi.shop | Admin / Internal Tools | AI: Gemini 2.5 Flash*
