import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generateConfirmToken, buildConfirmedEmail } from '../submit-form/route'

const resend = new Resend(process.env.RESEND_API_KEY)
const FROM_ADDRESS = 'Agrin Transporte <noreply@agrin.ch>'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const email = searchParams.get('email') ?? ''
  const name = searchParams.get('name') ?? ''
  const pickup = searchParams.get('pickup') ?? ''
  const delivery = searchParams.get('delivery') ?? ''
  const date = searchParams.get('date') ?? ''
  const token = searchParams.get('token') ?? ''

  if (!email || !name || !pickup || !delivery || !date || !token) {
    return new NextResponse(errorPage('Ungültiger Link — Parameter fehlen.'), {
      status: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  const expected = generateConfirmToken(email, date)
  if (token !== expected) {
    return new NextResponse(errorPage('Ungültiger oder abgelaufener Bestätigungslink.'), {
      status: 403,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }

  try {
    await resend.emails.send({
      from: FROM_ADDRESS,
      to: email,
      subject: '✅ Ihr Auftrag bei Agrin Transporte wurde bestätigt!',
      html: buildConfirmedEmail(name, pickup, delivery, date),
    })

    return new NextResponse(successPage(name, email, pickup, delivery, date), {
      status: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  } catch (err) {
    console.error('[confirm-order]', err)
    return new NextResponse(errorPage('E-Mail konnte nicht gesendet werden. Bitte kontaktiere direkt kontakt@agrin.ch.'), {
      status: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
    })
  }
}

function successPage(name: string, email: string, pickup: string, delivery: string, date: string) {
  const firstName = name.split(' ')[0]
  const formattedDate = (() => {
    try { return new Date(date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
    catch { return date }
  })()

  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Auftrag bestätigt — Agrin Transporte</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #161616; border: 1px solid #222; border-radius: 20px; padding: 48px 40px; max-width: 480px; width: 100%; text-align: center; }
    .icon { width: 72px; height: 72px; background: #16a34a; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 32px; }
    .brand { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 32px; }
    .brand span { color: #C9A84C; }
    h1 { font-size: 24px; color: #fff; margin-bottom: 10px; }
    p { color: #888; font-size: 15px; line-height: 1.6; margin-bottom: 24px; }
    .details { background: #111; border-radius: 12px; padding: 20px; text-align: left; margin-bottom: 24px; }
    .detail-row { display: flex; justify-content: space-between; padding: 6px 0; border-bottom: 1px solid #1e1e1e; }
    .detail-row:last-child { border-bottom: none; }
    .detail-label { color: #888; font-size: 13px; }
    .detail-value { color: #fff; font-size: 13px; font-weight: 500; }
    .badge { display: inline-block; background: #16a34a22; color: #86efac; border: 1px solid #16a34a44; border-radius: 20px; padding: 4px 14px; font-size: 12px; font-weight: 700; letter-spacing: 1px; margin-bottom: 16px; }
    .footer { color: #444; font-size: 12px; margin-top: 24px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">AGRIN <span>TRANSPORTE</span></div>
    <div class="icon">✅</div>
    <div class="badge">BESTÄTIGT</div>
    <h1>Bestätigungsmail gesendet!</h1>
    <p>${firstName} hat soeben eine Auftragsbestätigung per E-Mail erhalten.</p>
    <div class="details">
      <div class="detail-row"><span class="detail-label">Kunde</span><span class="detail-value">${name}</span></div>
      <div class="detail-row"><span class="detail-label">E-Mail</span><span class="detail-value">${email}</span></div>
      <div class="detail-row"><span class="detail-label">Von</span><span class="detail-value">${pickup}</span></div>
      <div class="detail-row"><span class="detail-label">Nach</span><span class="detail-value">${delivery}</span></div>
      <div class="detail-row"><span class="detail-label">Datum</span><span class="detail-value">${formattedDate}</span></div>
    </div>
    <p style="font-size:13px;color:#555">Du kannst dieses Fenster jetzt schliessen.</p>
    <div class="footer">Agrin Transporte GmbH · Zürich · agrin.ch</div>
  </div>
</body>
</html>`
}

function errorPage(message: string) {
  return `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Fehler — Agrin Transporte</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #0a0a0a; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; }
    .card { background: #161616; border: 1px solid #3a1a1a; border-radius: 20px; padding: 48px 40px; max-width: 480px; width: 100%; text-align: center; }
    .brand { font-size: 16px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 32px; color: #fff; }
    .brand span { color: #C9A84C; }
    .icon { font-size: 48px; margin-bottom: 20px; }
    h1 { font-size: 22px; color: #fff; margin-bottom: 12px; }
    p { color: #888; font-size: 14px; line-height: 1.6; }
    .contact { margin-top: 24px; color: #C9A84C; font-size: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">AGRIN <span>TRANSPORTE</span></div>
    <div class="icon">⚠️</div>
    <h1>Fehler</h1>
    <p>${message}</p>
    <div class="contact">kontakt@agrin.ch &nbsp;·&nbsp; +41 76 545 66 06</div>
  </div>
</body>
</html>`
}
