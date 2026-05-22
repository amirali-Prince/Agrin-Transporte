'use client'
import { motion } from 'framer-motion'
import Image from 'next/image'

const slots = [
  {
    label: 'PKW-Transport',
    desc: 'Fahrzeuge bis 3\'500 kg — sicher auf dem Anhänger',
    image: '/pkw-transport.jpg',
    size: 'lg:col-span-2 row-span-2',
    minH: 400,
  },
  {
    label: 'EU-Transport',
    desc: 'Schweiz & alle EU-Länder inkl. Verzollung',
    image: '/eu-transport.png',
    size: '',
    minH: 190,
  },
  {
    label: 'Gütertransport',
    desc: 'Nutzfahrzeuge & Güter aller Art',
    image: '/gueter-transport.jpg',
    size: '',
    minH: 190,
  },
]

export default function TransportGallery() {
  return (
    <section className="py-16 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3 block">Einblick</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Echte Transporte</h2>
          <p className="text-white/40 mt-2 text-sm">Professionell. Persönlich. Pünktlich.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {slots.map((slot, i) => (
            <motion.div
              key={slot.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              className={`relative rounded-2xl overflow-hidden group ${slot.size}`}
              style={{ minHeight: slot.minH }}
            >
              <Image
                src={slot.image}
                alt={slot.label}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <h3 className="text-white font-semibold text-base">{slot.label}</h3>
                <p className="text-white/50 text-xs mt-0.5">{slot.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
