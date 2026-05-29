import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { firstName, lastName, email, phone, address, city, notes, items, subtotal, total } = body

    if (!firstName || !lastName || !phone || !address || !city || !items?.length) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const supabase = createAdminClient()

    // Link the order to the signed-in customer (if any) so it appears in their cabinet.
    const sessionClient = await createClient()
    const { data: { user } } = await sessionClient.auth.getUser()

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        first_name: firstName,
        last_name: lastName,
        email: email || null,
        phone,
        address,
        city,
        notes: notes || null,
        status: 'pending',
        subtotal,
        total,
        user_id: user?.id ?? null,
      })
      .select('id')
      .single()

    if (orderError || !order) {
      console.error('Order insert error:', orderError)
      return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
    }

    const orderItems = items.map((item: { id: string; name: string; price: number; quantity: number; image?: string }) => ({
      order_id: order.id,
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image: item.image || null,
    }))

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems)

    if (itemsError) {
      console.error('Order items insert error:', itemsError)
      return NextResponse.json({ error: 'Failed to save order items' }, { status: 500 })
    }

    return NextResponse.json({ orderId: order.id }, { status: 201 })
  } catch (err) {
    console.error('Unexpected error:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
