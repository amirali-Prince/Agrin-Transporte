import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })

  // Required fields
  const required = ['firstName', 'lastName', 'email', 'phone', 'vehicleMake', 'pickup', 'delivery', 'date']
  for (const field of required) {
    if (!body[field]) {
      return NextResponse.json({ error: `Pflichtfeld fehlt: ${field}` }, { status: 400 })
    }
  }

  // Send Telegram notification
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatAmir = process.env.TELEGRAM_CHAT_ID_AMIR
  const chatTeimur = process.env.TELEGRAM_CHAT_ID_TEIMUR

  if (token && (chatAmir || chatTeimur)) {
    const msg = [
      '🚗 *Neue Transportanfrage*',
      '',
      `*Kunde:* ${body.firstName} ${body.lastName}${body.company ? ` (${body.company})` : ''}`,
      `*Fahrzeug:* ${body.vehicleMake}${body.vehicleModel ? ' ' + body.vehicleModel : ''}${body.vehicleYear ? ' ' + body.vehicleYear : ''}`,
      `*Abholort:* ${body.pickup}`,
      `*Lieferort:* ${body.delivery}`,
      `*Datum:* ${body.date}`,
      `*Priorität:* ${body.priority || 'Standard'}`,
      `*Zustand:* ${body.condition === 'fahrbereit' ? 'Fahrbereit' : 'Nicht fahrbereit'}`,
      body.notes ? `*Anmerkungen:* ${body.notes}` : '',
      '',
      `*Tel:* ${body.phone}`,
      `*E-Mail:* ${body.email}`,
    ].filter(Boolean).join('\n')

    const send = (chatId: string) =>
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text: msg, parse_mode: 'Markdown' }),
      }).catch(() => {})

    await Promise.all([
      chatAmir ? send(chatAmir) : Promise.resolve(),
      chatTeimur ? send(chatTeimur) : Promise.resolve(),
    ])
  }

  return NextResponse.json({ ok: true })
}
