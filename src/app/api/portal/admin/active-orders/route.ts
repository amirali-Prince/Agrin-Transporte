import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getActiveOrders, createActiveOrder, getOrders } from '@/lib/data'

export async function GET() {
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json({ active: getActiveOrders(), history: getOrders() })
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const body = await req.json().catch(() => null)
  if (!body?.customerId || !body?.vehicle || !body?.pickupLocation || !body?.deliveryLocation || !body?.scheduledDate) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
  }

  const order = createActiveOrder({
    customerId: body.customerId,
    customerName: body.customerName,
    customerCompany: body.customerCompany,
    vehicle: body.vehicle,
    pickupLocation: body.pickupLocation,
    deliveryLocation: body.deliveryLocation,
    scheduledDate: body.scheduledDate,
  })

  // Telegram notification
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatTeimur = process.env.TELEGRAM_CHAT_ID_TEIMUR
  if (token && chatTeimur) {
    const msg = `🚗 *Neuer Auftrag erstellt*\n\n*Fahrzeug:* ${order.vehicle}\n*Kunde:* ${order.customerName}\n*Abholort:* ${order.pickupLocation}\n*Lieferort:* ${order.deliveryLocation}\n*Datum:* ${order.scheduledDate}`
    fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatTeimur, text: msg, parse_mode: 'Markdown' }),
    }).catch(() => {})
  }

  return NextResponse.json(order, { status: 201 })
}
