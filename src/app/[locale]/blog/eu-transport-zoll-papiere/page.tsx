import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Fahrzeugtransport EU: Zoll und Papiere erklärt',
  description: 'Was braucht man für einen Fahrzeugtransport in die EU? Zoll, Carnet, Exportpapiere — Agrin Transporte erklärt alles Schritt für Schritt.',
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
              Fahrzeugtransport EU: Zoll und Papiere erklärt
            </h1>
            <div className="flex items-center gap-3 text-white/30 text-sm">
              <span>Agrin Transporte</span><span>·</span>
              <span>15. Mai 2025</span><span>·</span><span>6 Min. Lesezeit</span>
            </div>
          </div>

          <div className="space-y-6 text-white/70 leading-relaxed">
            <p className="text-white/80 text-lg">
              Die Schweiz ist kein EU-Mitglied — das bedeutet: jeder Fahrzeugtransport über die Grenze ist ein Zollvorgang. Was auf den ersten Blick kompliziert wirkt, ist mit dem richtigen Partner unkompliziert.
            </p>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Schweiz → EU: Was Sie wissen müssen</h2>
              <p className="text-sm">Da die Schweiz nicht Teil der EU-Zollunion ist, muss bei jedem grenzüberschreitenden Transport eine Zollanmeldung gemacht werden. Das gilt sowohl für den Export aus der Schweiz als auch für den Import in ein EU-Land.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Diese Dokumente werden benötigt</h2>
              <div className="space-y-2">
                {[
                  { doc: 'Fahrzeugausweis (Zulassungsschein)', note: 'Original oder beglaubigte Kopie' },
                  { doc: 'Exportverzollung (EZV)', note: 'Wird bei der Schweizer Zollstelle eingereicht' },
                  { doc: 'Kaufvertrag oder Rechnung', note: 'Bei Kauf oder Verkauf über die Grenze' },
                  { doc: 'Vollmacht (bei Beauftragung)', note: 'Wenn Agrin Transporte die Zollabwicklung übernimmt' },
                  { doc: 'Personalausweis / Reisepass', note: 'Des Fahrzeughalters' },
                  { doc: 'Zollformular EX (für Export)', note: 'Für den Nachweis bei der Zollbehörde' },
                ].map((item) => (
                  <div key={item.doc} className="flex gap-3 p-4 bg-zinc-950 border border-white/8 rounded-xl">
                    <svg className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-white text-sm font-medium">{item.doc}</p>
                      <p className="text-white/40 text-xs">{item.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Import in die Schweiz (aus EU)</h2>
              <p className="text-sm mb-3">Bringen Sie ein Fahrzeug aus einem EU-Land in die Schweiz, gelten folgende Regeln:</p>
              <ul className="space-y-2 text-sm">
                {[
                  'Importverzollung bei der Eidgenössischen Zollverwaltung (EZV)',
                  'MWST auf dem Fahrzeugwert (7.7%) wird fällig',
                  'Fahrzeug muss für die Schweiz zugelassen und geprüft werden (MFK)',
                  'Lichter, Spiegel und Sicherheitsstandards müssen CH-konform sein',
                ].map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-[#C9A84C] flex-shrink-0">→</span>
                    <span className="text-white/60">{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Agrin Transporte übernimmt die Zollabwicklung</h2>
              <p className="text-sm">Wir organisieren nicht nur den Transport, sondern erledigen auf Wunsch die gesamte Zoll- und Papierarbeit für Sie. Import, Export, Dokumentation — alles aus einer Hand. Für alle EU-Mitgliedsstaaten.</p>
            </section>

            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6">
              <p className="text-white font-medium mb-1">EU-Transport planen?</p>
              <p className="text-white/60 text-sm mb-4">Wir kümmern uns um Transport und Zoll. Einfach anfragen.</p>
              <Link href="/#anfrage" className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
                Jetzt anfragen
              </Link>
            </div>
            <p className="text-white/25 text-xs pt-4 border-t border-white/5">Quellen: Eidgenössische Zollverwaltung (EZV), ezv.admin.ch, MWSTG</p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
