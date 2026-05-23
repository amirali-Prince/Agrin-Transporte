'use client'

import { useState } from 'react'
import type { ActiveOrder, Order, OrderStatus } from '@/lib/data'
import type { User } from '@/lib/users'

type Props = { users: User[]; activeOrders: ActiveOrder[]; orders: Order[]; onRefresh: () => Promise<void> }

const STATUS_STEPS: { key: OrderStatus; label: string; color: string }[] = [
  { key: 'angenommen', label: 'Angenommen', color: '#6B7280' },
  { key: 'unterwegs', label: 'Unterwegs', color: '#3B82F6' },
  { key: 'abgeholt', label: 'Abgeholt', color: '#F59E0B' },
  { key: 'geliefert', label: 'Geliefert', color: '#10B981' },
]

function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl z-10"
        style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-colors placeholder:text-white/20"
const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }

export default function AdminAuftraege({ users, activeOrders, orders, onRefresh }: Props) {
  const [tab, setTab] = useState<'aktiv' | 'historie'>('aktiv')
  const [showCreate, setShowCreate] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError('')
    const fd = new FormData(e.currentTarget)
    const customerId = fd.get('customerId') as string
    const customer = users.find(u => u.id === customerId)
    if (!customer) { setError('Kunden auswählen'); setLoading(false); return }
    const res = await fetch('/api/portal/admin/active-orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customerId,
        customerName: `${customer.firstName} ${customer.lastName}`,
        customerCompany: customer.company,
        vehicle: fd.get('vehicle'),
        pickupLocation: fd.get('pickup'),
        deliveryLocation: fd.get('delivery'),
        scheduledDate: fd.get('date'),
      }),
    })
    setLoading(false)
    if (res.ok) { setShowCreate(false); await onRefresh() }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Fehler') }
  }

  async function updateStatus(id: string, status: OrderStatus) {
    setUpdatingId(id)
    await fetch('/api/portal/fahrer/status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await onRefresh()
    setUpdatingId(null)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Aufträge</h2>
          <p className="text-sm text-white/35 mt-1">{activeOrders.length} aktiv · {orders.length} abgeschlossen</p>
        </div>
        <button onClick={() => { setShowCreate(true); setError('') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{ backgroundColor: '#3B82F6', color: '#fff' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Neuer Auftrag
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 rounded-xl mb-5 w-fit" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
        {(['aktiv', 'historie'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2 text-sm font-medium rounded-lg transition-all capitalize"
            style={{
              backgroundColor: tab === t ? 'rgba(59,130,246,0.15)' : 'transparent',
              color: tab === t ? '#60A5FA' : 'rgba(255,255,255,0.4)',
            }}>
            {t === 'aktiv' ? `Aktiv (${activeOrders.length})` : `Historie (${orders.length})`}
          </button>
        ))}
      </div>

      {/* Active orders */}
      {tab === 'aktiv' && (
        activeOrders.length === 0 ? (
          <div className="rounded-2xl p-12 text-center text-white/20 text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            Keine aktiven Aufträge.
          </div>
        ) : (
          <div className="space-y-3">
            {activeOrders.map(o => {
              const si = STATUS_STEPS.findIndex(s => s.key === o.status)
              const step = STATUS_STEPS[si]
              const nextStep = STATUS_STEPS[si + 1]
              return (
                <div key={o.id} className="rounded-2xl p-5"
                  style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div>
                      <p className="font-bold text-white">{o.vehicle}</p>
                      <p className="text-xs text-white/40 mt-0.5">{o.customerName} · {o.customerCompany}</p>
                      <p className="text-xs text-white/30 mt-0.5">{o.pickupLocation} → {o.deliveryLocation}</p>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ backgroundColor: `${step.color}22`, color: step.color }}>
                      {step.label}
                    </span>
                  </div>
                  {/* Status progress */}
                  <div className="flex gap-1 mb-4">
                    {STATUS_STEPS.map((s, i) => (
                      <div key={s.key} className="flex-1 h-1 rounded-full transition-all"
                        style={{ backgroundColor: i <= si ? s.color : 'rgba(255,255,255,0.08)' }} />
                    ))}
                  </div>
                  {/* Admin status control */}
                  <div className="flex gap-2 flex-wrap">
                    {STATUS_STEPS.map((s, i) => (
                      <button key={s.key}
                        onClick={() => updateStatus(o.id, s.key)}
                        disabled={updatingId === o.id || i === si}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all disabled:opacity-40"
                        style={{
                          backgroundColor: i === si ? `${s.color}33` : 'rgba(255,255,255,0.05)',
                          color: i === si ? s.color : 'rgba(255,255,255,0.4)',
                          border: i === si ? `1px solid ${s.color}55` : '1px solid rgba(255,255,255,0.07)',
                        }}>
                        {updatingId === o.id && i !== si ? '…' : s.label}
                      </button>
                    ))}
                  </div>
                  {o.driverNote && (
                    <p className="mt-3 text-xs text-white/35 italic border-t border-white/[0.05] pt-3">
                      Notiz: „{o.driverNote}"
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )
      )}

      {/* History */}
      {tab === 'historie' && (
        orders.length === 0 ? (
          <div className="rounded-2xl p-12 text-center text-white/20 text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            Noch keine abgeschlossenen Aufträge.
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {orders.slice().reverse().map((o, i) => (
              <div key={o.id} className={`flex items-center gap-4 px-5 py-4 ${i < orders.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
                style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-white truncate">{o.vehicle}</p>
                  <p className="text-xs text-white/35 mt-0.5 truncate">{o.pickupLocation} → {o.deliveryLocation}</p>
                  <p className="text-xs text-white/25 mt-0.5">{o.customerName}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  {o.price > 0 && <p className="text-sm font-bold text-white">CHF {o.price.toFixed(2)}</p>}
                  <p className="text-xs text-white/30">{new Date(o.date).toLocaleDateString('de-CH')}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Create Order Sheet */}
      <Sheet open={showCreate} onClose={() => setShowCreate(false)} title="Neuer Auftrag">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Kunde<span className="text-[#C9A84C] ml-0.5">*</span></label>
            <select name="customerId" required className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="">Kunden auswählen…</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.company})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Fahrzeug<span className="text-[#C9A84C] ml-0.5">*</span></label>
            <input name="vehicle" required placeholder="z.B. BMW X5 2022" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Abholort<span className="text-[#C9A84C] ml-0.5">*</span></label>
            <input name="pickup" required placeholder="Strasse, PLZ Ort" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Lieferort<span className="text-[#C9A84C] ml-0.5">*</span></label>
            <input name="delivery" required placeholder="Strasse, PLZ Ort" className={inputCls} style={inputStyle} />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Datum<span className="text-[#C9A84C] ml-0.5">*</span></label>
            <input name="date" type="date" required className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }} />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50"
            style={{ backgroundColor: '#3B82F6', color: '#fff' }}>
            {loading ? 'Wird erstellt…' : 'Auftrag erstellen'}
          </button>
        </form>
      </Sheet>
    </div>
  )
}
