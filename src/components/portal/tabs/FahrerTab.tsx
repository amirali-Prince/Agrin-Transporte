'use client'

import { useEffect, useRef, useState } from 'react'
import type { ActiveOrder, OrderStatus } from '@/lib/data'
import type { SessionPayload } from '@/lib/auth'

const STEPS: { key: OrderStatus; label: string; color: string; icon: string }[] = [
  { key: 'angenommen', label: 'Angenommen', color: '#6B7280', icon: '📋' },
  { key: 'unterwegs', label: 'Unterwegs', color: '#3B82F6', icon: '🚗' },
  { key: 'abgeholt', label: 'Abgeholt', color: '#F59E0B', icon: '✅' },
  { key: 'geliefert', label: 'Geliefert', color: '#10B981', icon: '🏁' },
]

function stepIndex(s: OrderStatus) { return STEPS.findIndex(x => x.key === s) }

function SuccessFlash({ onDone }: { onDone: () => void }) {
  useEffect(() => { const t = setTimeout(onDone, 1200); return () => clearTimeout(t) }, [onDone])
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      <div className="w-24 h-24 rounded-full flex items-center justify-center animate-ping-once"
        style={{ backgroundColor: 'rgba(16,185,129,0.25)', border: '2px solid #10B981' }}>
        <svg className="w-12 h-12 text-green-400" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
        </svg>
      </div>
    </div>
  )
}

