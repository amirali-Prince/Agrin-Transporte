'use client'

import { useState } from 'react'
import Image from 'next/image'
import type { SessionPayload } from '@/lib/auth'
import type { Invoice, Order, ActiveOrder } from '@/lib/data'
import HomeTab from './tabs/HomeTab'
import InvoicesTab from './tabs/InvoicesTab'
import OrderHistoryTab from './tabs/OrderHistoryTab'
import ActiveOrdersTab from './tabs/ActiveOrdersTab'
import BookingTab from './tabs/BookingTab'
import FahrerTab from './tabs/FahrerTab'

type Tab = 'home' | 'invoices' | 'history' | 'active' | 'book' | 'fahrer'

const DOCK_TABS: { id: Tab; label: string; icon: React.ReactNode; adminOnly?: boolean; fahrerOnly?: boolean }[] = [
  {
    id: 'home',
    label: 'Start',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.126 1.126 0 011.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
      </svg>
    ),
  },
  {
    id: 'invoices',
    label: 'Rechnungen',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'history',
    label: 'Verlauf',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'active',
    label: 'Aktiv',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    id: 'book',
    label: 'Buchen',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
  },
  {
    id: 'fahrer',
    label: 'Fahrer',
    fahrerOnly: true,
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-6 h-6">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
]

type Props = {
  session: SessionPayload
  invoices: Invoice[]
  orders: Order[]
  activeOrders: ActiveOrder[]
  locale: string
  logoutAction: () => Promise<never>
}

export default function PortalShell({ session, invoices, orders, activeOrders, locale, logoutAction }: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('home')
  const isFahrer = session.roles.includes('fahrer')

  const visibleTabs = DOCK_TABS.filter(t => !t.fahrerOnly || isFahrer)
  const openInvoices = invoices.filter(i => i.status === 'offen')

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06]">
        <Image src="/logo.png" alt="Agrin" width={80} height={28} className="h-7 w-auto" />
        <form action={logoutAction}>
          <button type="submit" className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10">
            Abmelden
          </button>
        </form>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28">
        {activeTab === 'home' && (
          <HomeTab session={session} invoices={invoices} orders={orders} activeOrders={activeOrders} onTabChange={setActiveTab} />
        )}
        {activeTab === 'invoices' && <InvoicesTab invoices={invoices} />}
        {activeTab === 'history' && <OrderHistoryTab orders={orders} />}
        {activeTab === 'active' && <ActiveOrdersTab activeOrders={activeOrders} />}
        {activeTab === 'book' && <BookingTab session={session} locale={locale} />}
        {activeTab === 'fahrer' && isFahrer && <FahrerTab activeOrders={activeOrders} session={session} />}
      </div>

      {/* Mac Dock */}
      <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center py-4 px-6">
        <nav className="flex items-center gap-1 px-4 py-2 rounded-2xl backdrop-blur-xl"
          style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {visibleTabs.map(tab => {
            const isActive = activeTab === tab.id
            const badge = tab.id === 'invoices' && openInvoices.length > 0 ? openInvoices.length : null
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={tab.label}
                className="relative flex items-center justify-center w-12 h-12 rounded-xl transition-all duration-200"
                style={{
                  color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.45)',
                  backgroundColor: isActive ? 'rgba(201,168,76,0.12)' : 'transparent',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                {tab.icon}
                {badge && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                    style={{ backgroundColor: '#C9A84C', color: '#000' }}>
                    {badge}
                  </span>
                )}
              </button>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
