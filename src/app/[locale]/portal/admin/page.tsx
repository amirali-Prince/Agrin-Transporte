import { redirect } from 'next/navigation'
import { getSession, deleteSession } from '@/lib/auth'
import { getUsers, createUser, deleteUser } from '@/lib/users'
import { revalidatePath } from 'next/cache'

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session || session.role !== 'admin') redirect(`/${locale}/portal/login`)

  const users = getUsers()

  async function logoutAction() {
    'use server'
    await deleteSession()
    redirect(`/${locale}/portal/login`)
  }

  async function handleCreate(formData: FormData) {
    'use server'
    const email = (formData.get('email') as string)?.trim()
    const name = (formData.get('name') as string)?.trim()
    const company = (formData.get('company') as string)?.trim()
    const password = formData.get('password') as string
    if (!email || !name || !company || !password || password.length < 8) return
    try { await createUser({ email, name, company, password }) } catch {}
    revalidatePath(`/${locale}/portal/admin`)
  }

  async function handleDelete(id: string) {
    'use server'
    await deleteUser(id)
    revalidatePath(`/${locale}/portal/admin`)
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="flex items-center justify-between px-8 py-4 border-b border-white/[0.06] bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <span className="font-bold text-lg text-[#C9A84C]">AGRIN</span>
          <span className="text-xs px-2 py-0.5 rounded bg-[#C9A84C]/10 text-[#C9A84C] border border-[#C9A84C]/20">Admin</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/40">{session.name}</span>
          <form action={logoutAction}>
            <button type="submit" className="text-xs text-white/50 border border-white/10 px-3 py-1.5 rounded-lg hover:text-white transition-colors">
              Abmelden
            </button>
          </form>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Kunden gesamt', value: users.length },
            { label: 'Aktive Projekte', value: '—' },
            { label: 'Zugangsdaten', value: '—' },
          ].map(s => (
            <div key={s.label} className="rounded-2xl p-5 bg-white/[0.03] border border-white/[0.07]">
              <p className="text-2xl font-bold text-white">{s.value}</p>
              <p className="text-xs text-white/40 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Kundenliste */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-white mb-4">Kunden</h2>
          {users.length === 0 ? (
            <div className="rounded-2xl p-8 text-center bg-white/[0.02] border border-white/[0.06]">
              <p className="text-sm text-white/30">Noch keine Kunden — erstelle den ersten unten.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map(u => (
                <div key={u.id} className="flex items-center justify-between rounded-xl px-5 py-4 bg-white/[0.03] border border-white/[0.07]">
                  <div>
                    <p className="text-sm font-semibold text-white">{u.name}</p>
                    <p className="text-xs text-white/40 mt-0.5">{u.company} · {u.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-white/25">{new Date(u.createdAt).toLocaleDateString('de-CH')}</span>
                    <form action={handleDelete.bind(null, u.id)}>
                      <button type="submit" className="text-xs text-red-400 border border-red-400/20 px-3 py-1 rounded-lg hover:bg-red-400/10 transition-colors">
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
        <div className="rounded-2xl p-7 bg-white/[0.02] border border-white/[0.07]">
          <h2 className="text-base font-bold text-white mb-5">Neuer Kunde anlegen</h2>
          <form action={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { name: 'name', label: 'Name', type: 'text', placeholder: 'Max Muster' },
              { name: 'company', label: 'Firma', type: 'text', placeholder: 'Muster AG' },
              { name: 'email', label: 'E-Mail', type: 'email', placeholder: 'max@firma.ch' },
              { name: 'password', label: 'Passwort', type: 'password', placeholder: 'Min. 8 Zeichen' },
            ].map(f => (
              <div key={f.name}>
                <label className="block text-xs text-white/45 mb-1.5">{f.label}</label>
                <input
                  type={f.type} name={f.name} placeholder={f.placeholder} required
                  className="w-full px-4 py-2.5 rounded-xl text-sm text-white bg-white/5 border border-white/10 outline-none focus:border-[#C9A84C]/40 transition-colors"
                />
              </div>
            ))}
            <div className="sm:col-span-2">
              <button type="submit" className="px-6 py-2.5 rounded-xl font-bold text-sm bg-[#C9A84C] text-black hover:bg-[#b8963e] transition-colors">
                Kunde erstellen
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
