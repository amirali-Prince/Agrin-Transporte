import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '7 Tipps: Was Sie beachten müssen bevor Sie ein Fahrzeug transportieren lassen',
  description: 'Fahrzeugtransport in der Schweiz — von der Vorbereitung bis zur Übergabe. Alles was Sie wissen müssen für einen reibungslosen Transport.',
}

export default function BlogPost() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Back */}
          <Link href="../blog" className="inline-flex items-center gap-1.5 text-white/40 hover:text-white text-sm mb-8 transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
            Zurück zum Blog
          </Link>

          {/* Header */}
          <div className="mb-10">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">Ratgeber</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3 leading-tight">
              7 Tipps: Was Sie beachten müssen bevor Sie ein Fahrzeug transportieren lassen
            </h1>
            <div className="flex items-center gap-3 text-white/30 text-sm">
              <span>Agrin Transporte</span>
              <span>·</span>
              <span>20. Mai 2025</span>
              <span>·</span>
              <span>4 Min. Lesezeit</span>
            </div>
          </div>

          {/* Content */}
          <div className="prose prose-invert prose-lg max-w-none space-y-8 text-white/70 leading-relaxed">

            <p className="text-white/80 text-lg">
              Sie möchten Ihr Fahrzeug transportieren lassen — sei es ein Neukauf, ein Umzug oder ein Defekt? Mit der richtigen Vorbereitung läuft alles reibungslos. Hier sind die 7 wichtigsten Punkte.
            </p>

            {[
              {
                num: '01',
                title: 'Fahrzeug fotografieren vor der Übergabe',
                text: 'Machen Sie vor dem Transport Fotos von allen Seiten — besonders bestehende Kratzer, Dellen und der Kilometerstand. Das schützt beide Seiten und gibt Ihnen Sicherheit.',
              },
              {
                num: '02',
                title: 'Tank nicht mehr als ¼ voll',
                text: 'Ein zu voller Tank erhöht das Gewicht unnötig und kann bei bestimmten Transporten problematisch sein. Ein Viertel Tank ist ideal.',
              },
              {
                num: '03',
                title: 'Persönliche Gegenstände entfernen',
                text: 'Entfernen Sie Wertsachen, Dokumente und persönliche Gegenstände aus dem Fahrzeug. Der Transportunternehmer haftet in der Regel nur für das Fahrzeug selbst.',
              },
              {
                num: '04',
                title: 'Fahrtüchtigkeit und Reifendruck prüfen',
                text: 'Teilen Sie dem Transportunternehmer mit, ob das Fahrzeug fahrbereit ist oder nicht. Bei einem defekten Fahrzeug ist ein hydraulischer Anhänger notwendig — das beeinflusst den Preis.',
              },
              {
                num: '05',
                title: 'Genaue Abhol- und Lieferadressen angeben',
                text: 'Prüfen Sie ob der Anhänger an den Adressen Platz hat. Enge Einfahrten, Tiefgaragen oder Baustellen können den Transport erschweren. Kommunizieren Sie das vorab.',
              },
              {
                num: '06',
                title: 'Versicherungsschutz klären',
                text: 'Fragen Sie nach dem Versicherungsschutz während des Transports. Bei Agrin Transporte ist Ihr Fahrzeug während des gesamten Transports versichert.',
              },
              {
                num: '07',
                title: 'Datum realistisch planen',
                text: 'Planen Sie mindestens 1–2 Tage Puffer ein. Wetter, Verkehr und Zollabwicklung (bei EU-Transporten) können Zeit in Anspruch nehmen.',
              },
            ].map((tip) => (
              <div key={tip.num} className="flex gap-5 p-5 bg-zinc-950 border border-white/8 rounded-xl">
                <span className="text-2xl font-bold text-[#C9A84C]/40 flex-shrink-0 w-8">{tip.num}</span>
                <div>
                  <h3 className="text-white font-semibold mb-1">{tip.title}</h3>
                  <p className="text-white/55 text-sm leading-relaxed">{tip.text}</p>
                </div>
              </div>
            ))}

            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6 mt-8">
              <p className="text-white font-medium mb-1">Fragen vor Ihrem Transport?</p>
              <p className="text-white/60 text-sm mb-4">Teimur Alizadeh beantwortet Ihre Fragen persönlich — per WhatsApp, Telefon oder Formular.</p>
              <Link
                href="/#anfrage"
                className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors"
              >
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
