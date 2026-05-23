'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'

const LOGOS = [
  { name: 'AMAG', src: '/partner/Amag.svg' },
  { name: 'Black Sea', src: '/partner/Black sea.svg' },
  { name: 'F&B', src: '/partner/F&B.svg' },
  { name: 'K LEE', src: '/partner/K LEE.svg' },
  { name: 'Power', src: '/partner/POwer.svg' },
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
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14">
          {LOGOS.map((logo, i) => (
            <motion.div
              key={logo.name}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="relative w-28 h-10 opacity-30 grayscale hover:opacity-70 hover:grayscale-0 transition-all duration-300"
              title={logo.name}
            >
              <Image src={logo.src} alt={logo.name} fill className="object-contain" sizes="112px" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
