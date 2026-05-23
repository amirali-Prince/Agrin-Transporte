'use client'

import { useEffect, useState } from 'react'
import type { ActiveOrder, OrderStatus } from '@/lib/data'
import type { SessionPayload } from '@/lib/auth'

const STATUS_STEPS: { key: OrderStatus; label: string; desc: string }[] = [
  { key: 'angenommen', label: 'Angenommen', desc: 'Auftrag wurde entgegengenommen' },
  { key: 'unterwegs', label: 'Unterwegs', desc: 'Auf dem Weg zum Abholort' },
  { key: 'abgeholt', label: 'Abgeholt', desc: 'Fahrzeug wurde abgeholt' },
  { key: 'geliefert', label: 'Geliefert', desc: 'Zustellung abgeschlossen' },
]

function statusIndex(s: OrderStatus) {
  return STATUS_STEPS.findIndex(st => st.key === s)
}

function OrderCard({ order, onUpdate }: { order: ActiveOrder; onUpdate: (id: string, status: OrderStatus, note: string) => Promise<void> }) {
  const current = statusIndex(order.status)
  const [note, setNote] = useState(order.driverNote || '')
  const [updating, setUpdating] = useState(false)
  const [open, setOpen] = useState(false)

  const next = STATUS_STEPS[current + 1]

  async function handleNext() {
    if (!next) return
    setUpdating(true)
    await onUpdate(order.id, next.key, note)
    setUpdating(false)
  }

  async function handleNote() {
    setUpdating(true)
    await onUpdate(order.id, order.status, note)
    setUpdating(false)
  }

  return (
    <div className="rounded-2xl mb-4 overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      {/* Header */}
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-start justify-between p-5 text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{order.vehicle}</p>
          <p className="text-xs text-white/40 mt-0.5 truncate">{order.pickupLocation} → {order.deliveryLocation}</p>
        </div>
        <div className="flex items-center gap-2 ml-3 flex-shrink-0">
          <span className="text-xs font-medium px-2.5 py-1 rounded-full"
            style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
            {STATUS_STEPS[current]?.label}
          </span>
          <svg
            className="w-4 h-4 text-white/30 transition-transform duration-200"
            style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}
            fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-white/[0.05]">
          {/* Progress */}
          <div className="pt-4 space-y-2.5">
            {STATUS_STEPS.map((step, i) => {
              const done = i <= current
              const active = i === current
              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{
                      backgroundColor: done ? (active ? '#C9A84C' : 'rgba(201,168,76,0.3)') : 'rgba(255,255,255,0.08)',
                      border: active ? '2px solid #C9A84C' : 'none',
                    }}>
                    {done && !active && (
                      <svg className="w-3 h-3" fill="none" stroke="white" strokeWidth={2.5} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="text-sm" style={{ color: active ? '#C9A84C' : done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}>
                      {step.label}
                    </span>
                    {active && <p className="text-xs text-white/30 mt-0.5">{step.desc}</p>}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Note */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Fahrer-Notiz (sichtbar für Kunden)</label>
            <textarea
              rows={2}
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="z.B. Lieferung verzögert…"
              className="w-full rounded-xl px-4 py-2.5 text-sm text-white placeholder:text-white/20 resize-none focus:outline-none focus:border-[#C9A84C]/40 transition-colors"
              style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
            />
          </div>

          <div className="flex gap-2">
            {order.driverNote !== note && (
              <button
                onClick={handleNote}
                disabled={updating}
                className="flex-1 py-3 text-sm font-medium rounded-xl transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}
              >
                Notiz speichern
              </button>
            )}
            {next && (
              <button
                onClick={handleNext}
                disabled={updating}
                className="flex-1 py-3 text-sm font-bold rounded-xl transition-all disabled:opacity-50 active:scale-95"
                style={{ backgroundColor: '#C9A84C', color: '#000' }}
              >
                {updating ? '…' : `→ ${next.label}`}
              </button>
            )}
            {!next && (
              <div className="flex-1 py-3 text-sm font-medium rounded-xl text-center"
                style={{ backgroundColor: 'rgba(201,168,76,0.1)', color: 'rgba(201,168,76,0.6)', border: '1px solid rgba(201,168,76,0.2)' }}>
                Abgeschlossen
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FahrerTab({ activeOrders: initial, session }: { activeOrders: ActiveOrder[]; session: SessionPayload }) {
  const [orders, setOrders] = useState(initial)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/portal/active-orders')
        if (res.ok) setOrders(await res.json())
      } catch {}
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  async function refresh() {
    setRefreshing(true)
    try {
      const res = await fetch('/api/portal/active-orders')
      if (res.ok) setOrders(await res.json())
    } catch {}
    setRefreshing(false)
  }

  async function updateStatus(id: string, status: OrderStatus, driverNote: string) {
    try {
      await fetch('/api/portal/fahrer/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, driverNote }),
      })
      const res = await fetch('/api/portal/active-orders')
      if (res.ok) setOrders(await res.json())
    } catch {}
  }

  return (
    <div className="px-5 pt-7">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-white">Fahrer Dashboard</h2>
          <p className="text-xs text-white/30 mt-0.5">Grüezi {session.firstName}</p>
        </div>
        <button
          onClick={refresh}
          disabled={refreshing}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-colors disabled:opacity-50"
          style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
          title="Aktualisieren"
        >
          <svg className={`w-4 h-4 text-white/50 ${refreshing ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-14 h-14 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <p className="font-semibold text-white/40 text-base mb-1">Keine aktiven Aufträge</p>
          <p className="text-sm text-white/20">Neue Aufträge erscheinen hier automatisch.</p>
        </div>
      ) : (
        orders.map(o => (
          <OrderCard key={o.id} order={o} onUpdate={updateStatus} />
        ))
      )}

      <p className="text-center text-xs text-white/20 mt-4">Automatische Aktualisierung alle 15s</p>
    </div>
  )
}
