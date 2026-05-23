'use client'

import { useEffect, useState } from 'react'
import type { ActiveOrder, OrderStatus } from '@/lib/data'

const STATUS_STEPS: { key: OrderStatus; label: string }[] = [
  { key: 'angenommen', label: 'Auftrag angenommen' },
  { key: 'unterwegs', label: 'Fahrer auf dem Weg' },
  { key: 'abgeholt', label: 'Fahrzeug abgeholt' },
  { key: 'geliefert', label: 'Geliefert' },
]

function statusIndex(s: OrderStatus) {
  return STATUS_STEPS.findIndex(st => st.key === s)
}

function ActiveOrderCard({ order }: { order: ActiveOrder }) {
  const current = statusIndex(order.status)
  const updated = new Date(order.statusUpdatedAt).toLocaleTimeString('de-CH', { hour: '2-digit', minute: '2-digit' })

  return (
    <div className="rounded-2xl p-5 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="font-semibold text-white">{order.vehicle}</p>
          <p className="text-xs text-white/40 mt-0.5">{order.pickupLocation} → {order.deliveryLocation}</p>
        </div>
        <span className="text-xs text-white/25">Aktualisiert {updated}</span>
      </div>

      <div className="space-y-2">
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
              <span className="text-sm" style={{ color: active ? '#C9A84C' : done ? 'rgba(255,255,255,0.6)' : 'rgba(255,255,255,0.25)' }}>
                {step.label}
              </span>
              {active && <span className="ml-auto text-xs font-medium" style={{ color: '#C9A84C' }}>Aktuell</span>}
            </div>
          )
        })}
      </div>
      {order.driverNote && (
        <p className="mt-3 text-xs text-white/40 italic border-t border-white/[0.05] pt-3">"{order.driverNote}"</p>
      )}
    </div>
  )
}

export default function ActiveOrdersTab({ activeOrders: initial }: { activeOrders: ActiveOrder[] }) {
  const [orders, setOrders] = useState(initial)

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const res = await fetch('/api/portal/active-orders')
        if (res.ok) setOrders(await res.json())
      } catch {}
    }, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="px-5 pt-7">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Aktive Aufträge</h2>
        <span className="text-xs text-white/30">Live · alle 15s</span>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-14 h-14 mx-auto mb-4 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
          <p className="font-semibold text-white/40 text-base mb-1">Keine aktiven Aufträge</p>
          <p className="text-sm text-white/20">Sobald ein Transport läuft, sehen Sie den Live-Status hier.</p>
        </div>
      ) : (
        orders.map(o => <ActiveOrderCard key={o.id} order={o} />)
      )}
    </div>
  )
}
