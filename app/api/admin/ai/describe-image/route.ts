import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') return null
  return user
}

const MODEL = 'gemini-2.5-flash'

/** Pull a JSON object out of a model reply that may include prose / ```json fences. */
function extractJson(text: string): { alt_text?: string; tags?: string[]; description?: string } {
  // strip code fences
  let t = text.trim().replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
  // fall back to the first {...} block if there's surrounding prose
  if (!t.startsWith('{')) {
    const first = t.indexOf('{')
    const last = t.lastIndexOf('}')
    if (first !== -1 && last !== -1) t = t.slice(first, last + 1)
  }
  try {
    return JSON.parse(t)
  } catch {
    return {}
  }
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'AI არ არის კონფიგურირებული (GEMINI_API_KEY)' }, { status: 503 })
  }

  const { imageUrl, name } = await request.json()
  if (!imageUrl) return NextResponse.json({ error: 'imageUrl required' }, { status: 400 })

  // Fetch the (R2) image and inline it as base64 for Gemini vision.
  let base64: string
  let mimeType = 'image/jpeg'
  try {
    const imgRes = await fetch(imageUrl)
    if (!imgRes.ok) throw new Error('fetch failed')
    mimeType = imgRes.headers.get('content-type') || 'image/jpeg'
    base64 = Buffer.from(await imgRes.arrayBuffer()).toString('base64')
  } catch {
    return NextResponse.json({ error: 'სურათი ვერ ჩაიტვირთა' }, { status: 400 })
  }

  const prompt =
    `შენ ხარ ქართული ონლაინ მაღაზიის (სამკაულები, სუნამოები, თმისა და სხეულის მოვლა) კონტენტ-მენეჯერი.\n\n` +
    `ნაბიჯები:\n` +
    `1. დააკვირდი ფოტოს და ამოიცანი კონკრეტული პროდუქტი — ბრენდი და სახელი (წაიკითხე ეტიკეტზე/შეფუთვაზე არსებული წარწერა).\n` +
    `2. გამოიყენე Google ძებნა ამ პროდუქტის რეალური ინფორმაციის მოსაძებნად: არომატის ნოტები / შემადგენლობა / მასალა, დანიშნულება, მახასიათებლები, მიმოხილვები.\n` +
    `3. დაწერე ბუნებრივი, გამყიდველი, მაგრამ სიმართლეს დაფუძნებული ქართული აღწერა.\n\n` +
    (name ? `მაღაზიაში შეტანილი სახელი: "${name}".\n\n` : '') +
    `დააბრუნე მხოლოდ ვალიდური JSON ობიექტი (სხვა ტექსტის, ახსნის ან ფენსების გარეშე) ამ ფორმატით:\n` +
    `{\n` +
    `  "description": "2–4 წინადადებიანი ქართული e-commerce აღწერა, რეალურ პროდუქტზე დაფუძნებული (არომატის/მასალის დეტალებით). თუ პროდუქტი ვერ ამოიცანი, აღწერე ის რაც ფოტოზე ჩანს — არ მოიგონო ფაქტები.",\n` +
    `  "alt_text": "მოკლე ქართული alt-text SEO/accessibility-სთვის (მაქს. 12 სიტყვა)",\n` +
    `  "tags": ["5–8 მოკლე ქართული საკვანძო სიტყვა: ბრენდი, ტიპი, არომატი/მასალა, ფერი, დანიშნულება"]\n` +
    `}`

  const body = {
    contents: [
      { parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64 } }] },
    ],
    tools: [{ google_search: {} }],
  }

  let r: Response
  try {
    r = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
      { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
    )
  } catch {
    return NextResponse.json({ error: 'AI სერვისთან კავშირი ვერ მოხერხდა' }, { status: 502 })
  }

  if (!r.ok) {
    console.error('Gemini error:', await r.text())
    return NextResponse.json({ error: 'AI მოთხოვნა ვერ შესრულდა' }, { status: 502 })
  }

  const data = await r.json()
  const parts = data?.candidates?.[0]?.content?.parts ?? []
  const text = parts.map((p: { text?: string }) => p.text ?? '').join('').trim()
  const parsed = extractJson(text)

  return NextResponse.json({
    description: (parsed.description ?? '').trim(),
    altText: (parsed.alt_text ?? '').trim(),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(t => String(t).trim()).filter(Boolean) : [],
  })
}
