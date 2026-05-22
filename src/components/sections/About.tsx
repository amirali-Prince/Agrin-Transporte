'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

export default function About() {
  const t = useTranslations('about')

  const facts = [t('fact1'), t('fact2'), t('fact3')]

  return (
    <section id="about" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left — photo placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-2xl bg-zinc-900 border border-white/8 overflow-hidden flex items-center justify-center">
              {/* Placeholder until real photo */}
              <div className="flex flex-col items-center gap-3 text-white/20">
                <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="text-sm">Teimur Alizadeh</span>
              </div>
            </div>
            {/* Gold accent bar */}
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-[#C9A84C]/10 border border-[#C9A84C]/20 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-16 h-16 bg-[#C9A84C]/5 border border-[#C9A84C]/10 rounded-xl -z-10" />
          </motion.div>

          {/* Right */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3 block">{t('badge')}</span>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-1">{t('title')}</h2>
            <p className="text-[#C9A84C] font-medium mb-6">{t('subtitle')}</p>
            <p className="text-white/60 text-lg leading-relaxed mb-8">{t('body')}</p>

            {/* Facts */}
            <div className="space-y-3">
              {facts.map((fact) => (
                <div key={fact} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full border border-[#C9A84C]/50 flex items-center justify-center flex-shrink-0">
                    <svg className="w-3 h-3 text-[#C9A84C]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-white/70 text-sm">{fact}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
