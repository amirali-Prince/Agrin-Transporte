'use client'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { useState } from 'react'

export default function QuickForm() {
  const t = useTranslations('quickForm')
  const locale = useLocale()
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
    <section id="anfrage" className="py-24 bg-black">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-white mb-3">{t('title')}</h2>
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
            {/* Customer type toggle */}
            <div className="flex rounded-xl overflow-hidden border border-white/10">
              <button
                type="button"
                onClick={() => setCustomerType('private')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  customerType === 'private' ? 'bg-[#C9A84C] text-black' : 'text-white/50 hover:text-white'
                }`}
              >
                {t('private')}
              </button>
              <button
                type="button"
                onClick={() => setCustomerType('company')}
                className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
                  customerType === 'company' ? 'bg-[#C9A84C] text-black' : 'text-white/50 hover:text-white'
                }`}
              >
                {t('company')}
              </button>
            </div>

            {/* Name row */}
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

            {/* Contact row */}
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

            {/* Locations */}
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('pickup')} *</label>
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-white/50 mb-1.5">{t('delivery')} *</label>
              <input required className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
            </div>

            {/* Vehicle + Date row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-white/50 mb-1.5">{t('vehicle')} *</label>
                <input required placeholder={t('vehiclePlaceholder')} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-white/20 focus:outline-none focus:border-[#C9A84C]/50 transition-colors" />
              </div>
              <div>
                <label className="block text-xs text-white/50 mb-1.5">{t('date')} *</label>
                <input required type="date" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors [color-scheme:dark]" />
              </div>
            </div>

            <p className="text-xs text-white/30">{t('dateNote')}</p>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-60 text-black font-bold py-4 rounded-xl transition-all text-sm"
            >
              {loading ? '...' : t('submit')}
            </button>

            <p className="text-center text-xs text-white/30">
              {t('needMore')}{' '}
              <Link href={`/${locale}/offerte`} className="text-[#C9A84C] hover:underline">
                {t('needMoreLink')}
              </Link>
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
