// =============================================================================
// lib/finance/queries.ts
// samkaulebi.shop — ფინანსური query wrapper-ები + AI ბუღალტრის tool layer
// =============================================================================
// არქიტექტურა:
//   - SQL ცხოვრობს Postgres functions-ში (იხ. 20260529_finance_functions.sql)
//   - ეს ფაილი თხელი typed wrapper-ია, რომელიც supabaseAdmin.rpc()-ით იძახებს
//   - financeTools + runFinanceTool = whitelist, რომელსაც Gemini 2.5 Flash იყენებს
//
// უსაფრთხოების წესი:
//   AI ვერ წერს raw SQL-ს. იძახებს მხოლოდ ამ ფუნქციებს named tool-ებად.
//   რიცხვი ყოველთვის DB-დან მოდის (rpc), არა LLM-დან.
//
// NOTE (senior, 2026-05-29): DEFERRED scaffolding — admin AI accountant (FEATURE_MAP A1/A2)
// is on hold until the first real sales. Before wiring this up, also fix the SQL bugs:
//   - get_repeat_rate uses orders.customer_email (column does NOT exist) → use `phone` (NOT NULL)
//   - apply P.1 `products.cost_price` migration before creating the finance functions
//   - reconcile "revenue" (get_revenue=orders.total vs get_profit.revenue=line items)
// The admin module exports a factory (createAdminClient), not a `supabaseAdmin` instance.
// =============================================================================

import { createAdminClient } from '@/lib/supabase/admin'

const supabaseAdmin = createAdminClient()

// ---------------------------------------------------------------------------
// Period helpers
// ---------------------------------------------------------------------------
export type Period = 'today' | 'week' | 'month' | 'last_month' | 'year' | 'all'

export interface DateRange {
  start: string // ISO timestamp (inclusive)
  end: string   // ISO timestamp (exclusive)
}

/** Period preset → start/end. end ყოველთვის exclusive (next boundary). */
export function resolvePeriod(period: Period, now: Date = new Date()): DateRange {
  const startOfDay = (d: Date) => {
    const x = new Date(d)
    x.setHours(0, 0, 0, 0)
    return x
  }
  const iso = (d: Date) => d.toISOString()

  switch (period) {
    case 'today': {
      const start = startOfDay(now)
      const end = new Date(start)
      end.setDate(end.getDate() + 1)
      return { start: iso(start), end: iso(end) }
    }
    case 'week': {
      // rolling last 7 days
      const end = now
      const start = new Date(now)
      start.setDate(start.getDate() - 7)
      return { start: iso(start), end: iso(end) }
    }
    case 'month': {
      // rolling last 30 days
      const end = now
      const start = new Date(now)
      start.setDate(start.getDate() - 30)
      return { start: iso(start), end: iso(end) }
    }
    case 'last_month': {
      // წინა კალენდარული თვე
      const start = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const end = new Date(now.getFullYear(), now.getMonth(), 1)
      return { start: iso(start), end: iso(end) }
    }
    case 'year': {
      // rolling last 365 days
      const end = now
      const start = new Date(now)
      start.setFullYear(start.getFullYear() - 1)
      return { start: iso(start), end: iso(end) }
    }
    case 'all': {
      return { start: '1970-01-01T00:00:00.000Z', end: '2999-12-31T00:00:00.000Z' }
    }
  }
}

function toRange(p: Period | DateRange): DateRange {
  return typeof p === 'string' ? resolvePeriod(p) : p
}

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------
export interface Profit { revenue: number; cogs: number; net: number }
export interface TopProduct { product_id: string; name: string; units: number; revenue: number }
export interface LowStockItem { product_id: string; name: string; stock: number }
export interface OrderStat { status: string; count: number }
export interface VatResult { gross: number; net: number; vat: number }

const CURRENCY = 'GEL' as const

// ---------------------------------------------------------------------------
// Query wrappers (read-only)
// ---------------------------------------------------------------------------