function OrderCard({
  order,
  expanded,
  onToggle,
  onStatusUpdate,
}: {
  order: ActiveOrder
  expanded: boolean
  onToggle: () => void
  onStatusUpdate: (id: string, status: OrderStatus, note: string, photo?: File) => Promise<boolean>
}) {
  const current = stepIndex(order.status)
  const next = STEPS[current + 1]
  const step = STEPS[current]

  const [note, setNote] = useState(order.driverNote || '')
  const [updating, setUpdating] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [savingNote, setSavingNote] = useState(false)
  const [photo, setPhoto] = useState<File | null>(null)
  const photoRef = useRef<HTMLInputElement>(null)

  async function advance() {
    if (!next || updating) return
    setUpdating(true)
    const ok = await onStatusUpdate(order.id, next.key, note, photo || undefined)
    setUpdating(false)
    if (ok) { setShowSuccess(true); setPhoto(null) }
  }

  async function saveNote() {
    setSavingNote(true)
    await onStatusUpdate(order.id, order.status, note)
    setSavingNote(false)
  }

  function openMaps() {
    const q = encodeURIComponent(order.deliveryLocation)
    const ua = navigator.userAgent
    if (/iPhone|iPad/i.test(ua)) window.open(`maps://maps.apple.com/?q=${q}`)
    else window.open(`https://maps.google.com/?q=${q}`)
  }

  const isFinished = !next

  return (
    <>
      {showSuccess && <SuccessFlash onDone={() => setShowSuccess(false)} />}
      <div className="rounded-2xl mb-3 overflow-hidden transition-all duration-300"
        style={{ backgroundColor: expanded ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.03)', border: `1px solid ${expanded ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.07)'}` }}>

        {/* Header */}
        <button onClick={onToggle} className="w-full p-5 text-left flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 text-xl"
            style={{ backgroundColor: `${step.color}22`, border: `1px solid ${step.color}44` }}>
            {step.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-bold text-white text-base leading-tight truncate">{order.vehicle}</p>
            <p className="text-xs text-white/40 mt-0.5 truncate">{order.pickupLocation} → {order.deliveryLocation}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <span className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${step.color}22`, color: step.color }}>
              {step.label}
            </span>
            <svg className="w-4 h-4 text-white/20 mt-1 ml-auto transition-transform duration-200"
              style={{ transform: expanded ? 'rotate(180deg)' : '' }}
              fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </button>

        {/* Expanded Content */}
        {expanded && (
          <div className="px-5 pb-6 space-y-5 border-t border-white/[0.06]">

            {/* Route info */}
            <div className="pt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Abholort</p>
                <p className="text-sm text-white font-medium leading-snug">{order.pickupLocation}</p>
              </div>
              <div className="rounded-xl p-3" style={{ backgroundColor: 'rgba(255,255,255,0.04)' }}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-1">Lieferort</p>
                <p className="text-sm text-white font-medium leading-snug">{order.deliveryLocation}</p>
              </div>
            </div>

            {/* Status Stepper */}
            <div className="flex items-center gap-0">
              {STEPS.map((s, i) => {
                const done = i <= current
                const active = i === current
                return (
                  <div key={s.key} className="flex items-center flex-1 last:flex-none">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm transition-all duration-300"
                        style={{
                          backgroundColor: done ? `${s.color}33` : 'rgba(255,255,255,0.06)',
                          border: active ? `2px solid ${s.color}` : done ? `1px solid ${s.color}66` : '1px solid rgba(255,255,255,0.1)',
                          transform: active ? 'scale(1.15)' : 'scale(1)',
                        }}>
                        {done && !active ? '✓' : (i + 1)}
                      </div>
                      <p className="text-[9px] mt-1 text-center w-14"
                        style={{ color: active ? s.color : done ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.2)' }}>
                        {s.label}
                      </p>
                    </div>
                    {i < STEPS.length - 1 && (
                      <div className="flex-1 h-0.5 mb-4 mx-1 rounded-full transition-all duration-300"
                        style={{ backgroundColor: i < current ? STEPS[i + 1].color + '66' : 'rgba(255,255,255,0.08)' }} />
                    )}
                  </div>
                )
              })}
            </div>

            {/* Action buttons row */}
            <div className="flex gap-2">
              {/* Navigation */}
              <button onClick={openMaps}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{ backgroundColor: 'rgba(59,130,246,0.12)', color: '#60A5FA', border: '1px solid rgba(59,130,246,0.25)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 20.25l.75-2.25m0 0c-.47-1.408-.747-2.89-.747-4.5C9 9.254 11.254 7 14.003 7a4.997 4.997 0 014.997 5.25c0 1.61-.277 3.092-.748 4.5M9.75 18H14.25M3 12h.008v.008H3V12zm1.5-7.5h.008v.008H4.5V4.5zm9 0h.008v.008H13.5V4.5zm3 3h.008v.008H16.5V7.5zm-9 9h.008v.008H7.5V16.5zm9 0h.008v.008H16.5V16.5z" />
                </svg>
                Maps
              </button>

              {/* Photo */}
              <button onClick={() => photoRef.current?.click()}
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{
                  backgroundColor: photo ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                  color: photo ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                  border: photo ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.08)'
                }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                </svg>
                {photo ? 'Foto ✓' : 'Foto'}
              </button>
              <input ref={photoRef} type="file" accept="image/*" capture="environment" className="hidden"
                onChange={e => setPhoto(e.target.files?.[0] || null)} />

              {/* Call dispatch */}
              <a href="tel:+41765456606"
                className="flex items-center justify-center gap-1.5 px-4 py-3 rounded-xl text-sm font-medium transition-all active:scale-95"
                style={{ backgroundColor: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                </svg>
                Anruf
              </a>
            </div>

            {/* Note */}
            <div>
              <label className="block text-xs text-white/30 mb-1.5">Notiz (für Kunden sichtbar)</label>
              <div className="flex gap-2">
                <textarea rows={2} value={note} onChange={e => setNote(e.target.value)}
                  placeholder="z.B. Fahrzeug leicht beschädigt an Tür hinten links…"
                  className="flex-1 rounded-xl px-3 py-2.5 text-sm text-white placeholder:text-white/15 resize-none focus:outline-none transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
                {note !== (order.driverNote || '') && (
                  <button onClick={saveNote} disabled={savingNote}
                    className="px-3 rounded-xl text-xs font-medium transition-all disabled:opacity-40"
                    style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                    {savingNote ? '…' : 'Speichern'}
                  </button>
                )}
              </div>
            </div>

            {/* Main Action */}
            {!isFinished ? (
              <button onClick={advance} disabled={updating}
                className="w-full py-4 rounded-2xl font-bold text-base transition-all duration-200 active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3"
                style={{ backgroundColor: next.color, color: '#fff', boxShadow: `0 8px 24px ${next.color}44` }}>
                {updating ? (
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  <>
                    <span>{next.icon}</span>
                    <span>→ {next.label}</span>
                    {photo && <span className="text-sm opacity-80">+ Foto</span>}
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-4 rounded-2xl font-bold text-base text-center"
                style={{ backgroundColor: 'rgba(16,185,129,0.12)', color: '#10B981', border: '1px solid rgba(16,185,129,0.25)' }}>
                🏁 Auftrag abgeschlossen
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}

export default function FahrerTab({ activeOrders: initial, session }: { activeOrders: ActiveOrder[]; session: SessionPayload }) {
  const [orders, setOrders] = useState(initial)
  const [expandedId, setExpandedId] = useState<string | null>(initial[0]?.id ?? null)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/portal/active-orders')
        if (res.ok) setOrders(await res.json())
      } catch {}
    }, 15000)
    return () => clearInterval(id)
  }, [])

  async function refresh() {
    setRefreshing(true)
    try {
      const res = await fetch('/api/portal/active-orders')
      if (res.ok) {
        const data = await res.json()
        setOrders(data)
        if (!data.find((o: ActiveOrder) => o.id === expandedId)) setExpandedId(data[0]?.id ?? null)
      }
    } catch {}
    setRefreshing(false)
  }

  async function updateStatus(id: string, status: OrderStatus, note: string, photo?: File): Promise<boolean> {
    try {
      let photoUrl: string | undefined
      if (photo) {
        const fd = new FormData(); fd.append('file', photo); fd.append('orderId', id)
        const uploadRes = await fetch('/api/portal/fahrer/photo', { method: 'POST', body: fd })
        if (uploadRes.ok) { const d = await uploadRes.json(); photoUrl = d.url }
      }
      const res = await fetch('/api/portal/fahrer/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, driverNote: note, photoUrl }),
      })
      if (res.ok) {
        const updated = await fetch('/api/portal/active-orders')
        if (updated.ok) setOrders(await updated.json())
        return true
      }
    } catch {}
    return false
  }

  return (
    <div className="px-4 pt-6 pb-32">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-white">Meine Aufträge</h2>
          <p className="text-xs text-white/30 mt-0.5">
            {orders.length === 0 ? 'Keine aktiven Aufträge' : `${orders.length} aktiv`}
          </p>
        </div>
        <button onClick={refresh} disabled={refreshing}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all active:scale-90 disabled:opacity-40"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <svg className={`w-4 h-4 text-white/40 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="text-5xl mb-4">🚗</div>
          <p className="font-semibold text-white/40 mb-1">Keine Aufträge</p>
          <p className="text-sm text-white/20">Neue Aufträge erscheinen hier automatisch.</p>
        </div>
      ) : (
        orders.map(o => (
          <OrderCard
            key={o.id}
            order={o}
            expanded={expandedId === o.id}
            onToggle={() => setExpandedId(expandedId === o.id ? null : o.id)}
            onStatusUpdate={updateStatus}
          />
        ))
      )}
    </div>
  )
}
