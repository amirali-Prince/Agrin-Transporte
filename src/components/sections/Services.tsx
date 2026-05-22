'use client'
import { useTranslations } from 'next-intl'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function Services() {
  const t = useTranslations('services')

  const cards = [
    {
      title: t('card1Title'),
      desc: t('card1Desc'),
      image: '/pkw-transport.jpg',
      span: 'lg:col-span-2',
    },
    {
      title: t('card2Title'),
      desc: t('card2Desc'),
      image: '/gueter-transport.jpg',
      span: '',
    },
    {
      title: t('card3Title'),
      desc: t('card3Desc'),
      image: '/eu-transport.png',
      span: '',
    },
    {
      title: t('card4Title'),
      desc: t('card4Desc'),
      image: null,
      span: 'lg:col-span-2',
    },
  ]

  return (
    <section id="services" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-14">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3 block">{t('badge')}</span>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">{t('title')}</h2>
          <p className="text-white/50 text-lg max-w-xl">{t('subtitle')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-[240px]">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group cursor-default ${card.span}`}
            >
              {/* Image or gradient bg */}
              {card.image ? (
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-zinc-950">
                  <div className="absolute inset-0 opacity-[0.04]" style={{
                    backgroundImage: 'linear-gradient(rgba(201,168,76,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.8) 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                  }} />
                  {/* Firmenkunden icon */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-24 h-24 text-[#C9A84C]/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Gradient overlay bottom */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-white font-bold text-lg mb-1">{card.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{card.desc}</p>
              </div>

              {/* Gold accent top-left */}
              <div className="absolute top-0 left-0 w-1 h-12 bg-[#C9A84C] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