export async function getRevenue(period: Period | DateRange) {
  const { start, end } = toRange(period)
  const { data, error } = await supabaseAdmin.rpc('get_revenue', { p_start: start, p_end: end })
  if (error) throw new Error(`getRevenue: ${error.message}`)
  return { total: Number(data) || 0, currency: CURRENCY }
}

export async function getAov(period: Period | DateRange) {
  const { start, end } = toRange(period)
  const { data, error } = await supabaseAdmin.rpc('get_aov', { p_start: start, p_end: end })
  if (error) throw new Error(`getAov: ${error.message}`)
  return { aov: Number(data) || 0, currency: CURRENCY }
}

export async function getProfit(period: Period | DateRange): Promise<Profit & { currency: string }> {
  const { start, end } = toRange(period)
  const { data, error } = await supabaseAdmin.rpc('get_profit', { p_start: start, p_end: end })
  if (error) throw new Error(`getProfit: ${error.message}`)
  const row = (Array.isArray(data) ? data[0] : data) ?? { revenue: 0, cogs: 0, net: 0 }
  return {
    revenue: Number(row.revenue) || 0,
    cogs: Number(row.cogs) || 0,
    net: Number(row.net) || 0,
    currency: CURRENCY,
  }
}

export async function getTopProducts(period: Period | DateRange, limit = 5): Promise<TopProduct[]> {
  const { start, end } = toRange(period)
  const { data, error } = await supabaseAdmin.rpc('get_top_products', {
    p_start: start, p_end: end, p_limit: limit,
  })
  if (error) throw new Error(`getTopProducts: ${error.message}`)
  return (data ?? []).map((r: any) => ({
    product_id: r.product_id,
    name: r.name,
    units: Number(r.units) || 0,
    revenue: Number(r.revenue) || 0,
  }))
}

export async function getLowStock(threshold = 5): Promise<LowStockItem[]> {
  const { data, error } = await supabaseAdmin.rpc('get_low_stock', { p_threshold: threshold })
  if (error) throw new Error(`getLowStock: ${error.message}`)
  return (data ?? []).map((r: any) => ({
    product_id: r.product_id,
    name: r.name,
    stock: Number(r.stock) || 0,
  }))
}

export async function getOrderStats(period: Period | DateRange): Promise<OrderStat[]> {
  const { start, end } = toRange(period)
  const { data, error } = await supabaseAdmin.rpc('get_order_stats', { p_start: start, p_end: end })
  if (error) throw new Error(`getOrderStats: ${error.message}`)
  return (data ?? []).map((r: any) => ({ status: r.status, count: Number(r.count) || 0 }))
}

export async function getVatOwed(period: Period | DateRange, rate = 0.18): Promise<VatResult & { rate: number }> {
  const { start, end } = toRange(period)
  const { data, error } = await supabaseAdmin.rpc('get_vat_owed', { p_start: start, p_end: end, p_rate: rate })
  if (error) throw new Error(`getVatOwed: ${error.message}`)
  const row = (Array.isArray(data) ? data[0] : data) ?? { gross: 0, net: 0, vat: 0 }
  return {
    gross: Number(row.gross) || 0,
    net: Number(row.net) || 0,
    vat: Number(row.vat) || 0,
    rate,
  }
}

export async function getRepeatRate(period: Period | DateRange): Promise<{ repeat_rate_pct: number }> {
  const { start, end } = toRange(period)
  const { data, error } = await supabaseAdmin.rpc('get_repeat_rate', { p_start: start, p_end: end })
  if (error) throw new Error(`getRepeatRate: ${error.message}`)
  return { repeat_rate_pct: Number(data) || 0 }
}

// =============================================================================
// AI ბუღალტრის tool layer (Gemini 2.5 Flash function calling)
// =============================================================================
// financeTools — Gemini-ს გადასაცემი function declarations (whitelist).
// runFinanceTool — dispatcher. Gemini-ს მხოლოდ ამ სახელების გამოძახება შეუძლია.
// -----------------------------------------------------------------------------

