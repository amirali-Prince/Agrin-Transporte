import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Impressum',
  robots: { index: false },
}

export default function ImpressumPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-8">Impressum</h1>

          <div className="space-y-8 text-white/60 text-sm leading-relaxed">

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Unternehmensangaben</h2>
              <div className="space-y-1">
                <p><span className="text-white/40">Firma:</span> Agrin Transporte</p>
                <p><span className="text-white/40">Inhaber:</span> Teimur Alizadeh</p>
                <p><span className="text-white/40">HR-Nummer:</span> CH-020.1.091.197-0</p>
                <p><span className="text-white/40">Adresse:</span> Speerstrasse 9, 8634 Hombrechtikon, Kanton Zürich, Schweiz</p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Kontakt</h2>
              <div className="space-y-1">
                <p><span className="text-white/40">Telefon:</span>{' '}
                  <a href="tel:+41765456606" className="hover:text-[#C9A84C] transition-colors">+41 76 545 66 06</a>
                </p>
                <p><span className="text-white/40">E-Mail:</span>{' '}
                  <a href="mailto:kontakt@agrin.ch" className="hover:text-[#C9A84C] transition-colors">kontakt@agrin.ch</a>
                </p>
                <p><span className="text-white/40">Website:</span> agrin.ch</p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Handelsregister</h2>
              <p>Eingetragen im Handelsregister des Kantons Zürich.<br />
              HR-Nummer: CH-020.1.091.197-0</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Mehrwertsteuer</h2>
              <p>Die Mehrwertsteuerpflicht richtet sich nach den aktuellen Bestimmungen des Mehrwertsteuergesetzes (MWSTG) der Schweiz. Angaben auf Anfrage.</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Haftungsausschluss</h2>
              <p>Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den Inhalt der verlinkten Seiten sind ausschliesslich deren Betreiber verantwortlich.</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">Urheberrecht</h2>
              <p>Die auf dieser Website veröffentlichten Inhalte unterliegen dem schweizerischen Urheberrecht. Eine Vervielfältigung, Bearbeitung oder Verbreitung bedarf der schriftlichen Genehmigung des Inhabers.</p>
            </section>

            <p className="text-white/25 text-xs pt-4 border-t border-white/5">
              Quelle: Obligationenrecht (OR), Handelsregisterverordnung (HRegV), admin.ch
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
