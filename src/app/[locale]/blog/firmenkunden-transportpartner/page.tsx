import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Warum ein fester Transportpartner Zeit und Geld spart — für Garagen & Firmen',
  description: 'Garagen, Händler und Unternehmen sparen mit einem festen Transportpartner bares Geld. Agrin Transporte erklärt warum und was das Firmenportal bietet.',
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
            <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">Für Firmen</span>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mt-4 mb-3 leading-tight">
              Warum ein fester Transportpartner Zeit und Geld spart
            </h1>
            <div className="flex items-center gap-3 text-white/30 text-sm">
              <span>Agrin Transporte</span><span>·</span>
              <span>10. Mai 2025</span><span>·</span><span>5 Min. Lesezeit</span>
            </div>
          </div>

          <div className="space-y-6 text-white/70 leading-relaxed">
            <p className="text-white/80 text-lg">
              Garagen, Autohändler und Unternehmen haben regelmässig Transportbedarf. Wer jedes Mal neu sucht, verliert Zeit und zahlt zu viel. Mit einem festen Partner läuft es anders.
            </p>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Das Problem: Jedes Mal neu suchen kostet</h2>
              <p className="text-sm">Viele Garagen und Händler suchen für jeden Transport neu — verschiedene Anbieter anfragen, Preise vergleichen, Verfügbarkeiten prüfen. Das kostet Stunden pro Monat und Nerven.</p>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-4">Die 4 grössten Vorteile eines festen Transportpartners</h2>
              <div className="space-y-3">
                {[
                  { icon: '⏱', title: 'Zeitersparnis', text: 'Ein Anruf oder eine WhatsApp — kein Vergleichen mehr. Wir kennen Ihre Anforderungen und reagieren sofort.' },
                  { icon: '💰', title: 'Bessere Konditionen', text: 'Stammkunden erhalten Vorzugspreise. Je mehr Aufträge, desto günstiger wird es pro Transport.' },
                  { icon: '📋', title: 'Transparente Abrechnung', text: 'Monatliche Übersicht aller Transporte und Kosten über das Firmenportal. Keine versteckten Kosten.' },
                  { icon: '🚀', title: 'Priorisierte Bearbeitung', text: 'Firmenkunden werden bevorzugt behandelt. Dringende Aufträge kommen als erstes.' },
                ].map(item => (
                  <div key={item.title} className="flex gap-4 p-5 bg-zinc-950 border border-white/8 rounded-xl hover:border-[#C9A84C]/20 transition-colors">
                    <span className="text-2xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <p className="text-white font-semibold mb-1">{item.title}</p>
                      <p className="text-white/55 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Das Firmenportal von Agrin Transporte</h2>
              <p className="text-sm mb-4">Firmenkunden erhalten Zugang zu einem eigenen Portal wo sie alles verwalten können:</p>
              <div className="bg-zinc-950 border border-white/8 rounded-xl p-5 space-y-2 text-sm">
                {[
                  'Alle laufenden und vergangenen Aufträge auf einen Blick',
                  'Monatliche Abrechnungen als PDF',
                  'Neue Aufträge direkt erfassen — priorisiert bearbeitet',
                  'Transportstatus in Echtzeit verfolgen',
                  'Direktkontakt zu Teimur ohne Wartezeit',
                ].map(f => (
                  <div key={f} className="flex gap-2">
                    <span className="text-[#C9A84C] flex-shrink-0">✓</span>
                    <span className="text-white/70">{f}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-white font-bold text-xl mb-3">Für wen lohnt sich das?</h2>
              <ul className="space-y-1 text-sm text-white/60">
                {['Garagen mit regelmässigem Fahrzeugtransportbedarf', 'Autohändler (Import/Export)', 'Unternehmen mit Fuhrpark', 'Leasingfirmen', 'Entsorgungsbetriebe'].map(i => (
                  <li key={i} className="flex gap-2"><span className="text-[#C9A84C]">→</span>{i}</li>
                ))}
              </ul>
            </section>

            <div className="bg-[#C9A84C]/10 border border-[#C9A84C]/30 rounded-xl p-6">
              <p className="text-white font-medium mb-1">Firmenkunde werden</p>
              <p className="text-white/60 text-sm mb-4">Kontaktieren Sie uns — wir erstellen ein massgeschneidertes Angebot für Ihren regelmässigen Transportbedarf.</p>
              <div className="flex flex-wrap gap-3">
                <Link href="/#anfrage" className="inline-flex items-center gap-2 bg-[#C9A84C] hover:bg-[#b8963e] text-black font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
                  Anfrage senden
                </Link>
                <a href="tel:+41765456606" className="inline-flex items-center gap-2 border border-white/20 hover:border-white/40 text-white px-5 py-2.5 rounded-full text-sm transition-colors">
                  +41 76 545 66 06
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
