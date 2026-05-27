import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { createClient } from '@/lib/supabase/server'
import { r2Client, R2_BUCKET } from '@/lib/r2/client'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { filename, contentType, folder = 'products' } = await request.json()

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'filename and contentType required' }, { status: 400 })
  }

  const ext = filename.split('.').pop()?.toLowerCase()
  const allowed = ['jpg', 'jpeg', 'png', 'webp', 'avif']
  if (!ext || !allowed.includes(ext)) {
    return NextResponse.json({ error: 'Only jpg, png, webp, avif allowed' }, { status: 400 })
  }

  const key = `${folder}/${Date.now()}-${filename.replace(/[^a-zA-Z0-9.\-_]/g, '-')}`

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(r2Client, command, { expiresIn: 300 })

  return NextResponse.json({
    presignedUrl,
    key,
    publicUrl: `${process.env.NEXT_PUBLIC_R2_URL}/${key}`,
  })
}
