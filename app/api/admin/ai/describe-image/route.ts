import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') return null
  return user
}

const MODEL = 'gemini-2.5-flash'

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
    `შენ ეხმარები ქართულ ონლაინ მაღაზიას (სამკაულები, სუნამოები, თმისა და სხეულის მოვლა). ` +
    `დააკვირდი პროდუქტის ფოტოს და დააბრუნე:\n` +
    `- alt_text: მოკლე, ბუნებრივი ქართული აღწერა SEO-სა და accessibility-სთვის (მაქს. 12 სიტყვა; აღწერს რა ჩანს ფოტოზე).\n` +
    `- tags: 5–8 მოკლე ქართული საკვანძო სიტყვა/ფრაზა (მასალა, ფერი, ტიპი, სტილი, დანიშნულება).\n` +
    (name ? `პროდუქტის სახელი: "${name}".` : '')

  const body = {
    contents: [
      { parts: [{ text: prompt }, { inline_data: { mime_type: mimeType, data: base64 } }] },
    ],
    generationConfig: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'OBJECT',
        properties: {
          alt_text: { type: 'STRING' },
          tags: { type: 'ARRAY', items: { type: 'STRING' } },
        },
        required: ['alt_text', 'tags'],
      },
    },
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
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? '{}'
  let parsed: { alt_text?: string; tags?: string[] } = {}
  try {
    parsed = JSON.parse(text)
  } catch {
    return NextResponse.json({ error: 'AI პასუხი ვერ დამუშავდა' }, { status: 502 })
  }

  return NextResponse.json({
    altText: (parsed.alt_text ?? '').trim(),
    tags: Array.isArray(parsed.tags) ? parsed.tags.map(t => String(t).trim()).filter(Boolean) : [],
  })
}
