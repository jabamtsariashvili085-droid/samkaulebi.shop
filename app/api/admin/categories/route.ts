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

  const body = await request.json()
  const { name, name_en, slug, icon, description } = body

  if (!name || !slug) return NextResponse.json({ error: 'name and slug required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('categories')
    .insert({ id: slug, name, name_en: name_en || name, slug, icon: icon || 'gem', description: description || '' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
