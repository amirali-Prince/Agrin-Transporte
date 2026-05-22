import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalSidebar from '@/components/ui/PortalSidebar'
import Link from 'next/link'

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  confirmed: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  in_transit: 'bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/20',
  delivered: 'bg-green-500/10 text-green-400 border-green-500/20',
}
const statusLabels: Record<string, string> = {
  pending: 'Ausstehend',
  confirmed: 'Bestätigt',
  in_transit: 'In Fahrt',
  delivered: 'Geliefert',
}

export default async function OrdersPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let user = null
  let orders: { id: string; pickup: string; delivery: string; vehicle: string; date: string; status: string; priority: string }[] = []

  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    user = userData.user

    if (user) {
      const { data } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_id', user.id)
        .order('created_at', { ascending: false })
      orders = data ?? []
    }
  } catch {}

  if (!user) redirect(`/${locale}/portal/login`)

  return (
    <div className="flex min-h-screen bg-black">
      <PortalSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-white">Aufträge</h1>
              <p className="text-white/40 text-sm mt-1">{orders.length} Aufträge gesamt</p>
            </div>
            <Link
              href={`/${locale}#anfrage`}
              className="flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Neuer Auftrag
            </Link>
          </div>

          <div className="bg-zinc-950 border border-white/8 rounded-2xl overflow-hidden">
            {orders.length === 0 ? (
              <div className="text-center py-16 text-white/25 text-sm">
                <svg className="w-12 h-12 mx-auto mb-3 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Noch keine Aufträge vorhanden
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-white/8">
                  <tr>
                    {['Fahrzeug', 'Von', 'Nach', 'Datum', 'Priorität', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-white/30 text-xs font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-4 text-white font-medium">{order.vehicle}</td>
                      <td className="px-5 py-4 text-white/60">{order.pickup}</td>
                      <td className="px-5 py-4 text-white/60">{order.delivery}</td>
                      <td className="px-5 py-4 text-white/60">{order.date}</td>
                      <td className="px-5 py-4">
                        {order.priority === 'express' && (
                          <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-0.5 rounded-full">Express</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${statusColors[order.status] ?? ''}`}>
                          {statusLabels[order.status] ?? order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
