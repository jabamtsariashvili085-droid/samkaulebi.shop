import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import sharp from 'sharp'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const formData = await request.formData()
  const file = formData.get('file') as File
  const quality = parseInt(formData.get('quality') as string || '80')
  const maxWidth = parseInt(formData.get('maxWidth') as string || '1920')
  const format = (formData.get('format') as string) || 'webp'

  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const originalBuffer = Buffer.from(await file.arrayBuffer())
  const originalSize = originalBuffer.length

  // Get original metadata
  const meta = await sharp(originalBuffer).metadata()

  // Process with Sharp
  let pipeline = sharp(originalBuffer)

  // Resize if wider than maxWidth
  if (meta.width && meta.width > maxWidth) {
    pipeline = pipeline.resize(maxWidth, undefined, { withoutEnlargement: true })
  }

  // Convert & compress
  if (format === 'webp') {
    pipeline = pipeline.webp({ quality })
  } else if (format === 'jpeg') {
    pipeline = pipeline.jpeg({ quality, mozjpeg: true })
  } else if (format === 'png') {
    pipeline = pipeline.png({ quality, compressionLevel: 9 })
  }

  const optimizedBuffer = await pipeline.toBuffer()
  const optimizedMeta = await sharp(optimizedBuffer).metadata()

  const savings = Math.round((1 - optimizedBuffer.length / originalSize) * 100)

  return NextResponse.json({
    optimizedBase64: optimizedBuffer.toString('base64'),
    format,
    originalSize,
    optimizedSize: optimizedBuffer.length,
    savings,
    originalWidth: meta.width,
    originalHeight: meta.height,
    optimizedWidth: optimizedMeta.width,
    optimizedHeight: optimizedMeta.height,
    originalFormat: meta.format,
  })
}