const PERIOD_ENUM: Period[] = ['today', 'week', 'month', 'last_month', 'year', 'all']

/** Gemini function declarations. გადასცი model-ს `tools: [{ functionDeclarations: financeTools }]` */
export const financeTools = [
  {
    name: 'getRevenue',
    description: 'მოცემული პერიოდის ჯამური ბრუნვა (customer-paid total, GEL). მხოლოდ confirmed/shipped/delivered.',
    parameters: {
      type: 'object',
      properties: { period: { type: 'string', enum: PERIOD_ENUM } },
      required: ['period'],
    },
  },
  {
    name: 'getProfit',
    description: 'საქონლის gross profit: revenue − COGS = net (GEL). მოითხოვს products.cost_price-ს.',
    parameters: {
      type: 'object',
      properties: { period: { type: 'string', enum: PERIOD_ENUM } },
      required: ['period'],
    },
  },
  {
    name: 'getAov',
    description: 'საშუალო შეკვეთის ღირებულება (Average Order Value, GEL) მოცემულ პერიოდში.',
    parameters: {
      type: 'object',
      properties: { period: { type: 'string', enum: PERIOD_ENUM } },
      required: ['period'],
    },
  },
  {
    name: 'getTopProducts',
    description: 'ყველაზე გაყიდვადი პროდუქტები ბრუნვით მოცემულ პერიოდში.',
    parameters: {
      type: 'object',
      properties: {
        period: { type: 'string', enum: PERIOD_ENUM },
        limit: { type: 'integer', description: 'რამდენი პროდუქტი (default 5)' },
      },
      required: ['period'],
    },
  },
  {
    name: 'getLowStock',
    description: 'პროდუქტები, რომელთა მარაგი threshold-ზე ნაკლებია.',
    parameters: {
      type: 'object',
      properties: { threshold: { type: 'integer', description: 'default 5' } },
      required: [],
    },
  },
  {
    name: 'getOrderStats',
    description: 'შეკვეთების რაოდენობა სტატუსების მიხედვით მოცემულ პერიოდში.',
    parameters: {
      type: 'object',
      properties: { period: { type: 'string', enum: PERIOD_ENUM } },
      required: ['period'],
    },
  },
  {
    name: 'getVatOwed',
    description: 'გადასახდელი დღგ (VAT 18%, ფასი inclusive): gross/net/vat (GEL).',
    parameters: {
      type: 'object',
      properties: { period: { type: 'string', enum: PERIOD_ENUM } },
      required: ['period'],
    },
  },
  {
    name: 'getRepeatRate',
    description: 'განმეორებითი მყიდველების პროცენტი მოცემულ პერიოდში.',
    parameters: {
      type: 'object',
      properties: { period: { type: 'string', enum: PERIOD_ENUM } },
      required: ['period'],
    },
  },
] as const

/**
 * Gemini function-call dispatcher. იძახე როცა model აბრუნებს functionCall-ს.
 * აბრუნებს deterministic DB შედეგს, რომელსაც უკან გადასცემ Gemini-ს functionResponse-ად.
 */
export async function runFinanceTool(name: string, args: Record<string, any> = {}) {
  switch (name) {
    case 'getRevenue':     return getRevenue(args.period)
    case 'getProfit':      return getProfit(args.period)
    case 'getAov':         return getAov(args.period)
    case 'getTopProducts': return getTopProducts(args.period, args.limit ?? 5)
    case 'getLowStock':    return getLowStock(args.threshold ?? 5)
    case 'getOrderStats':  return getOrderStats(args.period)
    case 'getVatOwed':     return getVatOwed(args.period)
    case 'getRepeatRate':  return getRepeatRate(args.period)
    default:
      throw new Error(`unknown finance tool: ${name}`) // whitelist guard
  }
}
