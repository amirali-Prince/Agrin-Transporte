import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const ADMIN_EMAILS = ['kontakt@agrin.ch', 'teimur.aizadeh@yahoo.com']
const FROM_ADDRESS = 'Agrin Transporte <noreply@agrin.ch>'

type FormPayload = {
  formType: 'quick' | 'quote'
  customerType: 'private' | 'company'
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName?: string
  pickup: string
  delivery: string
  vehicle?: string
  vehicleMake?: string
  vehicleYear?: string
  vehicleWeight?: string
  vehicleCondition?: string
  date: string
  priority?: string
  notes?: string
}

export function generateConfirmToken(email: string, date: string) {
  return createHmac('sha256', process.env.RESEND_API_KEY ?? 'fallback-secret')
    .update(`${email}:${date}`)
    .digest('hex')
    .slice(0, 20)
}

export async function POST(req: NextRequest) {
  try {
    const data: FormPayload = await req.json()

    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.pickup || !data.delivery || !data.date) {
      return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
    }

    const isQuote = data.formType === 'quote'
    const fullName = `${data.firstName} ${data.lastName}`
    const baseUrl = new URL(req.url).origin

    const token = generateConfirmToken(data.email, data.date)
    const confirmParams = new URLSearchParams({
      email: data.email,
      name: fullName,
      pickup: data.pickup,
      delivery: data.delivery,
      date: data.date,
      token,
    })
    const confirmUrl = `${baseUrl}/api/confirm-order?${confirmParams.toString()}`

    await Promise.all([
      resend.emails.send({
        from: FROM_ADDRESS,
        to: ADMIN_EMAILS,
        subject: `🚛 Neue ${isQuote ? 'Offerte-Anfrage' : 'Schnellanfrage'} von ${fullName}`,
        html: buildAdminEmail(data, fullName, isQuote, confirmUrl),
      }),
      resend.emails.send({
        from: FROM_ADDRESS,
        to: data.email,
        subject: 'Ihre Anfrage bei Agrin Transporte — wir melden uns innerhalb von 24h',
        html: buildReceivedEmail(data, fullName, isQuote),
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[submit-form]', err)
    return NextResponse.json({ error: 'Interner Fehler' }, { status: 500 })
  }
}

// ─── Email helpers ────────────────────────────────────────────────────────────

function row(label: string, value: string | undefined) {
  if (!value) return ''
  return `
    <tr>
      <td style="padding:8px 14px;color:#999;font-size:13px;white-space:nowrap;vertical-align:top;border-bottom:1px solid #1e1e1e">${label}</td>
      <td style="padding:8px 14px;color:#fff;font-size:13px;border-bottom:1px solid #1e1e1e">${value}</td>
    </tr>`
}

function section(title: string, rows: string) {
  return `
    <p style="margin:24px 0 8px;font-size:11px;font-weight:700;letter-spacing:2px;color:#C9A84C;text-transform:uppercase">${title}</p>
    <table style="width:100%;border-collapse:collapse;background:#111;border-radius:10px;overflow:hidden">
      ${rows}
    </table>`
}

function buildAdminEmail(d: FormPayload, fullName: string, isQuote: boolean, confirmUrl: string) {
  const contactRows = row('Name', fullName) + row('E-Mail', d.email) + row('Telefon', d.phone) +
    (d.companyName ? row('Firma', d.companyName) : '') +
    row('Kundentyp', d.customerType === 'company' ? 'Firmenkunde' : 'Privatkunde')

  const vehicleRows = isQuote
    ? row('Fahrzeug', d.vehicleMake) + row('Baujahr', d.vehicleYear) +
      row('Gewicht', d.vehicleWeight ? `${d.vehicleWeight} kg` : undefined) +
      row('Zustand', d.vehicleCondition === 'not_running' ? 'Nicht fahrbereit' : 'Fahrbereit')
    : row('Fahrzeug / Güter', d.vehicle)

  const transportRows = row('Abholort', d.pickup) + row('Lieferort', d.delivery) +
    row('Datum', formatDate(d.date)) +
    row('Priorität', d.priority === 'express' ? '⚡ Express' : 'Standard')

  return emailWrapper(`
    <div style="background:#C9A84C;border-radius:8px;padding:6px 14px;display:inline-block;margin-bottom:20px">
      <span style="color:#000;font-size:12px;font-weight:700;letter-spacing:1px">${isQuote ? 'OFFERTE-ANFRAGE' : 'SCHNELLANFRAGE'}</span>
    </div>
    <h1 style="margin:0 0 6px;font-size:22px;color:#fff">Neue Anfrage eingegangen</h1>
    <p style="margin:0 0 24px;color:#888;font-size:14px">
      ${new Date().toLocaleString('de-CH', { timeZone: 'Europe/Zurich' })} &nbsp;·&nbsp;
      <a href="mailto:${d.email}" style="color:#C9A84C;text-decoration:none">${d.email}</a> &nbsp;·&nbsp;
      <a href="tel:${d.phone}" style="color:#C9A84C;text-decoration:none">${d.phone}</a>
    </p>

    ${section('Kontakt', contactRows)}
    ${section('Fahrzeug / Güter', vehicleRows)}
    ${section('Transport', transportRows)}
    ${d.notes ? section('Bemerkungen', row('Notiz', d.notes)) : ''}

    <div style="margin-top:32px;padding:24px;background:#0d1f0d;border:1px solid #1a3a1a;border-radius:14px;text-align:center">
      <p style="margin:0 0 6px;color:#86efac;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Auftrag annehmen</p>
      <p style="margin:0 0 18px;color:#6b7280;font-size:13px">Ein Klick genügt — der Kunde erhält sofort eine Bestätigungsmail.</p>
      <a href="${confirmUrl}"
         style="display:inline-block;background:#16a34a;color:#fff;font-weight:700;font-size:15px;text-align:center;padding:14px 32px;border-radius:10px;text-decoration:none;letter-spacing:0.3px">
        ✅ &nbsp;Auftrag bestätigen
      </a>
      <p style="margin:14px 0 0;color:#374151;font-size:11px">Dieser Link kann nur einmal sinnvoll verwendet werden.</p>
    </div>
  `)
}

function buildReceivedEmail(d: FormPayload, fullName: string, isQuote: boolean) {
  return emailWrapper(`
    <h1 style="margin:0 0 8px;font-size:22px;color:#fff">Danke, ${d.firstName}!</h1>
    <p style="margin:0 0 24px;color:#888;font-size:15px;line-height:1.6">
      Wir haben Ihre ${isQuote ? 'Offerte-Anfrage' : 'Anfrage'} erhalten und melden uns
      <strong style="color:#fff">innerhalb von 24 Stunden</strong> bei Ihnen.
    </p>

    ${section('Ihre Angaben',
      row('Name', fullName) +
      row('Abholort', d.pickup) +
      row('Lieferort', d.delivery) +
      row('Wunschdatum', formatDate(d.date)) +
      (d.priority === 'express' ? row('Priorität', '⚡ Express') : '')
    )}

    <div style="margin-top:28px;padding:20px;background:#111;border-radius:12px;border-left:3px solid #C9A84C">
      <p style="margin:0 0 4px;color:#C9A84C;font-size:12px;font-weight:700;letter-spacing:1px">FRAGEN? WIR SIND DA.</p>
      <p style="margin:0;color:#ccc;font-size:14px;line-height:1.8">
        Agrin Transporte GmbH<br>
        📞 <a href="tel:+41765456606" style="color:#C9A84C;text-decoration:none">+41 76 545 66 06</a><br>
        ✉️ <a href="mailto:kontakt@agrin.ch" style="color:#C9A84C;text-decoration:none">kontakt@agrin.ch</a>
      </p>
    </div>

    <p style="margin:24px 0 0;color:#555;font-size:12px;text-align:center">
      Diese Bestätigung wurde automatisch versandt.
    </p>
  `)
}

export function buildConfirmedEmail(name: string, pickup: string, delivery: string, date: string) {
  const firstName = name.split(' ')[0]
  return emailWrapper(`
    <div style="text-align:center;margin-bottom:24px">
      <div style="width:64px;height:64px;background:#16a34a;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;margin-bottom:16px">
        <span style="font-size:28px">✅</span>
      </div>
      <h1 style="margin:0 0 8px;font-size:24px;color:#fff">Ihr Auftrag ist bestätigt!</h1>
      <p style="margin:0;color:#888;font-size:15px">Hallo ${firstName}, wir freuen uns auf den Transport.</p>
    </div>

    ${section('Auftragsdetails',
      row('Name', name) +
      row('Abholort', pickup) +
      row('Lieferort', delivery) +
      row('Transportdatum', formatDate(date))
    )}

    <div style="margin-top:28px;padding:20px;background:#0d1f0d;border-radius:12px;border:1px solid #1a3a1a">
      <p style="margin:0 0 6px;color:#86efac;font-size:12px;font-weight:700;letter-spacing:1px">WAS JETZT PASSIERT</p>
      <p style="margin:0;color:#ccc;font-size:14px;line-height:1.8">
        1. Wir nehmen Kontakt auf, um alle Details final zu klären.<br>
        2. Sie erhalten die genaue Uhrzeit und Abholadresse.<br>
        3. Ihr Fahrzeug/Gut wird sicher transportiert.
      </p>
    </div>

    <div style="margin-top:20px;padding:20px;background:#111;border-radius:12px;border-left:3px solid #C9A84C">
      <p style="margin:0 0 4px;color:#C9A84C;font-size:12px;font-weight:700;letter-spacing:1px">BEI FRAGEN</p>
      <p style="margin:0;color:#ccc;font-size:14px;line-height:1.8">
        📞 <a href="tel:+41765456606" style="color:#C9A84C;text-decoration:none">+41 76 545 66 06</a><br>
        ✉️ <a href="mailto:kontakt@agrin.ch" style="color:#C9A84C;text-decoration:none">kontakt@agrin.ch</a>
      </p>
    </div>

    <p style="margin:24px 0 0;color:#555;font-size:12px;text-align:center">
      Agrin Transporte GmbH &nbsp;·&nbsp; Zürich, Schweiz
    </p>
  `)
}

function emailWrapper(content: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif">
  <div style="max-width:580px;margin:0 auto;padding:40px 20px">
    <div style="margin-bottom:28px">
      <span style="font-size:20px;font-weight:800;color:#fff;letter-spacing:-0.5px">AGRIN</span>
      <span style="font-size:20px;font-weight:800;color:#C9A84C;letter-spacing:-0.5px"> TRANSPORTE</span>
    </div>
    <div style="background:#161616;border:1px solid #222;border-radius:16px;padding:32px">
      ${content}
    </div>
    <p style="margin:20px 0 0;text-align:center;color:#444;font-size:11px">
      Agrin Transporte GmbH &nbsp;·&nbsp; Zürich, Schweiz &nbsp;·&nbsp; agrin.ch
    </p>
  </div>
</body>
</html>`
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } catch {
    return dateStr
  }
}
