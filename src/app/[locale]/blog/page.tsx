import Navbar from '@/components/ui/Navbar'
import Footer from '@/components/ui/Footer'
import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Blog — Tipps & Wissen rund um den Transport',
  description: 'Ratgeber, Tipps und News von Agrin Transporte — alles was Sie über Fahrzeugtransport in der Schweiz wissen müssen.',
}

const posts = [
  {
    slug: 'tipps-fahrzeugtransport',
    title: '7 Tipps: Was Sie beachten müssen bevor Sie ein Fahrzeug transportieren lassen',
    excerpt: 'Fahrzeugtransport ist einfacher als gedacht — wenn man weiss, worauf man achten muss. Von der Vorbereitung bis zur Übergabe: Das sollten Sie wissen.',
    date: '20. Mai 2025',
    readTime: '4 Min.',
    category: 'Ratgeber',
  },
  {
    slug: 'fahrzeug-entsorgung-schweiz',
    title: 'Fahrzeug entsorgen in der Schweiz: Was erlaubt ist und was es kostet',
    excerpt: 'Ob altes Auto, Motorrad oder Nutzfahrzeug — die korrekte Entsorgung in der Schweiz hat klare Regeln. Agrin Transporte erklärt wie es geht.',
    date: '18. Mai 2025',
    readTime: '5 Min.',
    category: 'Wissen',
  },
  {
    slug: 'eu-transport-zoll-papiere',
    title: 'Fahrzeugtransport EU: Zoll und Papiere erklärt',
    excerpt: 'Was braucht man für einen Fahrzeugtransport in die EU? Zoll, Exportpapiere, Import-MWST — alles was Sie wissen müssen, Schritt für Schritt erklärt.',
    date: '15. Mai 2025',
    readTime: '6 Min.',
    category: 'Wissen',
  },
  {
    slug: 'hydraulischer-anhaenger',
    title: 'Warum ein hydraulischer Anhänger besser ist — für Ihr Fahrzeug',
    excerpt: 'Der hydraulische Absenkanhänger schont Fahrzeuge, erreicht enge Stellen und ist sicherer. 5 Situationen wo der Unterschied entscheidend ist.',
    date: '12. Mai 2025',
    readTime: '4 Min.',
    category: 'Technik',
  },
  {
    slug: 'firmenkunden-transportpartner',
    title: 'Warum ein fester Transportpartner Zeit und Geld spart',
    excerpt: 'Garagen, Händler und Unternehmen sparen mit einem festen Transportpartner bares Geld. Die 4 grössten Vorteile und was das Firmenportal bietet.',
    date: '10. Mai 2025',
    readTime: '5 Min.',
    category: 'Für Firmen',
  },
]

export default function BlogPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-black pt-28 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <span className="text-xs font-semibold tracking-[0.2em] uppercase text-[#C9A84C] mb-3 block">Wissen & News</span>
            <h1 className="text-4xl font-bold text-white">Blog</h1>
            <p className="text-white/40 mt-2">Tipps, Ratgeber und alles Wissenswerte rund um Transport in der Schweiz.</p>
          </div>

          <div className="space-y-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`blog/${post.slug}`} className="block group">
                <article className="bg-zinc-950 border border-white/8 rounded-2xl p-6 hover:border-[#C9A84C]/30 transition-all hover:bg-zinc-900/60">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-[#C9A84C] bg-[#C9A84C]/10 px-2.5 py-1 rounded-full border border-[#C9A84C]/20">
                      {post.category}
                    </span>
                    <span className="text-white/25 text-xs">{post.date}</span>
                    <span className="text-white/25 text-xs">· {post.readTime} Lesezeit</span>
                  </div>
                  <h2 className="text-white font-bold text-lg mb-2 group-hover:text-[#C9A84C] transition-colors leading-snug">
                    {post.title}
                  </h2>
                  <p className="text-white/50 text-sm leading-relaxed">{post.excerpt}</p>
                  <div className="mt-4 flex items-center gap-1 text-[#C9A84C] text-sm font-medium">
                    Lesen
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
