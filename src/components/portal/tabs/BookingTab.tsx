'use client'

import { useState } from 'react'
import type { SessionPayload } from '@/lib/auth'

type CustomerType = 'privat' | 'firma'
type Condition = 'fahrbereit' | 'nicht_fahrbereit'
type Priority = 'standard' | 'express'

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs text-white/45 mb-1.5">
        {label}{required && <span className="text-[#C9A84C] ml-0.5">*</span>}
      </label>
      {children}
    </div>
  )
}

const inputCls = "w-full bg-white/[0.04] border border-white/[0.09] rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/40 transition-colors [color-scheme:dark]"

export default function BookingTab({ session, locale }: { session: SessionPayload; locale: string }) {
  const [customerType, setCustomerType] = useState<CustomerType>('privat')
  const [condition, setCondition] = useState<Condition>('fahrbereit')
  const [priority, setPriority] = useState<Priority>('standard')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const fd = new FormData(e.currentTarget)
    const body = {
      customerType,
      firstName: fd.get('firstName'),
      lastName: fd.get('lastName'),
      email: fd.get('email'),
      phone: fd.get('phone'),
      company: customerType === 'firma' ? fd.get('company') : undefined,
      vehicleMake: fd.get('vehicleMake'),
      vehicleModel: fd.get('vehicleModel'),
      vehicleYear: fd.get('vehicleYear'),
      vehicleWeight: fd.get('vehicleWeight'),
      condition,
      pickup: fd.get('pickup'),
      delivery: fd.get('delivery'),
      date: fd.get('date'),
      priority,
      notes: fd.get('notes'),
      locale,
    }

    try {
      const res = await fetch('/api/portal/booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.error || 'Fehler beim Senden. Bitte erneut versuchen.')
      }
    } catch {
      setError('Verbindungsfehler. Bitte erneut versuchen.')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="px-5 pt-7">
        <h2 className="text-xl font-bold text-white mb-6">Transport buchen</h2>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mb-5"
            style={{ backgroundColor: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)' }}>
            <svg className="w-8 h-8" fill="none" stroke="#C9A84C" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white font-semibold text-lg mb-2">Anfrage gesendet</p>
          <p className="text-sm text-white/40 mb-8">Wir melden uns so schnell wie möglich bei Ihnen.</p>
          <button
            onClick={() => setSubmitted(false)}
            className="text-sm font-medium px-6 py-2.5 rounded-xl transition-colors"
            style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}
          >
            Neue Anfrage
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="px-5 pt-7 pb-6">
      <h2 className="text-xl font-bold text-white mb-6">Transport buchen</h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Kundentyp */}
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          {(['privat', 'firma'] as const).map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setCustomerType(t)}
              className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize"
              style={{
                backgroundColor: customerType === t ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: customerType === t ? '#C9A84C' : 'rgba(255,255,255,0.4)',
              }}
            >
              {t === 'privat' ? 'Privatperson' : 'Firma'}
            </button>
          ))}
        </div>

        {/* Personalien */}
        <div className="pt-1">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">Kontaktdaten</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Vorname" required>
                <input name="firstName" required defaultValue={session.firstName} className={inputCls} />
              </Field>
              <Field label="Nachname" required>
                <input name="lastName" required defaultValue={session.lastName} className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="E-Mail" required>
                <input name="email" type="email" required className={inputCls} />
              </Field>
              <Field label="Telefon" required>
                <input name="phone" type="tel" required placeholder="+41 76 ..." className={inputCls} />
              </Field>
            </div>
            {customerType === 'firma' && (
              <Field label="Firmenname" required>
                <input name="company" required defaultValue={session.company || ''} className={inputCls} />
              </Field>
            )}
          </div>
        </div>

        {/* Fahrzeug */}
        <div className="border-t border-white/[0.05] pt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">Fahrzeugdaten</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Marke" required>
                <input name="vehicleMake" required placeholder="z.B. BMW" className={inputCls} />
              </Field>
              <Field label="Modell">
                <input name="vehicleModel" placeholder="z.B. X5" className={inputCls} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Baujahr">
                <input name="vehicleYear" type="number" min={1900} max={2030} placeholder="2020" className={inputCls} />
              </Field>
              <Field label="Gewicht (kg)">
                <input name="vehicleWeight" type="number" min={0} placeholder="1500" className={inputCls} />
              </Field>
            </div>
            <Field label="Zustand">
              <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                {([['fahrbereit', 'Fahrbereit'], ['nicht_fahrbereit', 'Nicht fahrbereit']] as const).map(([val, lbl]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setCondition(val)}
                    className="flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                    style={{
                      backgroundColor: condition === val ? 'rgba(201,168,76,0.15)' : 'transparent',
                      color: condition === val ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {lbl}
                  </button>
                ))}
              </div>
            </Field>
          </div>
        </div>

        {/* Transport */}
        <div className="border-t border-white/[0.05] pt-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-white/25 mb-3">Transport</p>
          <div className="space-y-3">
            <Field label="Abholort" required>
              <input name="pickup" required placeholder="Strasse, PLZ Ort" className={inputCls} />
            </Field>
            <Field label="Lieferort" required>
              <input name="delivery" required placeholder="Strasse, PLZ Ort" className={inputCls} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Wunschdatum" required>
                <input name="date" type="date" required className={inputCls} />
              </Field>
              <Field label="Priorität">
                <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
                  {([['standard', 'Standard'], ['express', 'Express']] as const).map(([val, lbl]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setPriority(val)}
                      className="flex-1 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                      style={{
                        backgroundColor: priority === val ? 'rgba(201,168,76,0.15)' : 'transparent',
                        color: priority === val ? '#C9A84C' : 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {lbl}
                    </button>
                  ))}
                </div>
              </Field>
            </div>
            <Field label="Anmerkungen">
              <textarea
                name="notes"
                rows={3}
                placeholder="Besondere Anforderungen, Schlüsselübergabe, etc."
                className={`${inputCls} resize-none`}
              />
            </Field>
          </div>
        </div>

        {error && (
          <p className="text-xs text-red-400 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 rounded-xl font-bold text-sm transition-all duration-200 disabled:opacity-50"
          style={{ backgroundColor: '#C9A84C', color: '#000' }}
        >
          {loading ? 'Wird gesendet…' : 'Anfrage senden'}
        </button>
      </form>
    </div>
  )
}
