import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') return null
  return user
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { code, type, value, min_order, max_uses, expires_at } = await request.json()

  if (!code || !['percent', 'fixed'].includes(type) || !value || Number(value) <= 0) {
    return NextResponse.json({ error: 'code, type და value სავალდებულოა' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('discount_codes')
    .insert({
      code: String(code).trim().toUpperCase(),
      type,
      value: Number(value),
      min_order: Number(min_order) || 0,
      max_uses: max_uses ? Number(max_uses) : null,
      expires_at: expires_at || null,
      active: true,
    })
    .select()
    .single()

  if (error) {
    const msg = error.code === '23505' ? 'ასეთი კოდი უკვე არსებობს' : error.message
    return NextResponse.json({ error: msg }, { status: 400 })
  }
  return NextResponse.json(data, { status: 201 })
}
