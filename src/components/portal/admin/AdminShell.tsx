'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import type { SessionPayload } from '@/lib/auth'
import type { Invoice, Order, ActiveOrder } from '@/lib/data'
import type { User } from '@/lib/users'
import AdminDashboard from './AdminDashboard'
import AdminKunden from './AdminKunden'
import AdminAuftraege from './AdminAuftraege'
import AdminRechnungen from './AdminRechnungen'
import FahrerTab from '../tabs/FahrerTab'

type Section = 'dashboard' | 'kunden' | 'auftraege' | 'rechnungen' | 'fahrer'

type Props = {
  session: SessionPayload
  users: User[]
  invoices: Invoice[]
  orders: Order[]
  activeOrders: ActiveOrder[]
  logoutAction: () => Promise<never>
}

const NAV: { id: Section; label: string; icon: (active: boolean) => React.ReactNode; fahrerOnly?: boolean }[] = [
  {
    id: 'dashboard', label: 'Dashboard',
    icon: (a) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2 : 1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
      </svg>
    ),
  },
  {
    id: 'kunden', label: 'Kunden',
    icon: (a) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2 : 1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
      </svg>
    ),
  },
  {
    id: 'auftraege', label: 'Aufträge',
    icon: (a) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2 : 1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
  },
  {
    id: 'rechnungen', label: 'Rechnungen',
    icon: (a) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2 : 1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
      </svg>
    ),
  },
  {
    id: 'fahrer', label: 'Fahrer', fahrerOnly: true,
    icon: (a) => (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={a ? 2 : 1.5} className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
      </svg>
    ),
  },
]

export default function AdminShell({ session, users: initialUsers, invoices: initialInvoices, orders: initialOrders, activeOrders: initialActive, logoutAction }: Props) {
  const [section, setSection] = useState<Section>('dashboard')
  const [users, setUsers] = useState(initialUsers)
  const [invoices, setInvoices] = useState(initialInvoices)
  const [orders, setOrders] = useState(initialOrders)
  const [activeOrders, setActiveOrders] = useState(initialActive)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const isFahrer = session.roles.includes('fahrer')
  const visibleNav = NAV.filter(n => !n.fahrerOnly || isFahrer)

  const refreshAll = useCallback(async () => {
    try {
      const [u, inv, ord, act] = await Promise.all([
        fetch('/api/portal/admin/customers').then(r => r.json()),
        fetch('/api/portal/admin/invoices').then(r => r.json()),
        fetch('/api/portal/admin/orders').then(r => r.json()),
        fetch('/api/portal/active-orders').then(r => r.json()),
      ])
      setUsers(u); setInvoices(inv); setOrders(ord); setActiveOrders(act)
    } catch {}
  }, [])

  const openInvoices = invoices.filter(i => i.status === 'offen').length

  return (
    <div className="min-h-screen bg-[#080808] text-white flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] flex-shrink-0">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button onClick={() => setSidebarOpen(o => !o)} className="md:hidden w-8 h-8 flex items-center justify-center text-white/40">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5" />
            </svg>
          </button>
          <Image src="/logo.png" alt="Agrin" width={80} height={28} className="h-7 w-auto" />
          <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.2)' }}>
            Admin
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-white/40 hidden sm:block">Grüezi Herr {session.lastName}</span>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/[0.08]">
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden" onClick={() => setSidebarOpen(false)}
            style={{ backgroundColor: 'rgba(0,0,0,0.6)' }} />
        )}

        {/* Sidebar */}
        <aside className={`
          fixed md:relative z-50 md:z-auto inset-y-0 left-0 md:inset-auto
          w-56 md:w-52 flex-shrink-0
          flex flex-col
          border-r border-white/[0.06]
          transition-transform duration-300 md:transform-none
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `} style={{ backgroundColor: '#0a0a0a', paddingTop: 56 }}>
          {/* md: padding compensates for header */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <p className="text-[10px] font-bold uppercase tracking-widest text-white/20 px-3 mb-2">Navigation</p>
            {visibleNav.map(item => {
              const isActive = section === item.id
              const badge = item.id === 'rechnungen' && openInvoices > 0 ? openInvoices : null
              return (
                <button key={item.id}
                  onClick={() => { setSection(item.id); setSidebarOpen(false) }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all duration-150"
                  style={{
                    backgroundColor: isActive ? 'rgba(201,168,76,0.1)' : 'transparent',
                    color: isActive ? '#C9A84C' : 'rgba(255,255,255,0.5)',
                  }}>
                  {item.icon(isActive)}
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {badge && (
                    <span className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
                      style={{ backgroundColor: '#C9A84C', color: '#000' }}>{badge}</span>
                  )}
                </button>
              )
            })}
          </nav>

          {/* Sidebar footer */}
          <div className="px-3 py-4 border-t border-white/[0.05]">
            <div className="px-3 py-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
              <p className="text-xs font-semibold text-white truncate">{session.firstName} {session.lastName}</p>
              <p className="text-[11px] text-white/30 mt-0.5">{session.company}</p>
            </div>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto">
          {section === 'dashboard' && (
            <AdminDashboard session={session} users={users} invoices={invoices} orders={orders} activeOrders={activeOrders} onNavigate={setSection} />
          )}
          {section === 'kunden' && (
            <AdminKunden users={users} onRefresh={refreshAll} />
          )}
          {section === 'auftraege' && (
            <AdminAuftraege users={users} activeOrders={activeOrders} orders={orders} onRefresh={refreshAll} />
          )}
          {section === 'rechnungen' && (
            <AdminRechnungen users={users} invoices={invoices} onRefresh={refreshAll} />
          )}
          {section === 'fahrer' && isFahrer && (
            <div className="max-w-lg mx-auto">
              <div className="px-4 pt-6">
                <h2 className="text-xl font-bold text-white mb-1">Fahrer Interface</h2>
                <p className="text-xs text-white/30 mb-4">Deine aktiven Transporte</p>
              </div>
              <FahrerTab activeOrders={activeOrders} session={session} />
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
