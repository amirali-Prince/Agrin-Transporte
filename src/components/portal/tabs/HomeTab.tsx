'use client'

import type { SessionPayload } from '@/lib/auth'
import type { Invoice, Order, ActiveOrder } from '@/lib/data'

type Tab = 'home' | 'invoices' | 'history' | 'active' | 'book' | 'fahrer'

type Props = {
  session: SessionPayload
  invoices: Invoice[]
  orders: Order[]
  activeOrders: ActiveOrder[]
  onTabChange: (tab: Tab) => void
}

export default function HomeTab({ session, invoices, orders, activeOrders, onTabChange }: Props) {
  const openInvoices = invoices.filter(i => i.status === 'offen').length
  const totalOrders = orders.length

  const cards = [
    {
      tab: 'invoices' as Tab,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      ),
      label: 'Rechnungen',
      value: openInvoices === 0 ? '0 Offene' : `${openInvoices} Offen${openInvoices === 1 ? 'e' : 'e'}`,
      urgent: openInvoices > 0,
    },
    {
      tab: 'active' as Tab,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
        </svg>
      ),
      label: 'Aktive Aufträge',
      value: `${activeOrders.length} Aktiv`,
      urgent: false,
    },
    {
      tab: 'history' as Tab,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Auftragshistorie',
      value: `${totalOrders} Aufträge`,
      urgent: false,
    },
    {
      tab: 'book' as Tab,
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-7 h-7">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: 'Transport buchen',
      value: 'Anfrage stellen',
      urgent: false,
    },
  ]

  return (
    <div className="px-5 pt-7 pb-4">
      <h1 className="text-2xl font-bold text-white mb-1">
        Grüezi Herr {session.lastName}
      </h1>
      <p className="text-sm text-white/40 mb-8">{session.company}</p>

      <div className="grid grid-cols-2 gap-3">
        {cards.map(card => (
          <button
            key={card.tab}
            onClick={() => onTabChange(card.tab)}
            className="flex flex-col items-start p-5 rounded-2xl text-left transition-all duration-200 active:scale-95"
            style={{
              backgroundColor: card.urgent ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.04)',
              border: card.urgent ? '1px solid rgba(201,168,76,0.3)' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            <div className="mb-3" style={{ color: card.urgent ? '#C9A84C' : 'rgba(255,255,255,0.5)' }}>
              {card.icon}
            </div>
            <p className="text-xs text-white/40 mb-1">{card.label}</p>
            <p className="font-bold text-white text-base leading-tight" style={{ color: card.urgent ? '#C9A84C' : 'white' }}>
              {card.value}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}
