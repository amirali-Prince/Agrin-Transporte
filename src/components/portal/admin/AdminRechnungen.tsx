'use client'

import { useRef, useState } from 'react'
import type { Invoice } from '@/lib/data'
import type { User } from '@/lib/users'

type Props = { users: User[]; invoices: Invoice[]; onRefresh: () => Promise<void> }

function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} onClick={onClose} />
      <div className="relative w-full sm:max-w-lg rounded-t-2xl sm:rounded-2xl z-10"
        style={{ backgroundColor: '#111', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '92vh', overflowY: 'auto' }}>
        <div className="flex items-center justify-between p-5 border-b border-white/[0.07]">
          <h3 className="font-bold text-white text-lg">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-lg text-white/40 hover:text-white"
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

export default function AdminRechnungen({ users, invoices, onRefresh }: Props) {
  const [filter, setFilter] = useState<'all' | 'offen' | 'bezahlt'>('all')
  const [typeFilter, setTypeFilter] = useState<'all' | 'rechnung' | 'quittung'>('all')
  const [search, setSearch] = useState('')
  const [showUpload, setShowUpload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [pdfFile, setPdfFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const filtered = invoices.filter(i => {
    if (filter !== 'all' && i.status !== filter) return false
    if (typeFilter !== 'all' && i.type !== typeFilter) return false
    if (search) {
      const q = search.toLowerCase()
      return i.customerName.toLowerCase().includes(q) || i.number.toLowerCase().includes(q) || i.vehicle.toLowerCase().includes(q)
    }
    return true
  })

  const openTotal = invoices.filter(i => i.status === 'offen').reduce((s, i) => s + i.amount, 0)
  const paidTotal = invoices.filter(i => i.status === 'bezahlt').reduce((s, i) => s + i.amount, 0)

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault(); setLoading(true); setError('')
    const fd = new FormData(e.currentTarget)
    if (pdfFile) fd.append('pdf', pdfFile)
    const customerId = fd.get('customerId') as string
    const customer = users.find(u => u.id === customerId)
    if (!customer) { setError('Kunden auswählen'); setLoading(false); return }
    fd.append('customerName', `${customer.firstName} ${customer.lastName}`)
    fd.append('customerCompany', customer.company)
    const res = await fetch('/api/portal/admin/invoices', { method: 'POST', body: fd })
    setLoading(false)
    if (res.ok) { setShowUpload(false); setPdfFile(null); await onRefresh() }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Fehler') }
  }

  async function toggleStatus(inv: Invoice) {
    setUpdatingId(inv.id)
    const newStatus = inv.status === 'offen' ? 'bezahlt' : 'offen'
    await fetch(`/api/portal/admin/invoices/${inv.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    await onRefresh()
    setUpdatingId(null)
  }

  async function sendEmail(inv: Invoice) {
    setUpdatingId(inv.id)
    await fetch(`/api/portal/admin/invoices/${inv.id}/send-email`, { method: 'POST' })
    setUpdatingId(null)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault(); setDragOver(false)
    const f = e.dataTransfer.files[0]
    if (f?.type === 'application/pdf') setPdfFile(f)
  }

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-white">Rechnungen</h2>
          <p className="text-sm text-white/35 mt-1">
            <span className="text-[#C9A84C]">CHF {openTotal.toFixed(2)} offen</span>
            <span className="mx-2 text-white/20">·</span>
            <span className="text-green-400">CHF {paidTotal.toFixed(2)} bezahlt</span>
          </p>
        </div>
        <button onClick={() => { setShowUpload(true); setError(''); setPdfFile(null) }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95"
          style={{ backgroundColor: '#C9A84C', color: '#000' }}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
          </svg>
          Hochladen
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-4">
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          {(['all', 'offen', 'bezahlt'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize"
              style={{
                backgroundColor: filter === f ? 'rgba(201,168,76,0.15)' : 'transparent',
                color: filter === f ? '#C9A84C' : 'rgba(255,255,255,0.4)',
              }}>
              {f === 'all' ? 'Alle' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="flex gap-1 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
          {(['all', 'rechnung', 'quittung'] as const).map(f => (
            <button key={f} onClick={() => setTypeFilter(f)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all capitalize"
              style={{
                backgroundColor: typeFilter === f ? 'rgba(255,255,255,0.08)' : 'transparent',
                color: typeFilter === f ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.35)',
              }}>
              {f === 'all' ? 'Alle Typen' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
        <div className="relative flex-1 min-w-40">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/25" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
          </svg>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Suche…"
            className="w-full pl-8 pr-3 py-2 rounded-xl text-xs text-white outline-none"
            style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }} />
        </div>
      </div>

      {/* Invoice table */}
      <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-white/20 text-sm"
            style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
            Keine Rechnungen gefunden.
          </div>
        ) : (
          filtered.slice().reverse().map((inv, i) => (
            <div key={inv.id} className={`flex items-center gap-3 px-5 py-4 ${i < filtered.length - 1 ? 'border-b border-white/[0.04]' : ''}`}
              style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
              {/* Type indicator */}
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 text-xs font-bold"
                style={{
                  backgroundColor: inv.type === 'rechnung' ? 'rgba(201,168,76,0.12)' : 'rgba(139,92,246,0.12)',
                  color: inv.type === 'rechnung' ? '#C9A84C' : '#A78BFA',
                }}>
                {inv.type === 'rechnung' ? 'R' : 'Q'}
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white">{inv.customerName}</p>
                <p className="text-xs text-white/35 mt-0.5 truncate">{inv.number} · {inv.vehicle || '—'} · {new Date(inv.date).toLocaleDateString('de-CH')}</p>
              </div>
              {/* Amount */}
              <p className="text-sm font-bold text-white flex-shrink-0">CHF {inv.amount.toFixed(2)}</p>
              {/* Status toggle */}
              <button onClick={() => toggleStatus(inv)} disabled={updatingId === inv.id}
                className="px-2.5 py-1 rounded-full text-xs font-bold transition-all flex-shrink-0"
                style={{
                  backgroundColor: inv.status === 'bezahlt' ? 'rgba(16,185,129,0.15)' : 'rgba(201,168,76,0.15)',
                  color: inv.status === 'bezahlt' ? '#10B981' : '#C9A84C',
                }}>
                {updatingId === inv.id ? '…' : inv.status === 'bezahlt' ? '✓ Bezahlt' : 'Offen'}
              </button>
              {/* PDF */}
              {inv.pdfUrl ? (
                <a href={inv.pdfUrl} target="_blank" rel="noopener noreferrer" title="PDF herunterladen"
                  className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors hover:bg-white/10"
                  style={{ color: '#C9A84C' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                  </svg>
                </a>
              ) : (
                <div className="w-8 h-8 flex-shrink-0" />
              )}
              {/* Send email */}
              <button onClick={() => sendEmail(inv)} disabled={updatingId === inv.id || !inv.pdfUrl} title="E-Mail senden"
                className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0 transition-colors hover:bg-white/10 disabled:opacity-30"
                style={{ color: 'rgba(255,255,255,0.4)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                </svg>
              </button>
            </div>
          ))
        )}
      </div>

      {/* Upload Sheet */}
      <Sheet open={showUpload} onClose={() => setShowUpload(false)} title="Rechnung hochladen">
        <form onSubmit={handleUpload} className="space-y-4">
          {/* Customer */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Kunde<span className="text-[#C9A84C] ml-0.5">*</span></label>
            <select name="customerId" required className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}>
              <option value="">Kunden auswählen…</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.company})</option>)}
            </select>
          </div>
          {/* Type + Status */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Typ</label>
              <select name="type" className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}>
                <option value="rechnung">Rechnung</option>
                <option value="quittung">Quittung</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Status</label>
              <select name="status" className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}>
                <option value="offen">Offen</option>
                <option value="bezahlt">Bezahlt</option>
              </select>
            </div>
          </div>
          {/* Vehicle + Amount */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Fahrzeug</label>
              <input name="vehicle" placeholder="BMW X5" className={inputCls} style={inputStyle} />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Betrag (CHF)<span className="text-[#C9A84C] ml-0.5">*</span></label>
              <input name="amount" type="number" min={0} step={0.01} required placeholder="0.00" className={inputCls} style={inputStyle} />
            </div>
          </div>
          {/* Date */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Datum<span className="text-[#C9A84C] ml-0.5">*</span></label>
            <input name="date" type="date" required className={inputCls} style={{ ...inputStyle, colorScheme: 'dark' }}
              defaultValue={new Date().toISOString().split('T')[0]} />
          </div>
          {/* PDF Upload */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">PDF Datei</label>
            <div
              onDragOver={e => { e.preventDefault(); setDragOver(true) }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className="rounded-xl p-6 text-center cursor-pointer transition-all"
              style={{
                backgroundColor: dragOver ? 'rgba(201,168,76,0.08)' : pdfFile ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.03)',
                border: `2px dashed ${dragOver ? 'rgba(201,168,76,0.4)' : pdfFile ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.12)'}`,
              }}>
              {pdfFile ? (
                <>
                  <p className="text-green-400 font-medium text-sm">✓ {pdfFile.name}</p>
                  <p className="text-xs text-white/30 mt-1">{(pdfFile.size / 1024).toFixed(0)} KB</p>
                </>
              ) : (
                <>
                  <svg className="w-8 h-8 mx-auto mb-2 text-white/20" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                  <p className="text-sm text-white/40">PDF hierher ziehen oder klicken</p>
                  <p className="text-xs text-white/20 mt-1">Ohne PDF wird keine E-Mail gesendet</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" accept=".pdf" className="hidden"
              onChange={e => setPdfFile(e.target.files?.[0] || null)} />
          </div>
          {/* Notes */}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Notiz (intern)</label>
            <textarea name="notes" rows={2} placeholder="Interne Anmerkung…"
              className={`${inputCls} resize-none`} style={inputStyle} />
          </div>
          {error && <p className="text-xs text-red-400">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-sm disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ backgroundColor: '#C9A84C', color: '#000' }}>
            {loading ? 'Wird hochgeladen…' : (
              <><span>Speichern</span>{pdfFile && <span className="opacity-70 text-xs">& E-Mail senden</span>}</>
            )}
          </button>
        </form>
      </Sheet>
    </div>
  )
}
