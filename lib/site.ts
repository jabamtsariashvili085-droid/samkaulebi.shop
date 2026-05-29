// =============================================================================
// lib/site.ts — canonical site configuration for SEO / metadata
// =============================================================================
// SITE_URL is the canonical production origin used for metadataBase, Open Graph
// URLs, canonical links, sitemap and robots. Defaults to the purchased domain;
// override with NEXT_PUBLIC_SITE_URL once a different origin is in use.
// =============================================================================

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://samkaulebi.shop'
).replace(/\/$/, '')

export const SITE_NAME = 'samkaulebi.shop'

export const SITE_DESCRIPTION =
  'პრემიუმ სამკაულები, სუნამოები და თავის მოვლის საშუალებები. საუკეთესო ხარისხი საუკეთესო ფასად.'

// Points awarded to the referrer when a referred customer's order is confirmed.
export const REFERRAL_REWARD_POINTS = 50
