'use client'

import type { SessionPayload } from '@/lib/auth'
import type { Invoice, Order, ActiveOrder } from '@/lib/data'
import type { User } from '@/lib/users'

type Section = 'dashboard' | 'kunden' | 'auftraege' | 'rechnungen' | 'fahrer'

type Props = {
  session: SessionPayload
  users: User[]
  invoices: Invoice[]
  orders: Order[]
  activeOrders: ActiveOrder[]
  onNavigate: (s: Section) => void
}

export default function AdminDashboard({ session, users, invoices, orders, activeOrders, onNavigate }: Props) {
  const now = new Date()
  const thisMonth = invoices.filter(i => {
    const d = new Date(i.date)
    return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && i.status === 'bezahlt'
  })
  const revenue = thisMonth.reduce((s, i) => s + i.amount, 0)
  const openInvoices = invoices.filter(i => i.status === 'offen')
  const openTotal = openInvoices.reduce((s, i) => s + i.amount, 0)

  const stats = [
    {
      label: 'Umsatz (Monat)',
      value: `CHF ${revenue.toFixed(0)}`,
      sub: `${thisMonth.length} bezahlte Rechnungen`,
      color: '#10B981',
      onClick: () => onNavigate('rechnungen'),
    },
    {
      label: 'Aktive Aufträge',
      value: activeOrders.length.toString(),
      sub: 'in Bearbeitung',
      color: '#3B82F6',
      onClick: () => onNavigate('auftraege'),
    },
    {
      label: 'Offene Rechnungen',
      value: openInvoices.length.toString(),
      sub: `CHF ${openTotal.toFixed(0)} ausstehend`,
      color: openInvoices.length > 0 ? '#C9A84C' : '#6B7280',
      onClick: () => onNavigate('rechnungen'),
    },
    {
      label: 'Kunden',
      value: users.length.toString(),
      sub: 'registriert',
      color: '#8B5CF6',
      onClick: () => onNavigate('kunden'),
    },
  ]

  // Build activity feed from recent data
  type FeedItem = { label: string; sub: string; time: string; color: string }
  const feed: FeedItem[] = [
    ...activeOrders.slice(0, 3).map(o => ({
      label: `Aktiver Auftrag: ${o.vehicle}`,
      sub: `${o.pickupLocation} → ${o.deliveryLocation} · ${o.status}`,
      time: new Date(o.statusUpdatedAt).toLocaleString('de-CH', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      color: '#3B82F6',
    })),
    ...invoices.slice(-3).reverse().map(i => ({
      label: `${i.type === 'rechnung' ? 'Rechnung' : 'Quittung'} ${i.number}`,
      sub: `${i.customerName} · CHF ${i.amount.toFixed(2)} · ${i.status}`,
      time: new Date(i.createdAt).toLocaleString('de-CH', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }),
      color: i.status === 'offen' ? '#C9A84C' : '#10B981',
    })),
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 6)

  return (
    <div className="p-6 max-w-4xl">
      <div className="mb-7">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-white/35 mt-1">
          {now.toLocaleDateString('de-CH', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        {stats.map(s => (
          <button key={s.label} onClick={s.onClick}
            className="rounded-2xl p-5 text-left transition-all duration-200 active:scale-95 hover:scale-[1.02]"
            style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div className="w-2 h-2 rounded-full mb-3" style={{ backgroundColor: s.color }} />
            <p className="text-2xl font-bold text-white mb-1">{s.value}</p>
            <p className="text-xs text-white/40">{s.label}</p>
            <p className="text-[11px] text-white/25 mt-0.5">{s.sub}</p>
          </button>
        ))}
      </div>

      {/* Schnellaktionen */}
      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-3">Schnellaktionen</p>
        <div className="flex flex-wrap gap-2">
          {[
            { label: '+ Auftrag erstellen', section: 'auftraege' as Section, color: '#3B82F6' },
            { label: '+ Rechnung hochladen', section: 'rechnungen' as Section, color: '#C9A84C' },
            { label: '+ Kunden anlegen', section: 'kunden' as Section, color: '#8B5CF6' },
          ].map(a => (
            <button key={a.label} onClick={() => onNavigate(a.section)}
              className="px-4 py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95"
              style={{ backgroundColor: `${a.color}15`, color: a.color, border: `1px solid ${a.color}30` }}>
              {a.label}
            </button>
          ))}
        </div>
      </div>

      {/* Activity Feed */}
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-3">Letzte Aktivität</p>
        {feed.length === 0 ? (
          <div className="rounded-2xl p-8 text-center text-white/20 text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
            Noch keine Aktivität
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {feed.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3.5 border-b border-white/[0.04] last:border-0">
                <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ backgroundColor: item.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white font-medium truncate">{item.label}</p>
                  <p className="text-xs text-white/35 mt-0.5 truncate">{item.sub}</p>
                </div>
                <p className="text-xs text-white/20 flex-shrink-0 mt-0.5">{item.time}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
