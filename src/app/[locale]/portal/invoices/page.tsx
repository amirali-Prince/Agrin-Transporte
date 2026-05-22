import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import PortalSidebar from '@/components/ui/PortalSidebar'

export default async function InvoicesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  let user = null
  let invoices: { id: string; amount: number; status: string; issued_at: string; order_id: string }[] = []

  try {
    const supabase = await createClient()
    const { data: userData } = await supabase.auth.getUser()
    user = userData.user

    if (user) {
      const { data } = await supabase
        .from('invoices')
        .select('*')
        .eq('customer_id', user.id)
        .order('issued_at', { ascending: false })
      invoices = data ?? []
    }
  } catch {}

  if (!user) redirect(`/${locale}/portal/login`)

  const total = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.amount, 0)

  return (
    <div className="flex min-h-screen bg-black">
      <PortalSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-white">Abrechnungen</h1>
            <p className="text-white/40 text-sm mt-1">{invoices.length} Rechnungen gesamt</p>
          </div>

          {total > 0 && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-2xl p-5 mb-6 flex items-center justify-between">
              <div>
                <p className="text-yellow-400 font-medium">Offener Betrag</p>
                <p className="text-white/60 text-sm">CHF {total.toFixed(2)} ausstehend</p>
              </div>
              <a href="mailto:kontakt@agrin.ch" className="bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400 px-4 py-2 rounded-full text-sm transition-colors">
                Kontakt aufnehmen
              </a>
            </div>
          )}

          <div className="bg-zinc-950 border border-white/8 rounded-2xl overflow-hidden">
            {invoices.length === 0 ? (
              <div className="text-center py-16 text-white/25 text-sm">
                <svg className="w-12 h-12 mx-auto mb-3 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z" />
                </svg>
                Noch keine Rechnungen vorhanden
              </div>
            ) : (
              <table className="w-full text-sm">
                <thead className="border-b border-white/8">
                  <tr>
                    {['Rechnungs-Nr.', 'Datum', 'Betrag (CHF)', 'Status'].map(h => (
                      <th key={h} className="text-left px-5 py-3 text-white/30 text-xs font-medium">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {invoices.map(inv => (
                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/[0.02]">
                      <td className="px-5 py-4 text-white font-mono text-xs">{inv.id.slice(0, 8).toUpperCase()}</td>
                      <td className="px-5 py-4 text-white/60">{new Date(inv.issued_at).toLocaleDateString('de-CH')}</td>
                      <td className="px-5 py-4 text-white font-medium">{inv.amount.toFixed(2)}</td>
                      <td className="px-5 py-4">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${
                          inv.status === 'paid'
                            ? 'bg-green-500/10 text-green-400 border-green-500/20'
                            : 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                        }`}>
                          {inv.status === 'paid' ? 'Bezahlt' : 'Ausstehend'}
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
