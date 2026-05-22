import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fahrzeug entsorgen in der Schweiz: Was erlaubt ist und was es kostet',
  description: 'Altes Auto, Motorrad oder Nutzfahrzeug korrekt entsorgen in der Schweiz — Agrin Transporte erklärt die Regeln, Kosten und den Ablauf.',
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
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">Wissen</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3 leading-tight">
              Fahrzeug entsorgen in der Schweiz: Was erlaubt ist und was es kostet
            </h1>
            <div className="flex items-center gap-3 text-white/30 text-sm">
              <span>Agrin Transporte</span>
              <span>·</span>
              <span>18. Mai 2025</span>
              <span>·</span>
              <span>5 Min. Lesezeit</span>
            </div>
          </div>

          <div className="space-y-6 text-white/70 leading-relaxed">

            <p className="text-white/80 text-lg">
              Ein altes Fahrzeug loswerden ist in der Schweiz klar geregelt — aber nicht immer einfach zu überblicken. Ob Totalschaden, Altfahrzeug oder defektes Nutzfahrzeug: Agrin Transporte zeigt den richtigen Weg.
            </p>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Wer darf Fahrzeuge entsorgen?</h2>
              <p className="text-sm">In der Schweiz ist die Entsorgung von Motorfahrzeugen gesetzlich geregelt. Das Fahrzeug muss bei einer zertifizierten Sammelstelle oder einem anerkannten Autoverwerter abgegeben werden. Einfach irgendwo deponieren ist verboten und wird mit Bussen bestraft.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Der korrekte Ablauf Schritt für Schritt</h2>
              <div className="space-y-3">
                {[
                  { step: '1', title: 'Fahrzeug abmelden', text: 'Vor der Entsorgung muss das Fahrzeug beim Strassenverkehrsamt abgemeldet werden. Kontrollschilder abgeben.' },
                  { step: '2', title: 'Zertifizierten Verwerter finden', text: 'In der Schweiz gibt es SLVS-zertifizierte Altfahrzeug-Annahmestellen. Diese sind umweltgerecht und rechtlich korrekt.' },
                  { step: '3', title: 'Transport organisieren', text: 'Fahrtüchtige Fahrzeuge können selbst gefahren werden (ohne Schilder auf Privatgrund). Nicht fahrfähige Fahrzeuge müssen transportiert werden — hier kommen wir ins Spiel.' },
                  { step: '4', title: 'Entsorgungsnachweis erhalten', text: 'Verlangen Sie immer einen schriftlichen Entsorgungsnachweis. Damit sind Sie rechtlich auf der sicheren Seite.' },
                ].map((item) => (
                  <div key={item.step} className="flex gap-4 p-4 bg-zinc-950 border border-white/8 rounded-xl">
                    <span className="w-7 h-7 rounded-full bg-[#C9A84C]/10 border border-[#C9A84C]/30 flex items-center justify-center text-[#C9A84C] text-xs font-bold flex-shrink-0">{item.step}</span>
                    <div>
                      <p className="text-white font-medium text-sm mb-0.5">{item.title}</p>
                      <p className="text-white/50 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Was kostet die Entsorgung?</h2>
              <div className="bg-zinc-950 border border-white/8 rounded-xl p-5 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-white/60">PKW (fahrbereit)</span>
                  <span className="text-white">oft kostenlos bis CHF 100</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-white/60">PKW (nicht fahrbereit)</span>
                  <span className="text-white">CHF 100–300 inkl. Abholung</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-white/60">Nutzfahrzeug / LKW</span>
                  <span className="text-white">auf Anfrage</span>
                </div>
                <div className="flex justify-between border-t border-white/5 pt-2">
                  <span className="text-white/60">Transport zur Sammelstelle</span>
                  <span className="text-white font-medium text-[#C9A84C]">Agrin Transporte</span>
                </div>
              </div>
              <p className="text-white/40 text-xs mt-2">* Preise sind Richtwerte und können je nach Region und Zustand variieren.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Agrin Transporte übernimmt den Abhol-Transport</h2>
              <p className="text-sm">Ihr Fahrzeug ist nicht mehr fahrbereit? Kein Problem — wir holen es mit dem hydraulischen Anhänger direkt bei Ihnen ab und bringen es zur Sammelstelle oder zum Verwerter Ihrer Wahl. Schweizweit.</p>
            </section>

            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6">
              <p className="text-white font-medium mb-1">Fahrzeug entsorgen lassen?</p>
              <p className="text-white/60 text-sm mb-4">Wir organisieren den Transport zur Sammelstelle — schnell, unkompliziert, schweizweit.</p>
              <Link
                href="/#anfrage"
                className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors"
              >
                Jetzt anfragen
              </Link>
            </div>

            <p className="text-white/25 text-xs pt-4 border-t border-white/5">
              Quellen: SLVS (Schweizerische Logistik- und Verwertungssystem für Altfahrzeuge), admin.ch, USG (Umweltschutzgesetz)
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
