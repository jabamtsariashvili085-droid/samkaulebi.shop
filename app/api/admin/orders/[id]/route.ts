import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { REFERRAL_REWARD_RATE } from '@/lib/site'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.app_metadata?.role !== 'admin') return null
  return user
}

const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled']

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { status } = body

  if (!status || !VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const admin = createAdminClient()
  const { data, error } = await admin
    .from('orders')
    .update({ status })
    .eq('id', id)
    .select('id, status, user_id, total')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Referral reward: when a referred customer's order becomes a real sale
  // (confirmed / shipped / delivered), credit the referrer once.
  if (['confirmed', 'shipped', 'delivered'].includes(status) && data.user_id) {
    await qualifyReferral(admin, data.user_id, Number(data.total) || 0)
  }

  return NextResponse.json(data)
}

async function qualifyReferral(admin: ReturnType<typeof createAdminClient>, referredUserId: string, orderTotal: number) {
  const points = Math.round(orderTotal * REFERRAL_REWARD_RATE)

  const { data: ref } = await admin
    .from('referrals')
    .select('id, referrer_id')
    .eq('referred_id', referredUserId)
    .eq('status', 'pending')
    .maybeSingle()
  if (!ref) return

  // The status guard makes this idempotent under concurrent confirmations.
  const { data: updated } = await admin
    .from('referrals')
    .update({ status: 'qualified', points_awarded: points, qualified_at: new Date().toISOString() })
    .eq('id', ref.id)
    .eq('status', 'pending')
    .select('id')
    .maybeSingle()
  if (!updated) return

  const { data: refProfile } = await admin.from('profiles').select('points').eq('id', ref.referrer_id).maybeSingle()
  await admin
    .from('profiles')
    .update({ points: (refProfile?.points ?? 0) + points })
    .eq('id', ref.referrer_id)
}
