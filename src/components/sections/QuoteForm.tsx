'use client'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

export default function QuoteForm() {
  const t = useTranslations('quoteForm')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [customerType, setCustomerType] = useState<'private' | 'company'>('private')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-white mb-3">{t('title')}</h1>
        <p className="text-white/50">{t('subtitle')}</p>
      </div>

      {submitted ? (
        <div className="text-center py-16 bg-zinc-900/60 border border-[#C9A84C]/30 rounded-2xl">
          <div className="w-16 h-16 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-white text-lg font-medium">{t('success')}</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-zinc-950 border border-white/8 rounded-2xl p-8 space-y-5">
          {/* Customer type */}
          <div className="flex rounded-xl overflow-hidden border border-white/10">
            <button
              type="button"
              onClick={() => setCustomerType('private')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${customerType === 'private' ? 'bg-[#C9A84C] text-black' : 'text-white/50 hover:text-white'}`}
            >
              {t('private')}
            </button>
            <button
              type="button"
              onClick={() => setCustomerType('company')}
              className={`flex-1 py-2.5 text-sm font-medium transition-colors ${customerType === 'company' ? 'bg-[#C9A84C] text-black' : 'text-white/50 hover:text-white'}`}
            >
              {t('company')}
            </button>
          </div>

          {/* Personalien */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('firstName')} *</label>
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('lastName')} *</label>
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('email')} *</label>
              <input required type="email" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('phone')} *</label>
              <input required type="tel" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
          </div>

          {customerType === 'company' && (
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('companyName')} *</label>
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
          )}

          {/* Divider */}
          <div className="border-t border-white/5 pt-2">
            <p className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-4">Fahrzeugdaten</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('vehicleMake')} *</label>
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('vehicleYear')}</label>
              <input type="number" min="1900" max="2030" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('vehicleWeight')} *</label>
              <input required type="number" min="0" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('vehicleCondition')}</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors [color-scheme:dark]">
                <option value="running">{t('running')}</option>
                <option value="not_running">{t('notRunning')}</option>
              </select>
            </div>
          </div>

          {/* Transport */}
          <div className="border-t border-white/5 pt-2">
            <p className="text-xs font-semibold text-white/30 tracking-widest uppercase mb-4">Transport</p>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5">{t('pickup')} *</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">{t('delivery')} *</label>
            <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('date')} *</label>
              <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors [color-scheme:dark]" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('priority')}</label>
              <select className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors [color-scheme:dark]">
                <option value="standard">{t('standard')}</option>
                <option value="express">{t('express')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/50 mb-1.5">{t('notes')}</label>
            <textarea
              rows={3}
              placeholder={t('notesPlaceholder')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all text-sm"
          >
            {loading ? '...' : t('submit')}
          </button>
        </form>
      )}
    </div>
  )
}
