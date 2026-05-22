'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'

const placeholderLogos = [
  { id: 1, name: 'Partner 1' },
  { id: 2, name: 'Partner 2' },
  { id: 3, name: 'Partner 3' },
  { id: 4, name: 'Partner 4' },
  { id: 5, name: 'Partner 5' },
]

export default function Partners() {
  const t = useTranslations('partners')

  return (
    <section className="py-16 bg-zinc-950 border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-2 block">{t('badge')}</span>
          <h2 className="text-2xl font-bold text-white">{t('title')}</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10">
          {placeholderLogos.map((logo, i) => (
            <motion.div
              key={logo.id}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="w-32 h-14 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center hover:border-[#C9A84C]/30 transition-colors"
            >
              <span className="text-white/20 text-xs font-medium">{logo.name}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
