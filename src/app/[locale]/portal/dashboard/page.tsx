import { redirect } from 'next/navigation'
import { getSession, deleteSession } from '@/lib/auth'
import { getUserById } from '@/lib/users'
import PortalSidebar from '@/components/ui/PortalSidebar'
import Link from 'next/link'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session) redirect(`/${locale}/portal/login`)
  if (session.role === 'admin') redirect(`/${locale}/portal/admin`)

  const user = getUserById(session.userId)

  async function logoutAction() {
    'use server'
    await deleteSession()
    redirect(`/${locale}/portal/login`)
  }

  const stats = [
    { label: 'Aktive Aufträge', value: '—', sub: 'in Bearbeitung' },
    { label: 'Abgeschlossene Aufträge', value: '—', sub: 'gesamt' },
    { label: 'Offene Rechnungen', value: '—', sub: 'ausstehend' },
    { label: 'Nächster Transport', value: '—', sub: 'geplant' },
  ]

  return (
    <div className="flex min-h-screen bg-black">
      <PortalSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
              <p className="text-white/40 text-sm mt-1">
                Willkommen, {user?.name ?? session.name} — {user?.company}
              </p>
            </div>
            <form action={logoutAction}>
              <button type="submit" className="text-xs text-white/40 border border-white/10 px-3 py-1.5 rounded-lg hover:text-white transition-colors">
                Abmelden
              </button>
            </form>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map(s => (
              <div key={s.label} className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-5">
                <p className="text-white/40 text-xs mb-1">{s.label}</p>
                <p className="text-3xl font-bold text-white">{s.value}</p>
                <p className="text-white/25 text-xs mt-1">{s.sub}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <Link href={`/${locale}#anfrage`} className="flex items-center gap-3 p-5 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-2xl hover:bg-[#C9A84C]/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-[#C9A84C]/20 flex items-center justify-center text-[#C9A84C]">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Neuer Auftrag</p>
                <p className="text-white/40 text-xs">Anfrage stellen</p>
              </div>
            </Link>
            <Link href={`/${locale}/portal/orders`} className="flex items-center gap-3 p-5 bg-zinc-950 border border-white/[0.08] rounded-2xl hover:border-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Aufträge</p>
                <p className="text-white/40 text-xs">Übersicht</p>
              </div>
            </Link>
            <Link href={`/${locale}/portal/invoices`} className="flex items-center gap-3 p-5 bg-zinc-950 border border-white/[0.08] rounded-2xl hover:border-white/15 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/60">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" /></svg>
              </div>
              <div>
                <p className="text-white font-medium text-sm">Abrechnungen</p>
                <p className="text-white/40 text-xs">Rechnungen</p>
              </div>
            </Link>
          </div>

          <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-6">
            <h2 className="text-white font-semibold mb-4">Letzte Aufträge</h2>
            <div className="text-center py-12 text-white/25 text-sm">
              <svg className="w-12 h-12 mx-auto mb-3 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Noch keine Aufträge vorhanden
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
