import { redirect } from 'next/navigation'
import Image from 'next/image'
import { getSession, deleteSession } from '@/lib/auth'
import { getUsers, createUser, deleteUser } from '@/lib/users'
import { getInvoices, getOrders, getActiveOrders } from '@/lib/data'
import { revalidatePath } from 'next/cache'
import PortalShell from '@/components/portal/PortalShell'

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) redirect(`/${locale}/portal/login`)

  // If admin is also fahrer, show the full PortalShell
  if (session.roles.includes('fahrer')) {
    const invoices = getInvoices()
    const orders = getOrders()
    const activeOrders = getActiveOrders()

    async function logoutFahrer(): Promise<never> {
      'use server'
      await deleteSession()
      redirect(`/${locale}/portal/login`)
    }

    return (
      <PortalShell
        session={session}
        invoices={invoices}
        orders={orders}
        activeOrders={activeOrders}
        locale={locale}
        logoutAction={logoutFahrer}
      />
    )
  }

  // Pure admin view
  const users = getUsers()
  const allInvoices = getInvoices()
  const allOrders = getOrders()
  const allActive = getActiveOrders()

  async function logoutAction(): Promise<never> {
    'use server'
    await deleteSession()
    redirect(`/${locale}/portal/login`)
  }

  async function handleCreate(formData: FormData) {
    'use server'
    const firstName = (formData.get('firstName') as string)?.trim()
    const lastName = (formData.get('lastName') as string)?.trim()
    const email = (formData.get('email') as string)?.trim() || undefined
    const phone = (formData.get('phone') as string)?.trim() || undefined
    const company = (formData.get('company') as string)?.trim()
    const password = formData.get('password') as string
    if (!firstName || !lastName || !company || !password || password.length < 8) return
    try { await createUser({ firstName, lastName, email, phone, company, password }) } catch {}
    revalidatePath(`/${locale}/portal/admin`)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteUser(id)
    revalidatePath(`/${locale}/portal/admin`)
  }

  return (
    <div className="min-h-screen bg-[#080808] text-white">
      <header className="flex items-center justify-between px-6 py-3 border-b border-white/[0.06]">
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Agrin" width={80} height={28} className="h-7 w-auto" />
          <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
            Admin
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40">Grüezi Herr {session.lastName}</span>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-lg border border-white/10">
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Kunden', value: users.length },
            { label: 'Aktive Aufträge', value: allActive.length },
            { label: 'Aufträge gesamt', value: allOrders.length },
            { label: 'Offene Rechnungen', value: allInvoices.filter(i => i.status === 'offen').length },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Kundenliste */}
        <div className="mb-8">
          <h2 className="text-base font-bold text-white mb-4">Kunden</h2>
          {users.length === 0 ? (
            <div className="rounded-2xl p-8 text-center" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-sm text-white/30">Noch keine Kunden — erstelle den ersten unten.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between rounded-xl px-5 py-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <div>
                    <p className="text-sm font-semibold text-white">{u.firstName} {u.lastName}</p>
                    <p className="text-xs text-white/40 mt-0.5">
                      {u.company}{u.email ? ` · ${u.email}` : ''}{u.phone ? ` · ${u.phone}` : ''}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/25">{new Date(u.createdAt).toLocaleDateString('de-CH')}</span>
                    <form action={handleDelete.bind(null, u.id)}>
                      <button type="submit" className="text-xs text-red-400/70 border border-red-400/15 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-colors">
                        Löschen
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Neuer Kunde */}
        <div className="rounded-2xl p-7" style={{ backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <h2 className="text-base font-bold text-white mb-5">Neuer Kunde anlegen</h2>
          <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'firstName', label: 'Vorname', type: 'text', placeholder: 'Max' },
              { name: 'lastName', label: 'Nachname', type: 'text', placeholder: 'Muster' },
              { name: 'company', label: 'Firma', type: 'text', placeholder: 'Muster AG' },
              { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'max@firma.ch' },
              { name: 'phone', label: 'Telefon', type: 'tel', placeholder: '+41 76 123 45 67' },
              { name: 'password', label: 'Passwort', type: 'password', placeholder: 'Min. 8 Zeichen' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs text-white/45 mb-1.5">{f.label}</label>
                <input
                  type={f.type} name={f.name} placeholder={f.placeholder}
                  required={['firstName', 'lastName', 'company', 'password'].includes(f.name)}
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-colors"
                  style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)' }}
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-sm transition-colors" style={{ backgroundColor: '#C9A84C', color: '#000' }}>
                Kunde erstellen
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
