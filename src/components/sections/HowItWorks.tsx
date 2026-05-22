'use client'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import { motion } from 'framer-motion'

const steps = [
  {
    num: '01',
    title: 'Anfrage stellen',
    desc: 'Schnellanfrage oder detaillierte Offerte — in 2 Minuten ausgefüllt. Per Formular, Telefon oder WhatsApp.',
  },
  {
    num: '02',
    title: 'Offerte erhalten',
    desc: 'Teimur meldet sich persönlich innerhalb von 24 Stunden mit einem fairen, transparenten Angebot.',
  },
  {
    num: '03',
    title: 'Transport bestätigen',
    desc: 'Datum, Abholort und Lieferort bestätigen — alles läuft direkt mit dem Inhaber, kein Callcenter.',
  },
  {
    num: '04',
    title: 'Sicher geliefert',
    desc: 'Teimur fährt persönlich. Ihr Fahrzeug kommt pünktlich, sicher und in einwandfreiem Zustand an.',
  },
]

export default function HowItWorks() {
  const locale = useLocale()

  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3 block">Ablauf</span>
          <h2 className="text-4xl font-bold text-white">So einfach funktioniert es</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line desktop */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-[#C9A84C]/30 to-transparent" />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className="relative text-center"
            >
              <div className="w-16 h-16 rounded-full bg-black border border-[#C9A84C]/40 flex items-center justify-center mx-auto mb-5 relative z-10">
                <span className="text-[#C9A84C] font-bold text-lg">{step.num}</span>
              </div>
              <h3 className="text-white font-semibold mb-2">{step.title}</h3>
              <p className="text-white/45 text-sm leading-relaxed">{step.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href={`/${locale}#anfrage`}
            className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-8 py-4 rounded-full transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.3)]"
          >
            Jetzt anfragen
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  )
}
