'use client'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'

const langs = [
  { code: 'de', label: 'DE' },
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'it', label: 'IT' },
]

export default function LanguageSwitcher() {
  const locale = useLocale()
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: string) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
  }

  return (
    <div className="flex items-center gap-1">
      {langs.map((l, i) => (
        <span key={l.code} className="flex items-center">
          <button
            onClick={() => switchLocale(l.code)}
            className={`text-xs font-medium tracking-wider transition-colors ${
              locale === l.code
                ? 'text-[#C9A84C]'
                : 'text-white/50 hover:text-white/80'
            }`}
          >
            {l.label}
          </button>
          {i < langs.length - 1 && (
            <span className="mx-1 text-white/20 text-xs">|</span>
          )}
        </span>
      ))}
    </div>
  )
}
