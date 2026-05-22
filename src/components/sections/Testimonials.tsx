'use client'
import { motion } from 'framer-motion'

const reviews = [
  {
    name: 'Marco B.',
    location: 'Zürich',
    rating: 5,
    text: 'Sehr zuverlässig und professionell. Teimur hat mein Auto pünktlich und ohne Schäden geliefert. Klare Empfehlung!',
    type: 'Privatkunde',
  },
  {
    name: 'Sandra K.',
    location: 'Winterthur',
    rating: 5,
    text: 'Schnelle Reaktion, faire Preise und sehr persönlicher Service. Man merkt, dass der Inhaber selbst fährt — das gibt Vertrauen.',
    type: 'Privatkunde',
  },
  {
    name: 'AutoGarage Müller',
    location: 'Uster',
    rating: 5,
    text: 'Seit Jahren unser Partner für Fahrzeugtransporte. Zuverlässig, pünktlich, unkompliziert. Absolute Topqualität.',
    type: 'Firmenkunde',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <svg key={i} className="w-4 h-4 fill-[#C9A84C]" viewBox="0 0 20 20">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3 block">Was Kunden sagen</span>
          <h2 className="text-4xl font-bold text-white mb-2">Echte Erfahrungen</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <Stars count={5} />
            <span className="text-white/50 text-sm">5.0 · Google Bewertungen</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <motion.div
              key={r.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-zinc-950 border border-white/8 rounded-2xl p-6 hover:border-[#C9A84C]/20 transition-colors"
            >
              <Stars count={r.rating} />
              <p className="text-white/70 text-sm leading-relaxed mt-4 mb-6">"{r.text}"</p>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">{r.name}</p>
                  <p className="text-white/30 text-xs">{r.location}</p>
                </div>
                <span className="text-[10px] bg-white/5 border border-white/10 text-white/40 px-2 py-0.5 rounded-full">{r.type}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Google badge */}
        <div className="mt-10 text-center">
          <a
            href="https://g.page/r/review"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white/30 hover:text-white/60 text-xs transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Alle Google Bewertungen ansehen
          </a>
        </div>
      </div>
    </section>
  )
}
