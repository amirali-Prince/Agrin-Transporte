import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PortalSidebar from '@/components/ui/PortalSidebar'

export default async function InvoicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session) redirect(`/${locale}/portal/login`)

  return (
    <div className="flex min-h-screen bg-black">
      <PortalSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl">
          <h1 className="text-2xl font-bold text-white mb-2">Abrechnungen</h1>
          <p className="text-white/40 text-sm mb-8">Ihre Rechnungen und Zahlungen</p>
          <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-6">
            <div className="text-center py-16 text-white/25 text-sm">
              <svg className="w-12 h-12 mx-auto mb-3 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
              </svg>
              Noch keine Rechnungen vorhanden
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
