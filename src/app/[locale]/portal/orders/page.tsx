import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'
import PortalSidebar from '@/components/ui/PortalSidebar'

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session) redirect(`/${locale}/portal/login`)

  return (
    <div className="flex min-h-screen bg-black">
      <PortalSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl">
          <h1 className="text-2xl font-bold text-white mb-2">Aufträge</h1>
          <p className="text-white/40 text-sm mb-8">Ihre Transportaufträge</p>
          <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-6">
            <div className="text-center py-16 text-white/25 text-sm">
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
