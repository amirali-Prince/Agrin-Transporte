'use client'

import { useState } from 'react'
import type { User } from '@/lib/users'

type Props = { users: User[]; onRefresh: () => Promise<void> }

function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl z-10"
        style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white transition-colors"
            style={{ backgroundColor: 'rgba(255,255,255,0.06)' }}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

const inputCls = "w-full px-4 py-2.5 rounded-xl text-sm text-white outline-none transition-colors placeholder:text-white/20"
const inputStyle = { backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.09)' }

function FieldInput({ label, name, type = 'text', placeholder, required, defaultValue }: {
  label: string; name: string; type?: string; placeholder?: string; required?: boolean; defaultValue?: string
}) {
  return (
    <div>
      <label className="block text-xs text-white/40 mb-1.5">{label}{required && <span className="text-[#C9A84C] ml-0.5">*</span>}</label>
      <input name={name} type={type} placeholder={placeholder} required={required} defaultValue={defaultValue} className={inputCls} style={inputStyle} />
    </div>
  )
}

export default function AdminKunden({ users, onRefresh }: Props) {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState<User | null>(null)
  const [resetUser, setResetUser] = useState<User | null>(null)
  const [tempPassword, setTempPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [error, setError] = useState('')

  const filtered = users.filter(u => {
    const q = search.toLowerCase()
    return (u.firstName + ' ' + u.lastName).toLowerCase().includes(q)
      || u.company.toLowerCase().includes(q)
      || (u.email?.toLowerCase().includes(q) ?? false)
      || (u.phone?.includes(q) ?? false)
  })

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError('')
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/portal/admin/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: fd.get('firstName'), lastName: fd.get('lastName'),
        email: fd.get('email') || undefined, phone: fd.get('phone') || undefined,
        company: fd.get('company'), password: fd.get('password'),
      }),
    })
    setLoading(false)
    if (res.ok) { setShowCreate(false); await onRefresh() }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Fehler') }
  }

  async function handleEdit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); if (!editUser) return
    setLoading(true); setError('')
    const fd = new FormData(e.currentTarget)
    const res = await fetch(`/api/portal/admin/customers/${editUser.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: fd.get('firstName'), lastName: fd.get('lastName'),
        email: fd.get('email') || undefined, phone: fd.get('phone') || undefined,
        company: fd.get('company'),
      }),
    })
    setLoading(false)
    if (res.ok) { setEditUser(null); await onRefresh() }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Fehler') }
  }

  async function handleDelete(id: string) {
    await fetch(`/api/portal/admin/customers/${id}`, { method: 'DELETE' })
    setDeleteConfirm(null); await onRefresh()
  }

  async function handleReset() {
    if (!resetUser) return; setLoading(true)
    const res = await fetch(`/api/portal/admin/customers/${resetUser.id}/reset-password`, { method: 'POST' })
    const d = await res.json()
    setLoading(false)
    if (d.tempPassword) setTempPassword(d.tempPassword)
  }

  return (
    <div className="p-6 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Kunden</h2>
          <p className="text-sm text-white/35 mt-1">{users.length} registrierte Konten</p>
        </div>
        <button onClick={() => { setShowCreate(true); setError('') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{ backgroundColor: '#C9A84C', color: '#000' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Neuer Kunde
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/25" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suchen nach Name, Firma, E-Mail…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm text-white outline-none transition-colors placeholder:text-white/20"
          style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>

      {/* Table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/25 text-sm">
            {search ? 'Keine Treffer.' : 'Noch keine Kunden.'}
          </div>
        ) : (
          filtered.map((u, i) => (
            <div key={u.id} className={`flex items-center gap-4 px-5 py-4 ${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              {/* Avatar */}
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
                style={{ backgroundColor: 'rgba(201,168,76,0.15)', color: '#C9A84C' }}>
                {u.firstName[0]}{u.lastName[0]}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{u.firstName} {u.lastName}</p>
                <p className="text-xs text-white/35 mt-0.5 truncate">
                  {u.company}{u.email ? ` · ${u.email}` : ''}{u.phone ? ` · ${u.phone}` : ''}
                </p>
              </div>
              {/* Role */}
              <span className="text-xs px-2 py-0.5 rounded-full hidden sm:block"
                style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}>
                {u.roles.join(', ')}
              </span>
              {/* Date */}
              <span className="text-xs text-white/20 hidden md:block">
                {new Date(u.createdAt).toLocaleDateString('de-CH')}
              </span>
              {/* Actions */}
              <div className="flex items-center gap-1 flex-shrink-0">
                <button onClick={() => { setEditUser(u); setError('') }} title="Bearbeiten"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white transition-colors hover:bg-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                  </svg>
                </button>
                <button onClick={() => { setResetUser(u); setTempPassword('') }} title="Passwort zurücksetzen"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-[#C9A84C] transition-colors hover:bg-white/5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                  </svg>
                </button>
                <button onClick={() => setDeleteConfirm(u.id)} title="Löschen"
                  className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-red-400 transition-colors hover:bg-red-400/10">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Create Sheet */}
      <Sheet open={showCreate} onClose={() => setShowCreate(false)} title="Neuer Kunde">
        <form onSubmit={handleCreate} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <FieldInput label="Vorname" name="firstName" placeholder="Max" required />
            <FieldInput label="Nachname" name="lastName" placeholder="Muster" required />
          </div>
          <FieldInput label="Firma" name="company" placeholder="Muster AG" required />
          <FieldInput label="E-Mail" name="email" type="email" placeholder="max@firma.ch" />
          <FieldInput label="Telefon" name="phone" type="tel" placeholder="+41 76 123 45 67" />
          <FieldInput label="Passwort" name="password" type="password" placeholder="Min. 8 Zeichen" required />
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
            style={{ backgroundColor: '#C9A84C', color: '#000' }}>
            {loading ? 'Wird erstellt…' : 'Konto erstellen'}
          </button>
        </form>
      </Sheet>

      {/* Edit Sheet */}
      <Sheet open={!!editUser} onClose={() => setEditUser(null)} title="Kunden bearbeiten">
        {editUser && (
          <form onSubmit={handleEdit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <FieldInput label="Vorname" name="firstName" defaultValue={editUser.firstName} required />
              <FieldInput label="Nachname" name="lastName" defaultValue={editUser.lastName} required />
            </div>
            <FieldInput label="Firma" name="company" defaultValue={editUser.company} required />
            <FieldInput label="E-Mail" name="email" type="email" defaultValue={editUser.email} />
            <FieldInput label="Telefon" name="phone" type="tel" defaultValue={editUser.phone} />
            {error && <p className="text-xs text-red-400">{error}</p>}
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
              style={{ backgroundColor: '#C9A84C', color: '#000' }}>
              {loading ? 'Wird gespeichert…' : 'Speichern'}
            </button>
          </form>
        )}
      </Sheet>

      {/* Reset Password Sheet */}
      <Sheet open={!!resetUser} onClose={() => { setResetUser(null); setTempPassword('') }} title="Passwort zurücksetzen">
        {resetUser && (
          <div className="space-y-4">
            <p className="text-sm text-white/60">
              Neues temporäres Passwort für <strong className="text-white">{resetUser.firstName} {resetUser.lastName}</strong> generieren.
            </p>
            {tempPassword ? (
              <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)' }}>
                <p className="text-xs text-white/40 mb-1">Temporäres Passwort (einmalig anzeigen):</p>
                <p className="text-lg font-mono font-bold text-[#C9A84C]">{tempPassword}</p>
                <p className="text-xs text-white/30 mt-2">Bitte sicher weitergeben. Kunde sollte es sofort ändern.</p>
              </div>
            ) : (
              <button onClick={handleReset} disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                style={{ backgroundColor: 'rgba(201,168,76,0.12)', color: '#C9A84C', border: '1px solid rgba(201,168,76,0.25)' }}>
                {loading ? 'Wird generiert…' : 'Temporäres Passwort generieren'}
              </button>
            )}
          </div>
        )}
      </Sheet>

      {/* Delete Confirm */}
      <Sheet open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Kunden löschen?">
        <div className="space-y-4">
          <p className="text-sm text-white/60">Dieses Konto und alle zugehörigen Daten werden unwiderruflich gelöscht.</p>
          <div className="flex gap-3">
            <button onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-3 rounded-xl font-medium text-sm"
              style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.6)' }}>
              Abbrechen
            </button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)}
              className="flex-1 py-3 rounded-xl font-bold text-sm"
              style={{ backgroundColor: 'rgba(239,68,68,0.15)', color: '#F87171', border: '1px solid rgba(239,68,68,0.25)' }}>
              Löschen
            </button>
          </div>
        </div>
      </Sheet>
    </div>
  )
}
