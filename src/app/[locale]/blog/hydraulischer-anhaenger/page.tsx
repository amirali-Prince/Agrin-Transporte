import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Warum ein hydraulischer Anhänger besser ist — für Ihr Fahrzeug',
  description: 'Der hydraulische Absenkanhänger schont Fahrzeuge, erreicht enge Stellen und ist sicherer als klassische Rampen. Agrin Transporte erklärt warum.',
}

export default function BlogPost() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="../blog" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Zurück zum Blog
          </Link>

          <div className="mb-10">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">Technik</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3 leading-tight">
              Warum ein hydraulischer Anhänger besser ist — für Ihr Fahrzeug
            </h1>
            <div className="flex items-center gap-3 text-white/30 text-sm">
              <span>Agrin Transporte</span><span>·</span>
              <span>12. Mai 2025</span><span>·</span><span>4 Min. Lesezeit</span>
            </div>
          </div>

          <div className="space-y-6 text-white/70 leading-relaxed">
            <p className="text-white/80 text-lg">
              Agrin Transporte setzt auf einen hydraulischen Absenkanhänger — und das aus gutem Grund. Was dieses System so besonders macht und warum Ihr Fahrzeug davon profitiert.
            </p>

            <section>
              <h2 className="text-white font-bold text-xl mb-4">Hydraulisch vs. klassische Rampe — der Unterschied</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 bg-zinc-950 border border-white/8 rounded-xl">
                  <p className="text-white/40 text-xs font-semibold tracking-widest uppercase mb-3">Klassischer Anhänger</p>
                  <ul className="space-y-2 text-sm text-white/50">
                    {['Steile Rampenwinkel', 'Gefahr beim Be-/Entladen', 'Probleme bei tiefen Fahrzeugen', 'Benötigt mehr Platz', 'Nicht fahrfähige Autos schwierig'].map(i => (
                      <li key={i} className="flex gap-2"><span className="text-red-400/60">✗</span>{i}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-5 bg-[#C9A84C]/5 border border-[#C9A84C]/20 rounded-xl">
                  <p className="text-[#C9A84C] text-xs font-semibold tracking-widest uppercase mb-3">Hydraulischer Anhänger</p>
                  <ul className="space-y-2 text-sm text-white/70">
                    {['Senkt sich bodentief ab', 'Kein steiler Winkel', 'Ideal für Tiefläufer & Sportwagen', 'Braucht weniger Platz', 'Perfekt für nicht fahrfähige Autos'].map(i => (
                      <li key={i} className="flex gap-2"><span className="text-[#C9A84C]">✓</span>{i}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">5 Situationen wo der hydraulische Anhänger entscheidend ist</h2>
              <div className="space-y-3">
                {[
                  { num: '1', title: 'Sportwagen & Tiefläufer', text: 'Fahrzeuge mit geringer Bodenfreiheit — Porsche, Ferrari, getungte Autos — können auf klassischen Rampen aufsitzen. Hydraulisch: kein Problem.' },
                  { num: '2', title: 'Nicht fahrfähige Fahrzeuge', text: 'Defekte, beschädigte oder abgemeldete Fahrzeuge können ohne Eigenkraft auf den Anhänger gezogen oder geschoben werden.' },
                  { num: '3', title: 'Enge Einfahrten & Tiefgaragen', text: 'Der hydraulische Anhänger nimmt weniger vertikalen Platz ein beim Beladen — ideal für beengte Zugänge.' },
                  { num: '4', title: 'Oldtimer & Sammelfahrzeuge', text: 'Schonenderes Verladen schützt den Unterboden und verhindert Beschädigungen bei wertvollen Fahrzeugen.' },
                  { num: '5', title: 'Motorräder & Kleinkraftfahrzeuge', text: 'Die flache Auffahrt macht das Verladen von Motorrädern und Rollern deutlich sicherer als mit steiler Rampe.' },
                ].map(item => (
                  <div key={item.num} className="flex gap-4 p-4 bg-zinc-950 border border-white/8 rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-xs font-bold flex-shrink-0">{item.num}</span>
                    <div>
                      <p className="text-white font-medium text-sm mb-0.5">{item.title}</p>
                      <p className="text-white/50 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Unser hydraulischer Anhänger — technische Details</h2>
              <div className="bg-zinc-950 border border-white/8 rounded-xl p-5 grid grid-cols-2 gap-3 text-sm">
                {[
                  ['Nutzlast', 'bis 3\'500 kg'],
                  ['Ladefläche', 'für alle gängigen PKW'],
                  ['Absenkung', 'bodentief hydraulisch'],
                  ['Sicherung', 'Zurrgurte + Radklemmen'],
                ].map(([key, val]) => (
                  <div key={key}>
                    <p className="text-white/35 text-xs">{key}</p>
                    <p className="text-white font-medium">{val}</p>
                  </div>
                ))}
              </div>
            </section>

            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6">
              <p className="text-white font-medium mb-1">Fahrzeug schonend transportieren lassen?</p>
              <p className="text-white/60 text-sm mb-4">Mit hydraulischem Anhänger — für alle Fahrzeugtypen und Zugangssituationen.</p>
              <Link href="/#anfrage" className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
                Jetzt anfragen
              </Link>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
