'use client'

import { useState } from 'react'
import type { Invoice } from '@/lib/data'

function PdfIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m.75 12l3 3m0 0l3-3m-3 3v-6m-1.5-9H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  )
}

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

function InvoiceRow({ invoice }: { invoice: Invoice }) {
  const date = new Date(invoice.date)
  const label = date.toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <div className="flex items-center justify-between py-3 border-b border-white/[0.05] last:border-0">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white truncate">{invoice.vehicle || '—'}</p>
        <p className="text-xs text-white/35 mt-0.5">{label} · {invoice.number}</p>
      </div>
      <div className="flex items-center gap-3 ml-3">
        <span className="text-sm font-semibold text-white">CHF {invoice.amount.toFixed(2)}</span>
        {invoice.pdfUrl ? (
          <a
            href={invoice.pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors"
            style={{ color: '#C9A84C' }}
            title="PDF herunterladen"
          >
            <PdfIcon />
          </a>
        ) : (
          <span className="opacity-20" title="PDF nicht verfügbar"><PdfIcon /></span>
        )}
      </div>
    </div>
  )
}

function GroupedList({ invoices }: { invoices: Invoice[] }) {
  const byYear = invoices.reduce<Record<number, Record<number, Invoice[]>>>((acc, inv) => {
    if (!acc[inv.year]) acc[inv.year] = {}
    if (!acc[inv.year][inv.month]) acc[inv.year][inv.month] = []
    acc[inv.year][inv.month].push(inv)
    return acc
  }, {})

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  if (invoices.length === 0) {
    return <p className="text-sm text-white/25 text-center py-8">Keine Einträge vorhanden</p>
  }

  return (
    <>
      {years.map(year => (
        <div key={year} className="mb-6">
          <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">{year}</p>
          {Object.keys(byYear[year]).map(Number).sort((a, b) => b - a).map(month => (
            <div key={month} className="mb-4">
              <p className="text-xs text-white/20 mb-1 ml-1">{MONTHS[month - 1]}</p>
              <div className="rounded-xl overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-4">
                  {byYear[year][month].map(inv => <InvoiceRow key={inv.id} invoice={inv} />)}
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
    </>
  )
}

export default function InvoicesTab({ invoices }: { invoices: Invoice[] }) {
  const [section, setSection] = useState<'rechnungen' | 'quittungen'>('rechnungen')

  const rechnungen = invoices.filter(i => i.type === 'rechnung')
  const quittungen = invoices.filter(i => i.type === 'quittung')
  const offene = rechnungen.filter(i => i.status === 'offen')
  const bezahlte = rechnungen.filter(i => i.status === 'bezahlt')

  return (
    <div className="px-5 pt-7">
      <h2 className="text-xl font-bold text-white mb-5">Rechnungen & Quittungen</h2>

      {/* Segment */}
      <div className="flex gap-2 mb-6 p-1 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.05)' }}>
        {(['rechnungen', 'quittungen'] as const).map(s => (
          <button
            key={s}
            onClick={() => setSection(s)}
            className="flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize"
            style={{
              backgroundColor: section === s ? 'rgba(201,168,76,0.15)' : 'transparent',
              color: section === s ? '#C9A84C' : 'rgba(255,255,255,0.4)',
            }}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {section === 'rechnungen' && (
        <>
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Offene Rechnungen ({offene.length})</p>
            </div>
            <GroupedList invoices={offene} />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-green-400" />
              <p className="text-xs font-semibold uppercase tracking-wider text-white/50">Bezahlte Rechnungen ({bezahlte.length})</p>
            </div>
            <GroupedList invoices={bezahlte} />
          </div>
        </>
      )}

      {section === 'quittungen' && (
        <GroupedList invoices={quittungen} />
      )}
    </div>
  )
}
