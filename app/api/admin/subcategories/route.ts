import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null
  return user
}

export async function POST(request: NextRequest) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { category_id, name, name_en, slug, description } = await request.json()
  if (!category_id || !name || !slug) return NextResponse.json({ error: 'category_id, name, slug required' }, { status: 400 })

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('subcategories')
    .insert({ id: slug, category_id, name, name_en: name_en || name, slug, description: description || '' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
