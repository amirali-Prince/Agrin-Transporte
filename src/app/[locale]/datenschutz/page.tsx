import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Datenschutzerklärung',
  robots: { index: false },
}

export default function DatenschutzPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white mb-2">Datenschutzerklärung</h1>
          <p className="text-white/30 text-sm mb-8">Gemäss Schweizer Datenschutzgesetz (revDSG, in Kraft seit 1. September 2023)</p>

          <div className="space-y-8 text-white/60 text-sm leading-relaxed">

            <section>
              <h2 className="text-white font-semibold text-base mb-3">1. Verantwortliche Stelle</h2>
              <p>Verantwortlich für die Datenbearbeitung auf dieser Website:</p>
              <div className="mt-2 space-y-0.5">
                <p>Agrin Transporte / Teimur Alizadeh</p>
                <p>Speerstrasse 9, 8634 Hombrechtikon</p>
                <p>Kanton Zürich, Schweiz</p>
                <p><a href="mailto:kontakt@agrin.ch" className="hover:text-[#C9A84C] transition-colors">kontakt@agrin.ch</a></p>
              </div>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">2. Erhobene Daten</h2>
              <p>Wir bearbeiten folgende Personendaten:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-white/50">
                <li>Kontaktdaten (Name, E-Mail, Telefon) bei Anfragen</li>
                <li>Transportangaben (Abholort, Lieferort, Fahrzeugdaten)</li>
                <li>Technische Daten (IP-Adresse, Browser, Besuchszeit) via Webserver-Logs</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">3. Zweck der Bearbeitung</h2>
              <ul className="space-y-1 list-disc list-inside text-white/50">
                <li>Bearbeitung von Transport- und Offertanfragen</li>
                <li>Kommunikation mit Kunden</li>
                <li>Vertragsabwicklung und Rechnungsstellung</li>
                <li>Verbesserung unseres Angebots</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">4. Rechtsgrundlage</h2>
              <p>Die Bearbeitung erfolgt auf Basis von Art. 31 revDSG (Erfüllung eines Vertrags oder vorvertragliche Massnahmen) sowie Art. 31 Abs. 2 lit. a revDSG (berechtigtes Interesse).</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">5. Datenweitergabe</h2>
              <p>Ihre Daten werden nicht an Dritte weitergegeben, es sei denn:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-white/50">
                <li>Sie haben ausdrücklich zugestimmt</li>
                <li>Gesetzliche Pflicht besteht</li>
                <li>Es zur Vertragserfüllung notwendig ist (z.B. Zollbehörden bei EU-Transporten)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">6. Hosting & Cookies</h2>
              <p>Diese Website wird über <strong className="text-white/70">Vercel Inc.</strong> (USA) gehostet. Vercel ist zertifizierter Auftragsverarbeiter. Es werden keine Tracking-Cookies gesetzt. Technisch notwendige Cookies können für die Sprachauswahl verwendet werden.</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">7. Speicherdauer</h2>
              <p>Personendaten werden nur so lange gespeichert, wie es für den jeweiligen Zweck notwendig ist oder gesetzliche Aufbewahrungspflichten (OR: 10 Jahre) bestehen.</p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">8. Ihre Rechte</h2>
              <p>Gemäss revDSG haben Sie folgende Rechte:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-white/50">
                <li>Recht auf Auskunft (Art. 25 revDSG)</li>
                <li>Recht auf Berichtigung (Art. 32 revDSG)</li>
                <li>Recht auf Löschung (Art. 32 revDSG)</li>
                <li>Recht auf Einschränkung der Bearbeitung</li>
                <li>Recht auf Datenübertragbarkeit</li>
              </ul>
              <p className="mt-3">Anfragen richten Sie bitte an: <a href="mailto:kontakt@agrin.ch" className="hover:text-[#C9A84C] transition-colors">kontakt@agrin.ch</a></p>
            </section>

            <section>
              <h2 className="text-white font-semibold text-base mb-3">9. Beschwerderecht</h2>
              <p>Sie haben das Recht, Beschwerde beim Eidgenössischen Datenschutz- und Öffentlichkeitsbeauftragten (EDÖB) einzureichen: <span className="text-white/50">edoeb.admin.ch</span></p>
            </section>

            <p className="text-white/25 text-xs pt-4 border-t border-white/5">
              Quellen: Bundesgesetz über den Datenschutz (revDSG), Verordnung über den Datenschutz (DSV), edoeb.admin.ch, admin.ch<br />
              Stand: Mai 2025
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
