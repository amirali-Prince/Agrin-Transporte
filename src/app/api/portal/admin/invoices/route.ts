import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getInvoices, createInvoice } from '@/lib/data'

export async function GET() {
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json(getInvoices())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const formData = await req.formData().catch(() => null)
  if (!formData) return NextResponse.json({ error: 'Invalid form data' }, { status: 400 })

  const customerId = formData.get('customerId') as string
  const customerName = formData.get('customerName') as string
  const customerCompany = formData.get('customerCompany') as string
  const type = (formData.get('type') as string) || 'rechnung'
  const status = (formData.get('status') as string) || 'offen'
  const vehicle = (formData.get('vehicle') as string) || ''
  const amount = parseFloat(formData.get('amount') as string)
  const date = formData.get('date') as string
  const notes = (formData.get('notes') as string) || undefined
  const pdfFile = formData.get('pdf') as File | null

  if (!customerId || !customerName || isNaN(amount) || !date) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
  }

  let pdfUrl: string | undefined

  // Upload PDF to Vercel Blob if available
  if (pdfFile && pdfFile.size > 0) {
    try {
      const { put } = await import('@vercel/blob')
      const safeName = `invoices/${Date.now()}-${pdfFile.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
      const blob = await put(safeName, pdfFile, { access: 'public' })
      pdfUrl = blob.url
    } catch {
      // Blob not configured — continue without PDF URL
    }
  }

  const invoice = createInvoice({
    customerId,
    customerName,
    customerCompany,
    type: type as 'rechnung' | 'quittung',
    status: status as 'offen' | 'bezahlt',
    vehicle,
    amount,
    date,
    notes,
    pdfUrl,
  })

  // Send email via Resend if PDF is available
  if (pdfUrl) {
    const resendKey = process.env.RESEND_API_KEY
    const customerEmail = (() => {
      try {
        const { getUsers } = require('@/lib/users')
        const users = getUsers()
        return users.find((u: { id: string; email?: string }) => u.id === customerId)?.email
      } catch { return null }
    })()

    if (resendKey && customerEmail) {
      const typeLabel = type === 'rechnung' ? 'Rechnung' : 'Quittung'
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${resendKey}` },
        body: JSON.stringify({
          from: 'Agrin Transport <rechnungen@agrin.ch>',
          to: customerEmail,
          subject: `Ihre ${typeLabel} ${invoice.number} — CHF ${amount.toFixed(2)}`,
          html: `
            <div style="font-family:system-ui,sans-serif;max-width:560px;margin:0 auto;padding:32px 24px;background:#0a0a0a;color:#fff;border-radius:16px;">
              <img src="https://www.agrin.ch/logo.png" alt="Agrin Transport" style="height:32px;margin-bottom:24px;" />
              <h2 style="margin:0 0 8px;font-size:20px;">Ihre ${typeLabel} ist verfügbar</h2>
              <p style="color:rgba(255,255,255,0.5);margin:0 0 24px;font-size:14px;">${invoice.number}</p>
              <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:12px;padding:20px;margin-bottom:24px;">
                <table style="width:100%;font-size:14px;">
                  <tr><td style="color:rgba(255,255,255,0.4);padding:4px 0;">Betrag</td><td style="text-align:right;font-weight:700;color:#C9A84C;">CHF ${amount.toFixed(2)}</td></tr>
                  <tr><td style="color:rgba(255,255,255,0.4);padding:4px 0;">Datum</td><td style="text-align:right;">${new Date(date).toLocaleDateString('de-CH')}</td></tr>
                  ${vehicle ? `<tr><td style="color:rgba(255,255,255,0.4);padding:4px 0;">Fahrzeug</td><td style="text-align:right;">${vehicle}</td></tr>` : ''}
                </table>
              </div>
              <a href="${pdfUrl}" style="display:inline-block;background:#C9A84C;color:#000;font-weight:700;padding:12px 24px;border-radius:10px;text-decoration:none;font-size:14px;">PDF herunterladen</a>
              <p style="color:rgba(255,255,255,0.25);font-size:12px;margin-top:32px;">Agrin Transport GmbH · kontakt@agrin.ch · +41 76 545 66 06</p>
            </div>
          `,
        }),
      }).catch(() => {})
    }

    // Telegram notification
    const token = process.env.TELEGRAM_BOT_TOKEN
    const chatAmir = process.env.TELEGRAM_CHAT_ID_AMIR
    if (token && chatAmir) {
      const msg = `📄 *${type === 'rechnung' ? 'Rechnung' : 'Quittung'} erstellt*\n\n*Nummer:* ${invoice.number}\n*Kunde:* ${customerName}\n*Betrag:* CHF ${amount.toFixed(2)}\n*Status:* ${status}`
      fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatAmir, text: msg, parse_mode: 'Markdown' }),
      }).catch(() => {})
    }
  }

  return NextResponse.json(invoice, { status: 201 })
}
