'use client'
import { useTranslations } from 'next-intl'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Image from 'next/image'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale()

  return (
    <footer className="bg-zinc-950 border-t border-white/8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div>
            <Image src="/logo.png" alt="Agrin Transporte" width={130} height={44} className="h-10 w-auto object-contain mb-1" />
            <p className="text-white font-semibold text-sm mb-1">Agrin Transporte</p>
            <p className="text-white/40 text-sm mb-4">{t('tagline')}</p>
            <p className="text-white/30 text-xs">{t('address')}</p>
            <a href="tel:+41765456606" className="text-white/40 text-xs mt-1 block hover:text-[#C9A84C] transition-colors">+41 76 545 66 06</a>
            <a href="mailto:kontakt@agrin.ch" className="text-white/40 text-xs mt-0.5 block hover:text-[#C9A84C] transition-colors">kontakt@agrin.ch</a>
          </div>

          {/* Links */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">{t('links')}</p>
            <div className="space-y-2">
              <Link href={`/${locale}#services`} className="block text-sm text-white/50 hover:text-white transition-colors">Leistungen</Link>
              <Link href={`/${locale}#about`} className="block text-sm text-white/50 hover:text-white transition-colors">Über uns</Link>
              <Link href={`/${locale}/blog`} className="block text-sm text-white/50 hover:text-white transition-colors">Blog</Link>
              <Link href={`/${locale}/portal`} className="block text-sm text-white/50 hover:text-white transition-colors">Firmenportal</Link>
              <Link href={`/${locale}/offerte`} className="block text-sm text-white/50 hover:text-white transition-colors">Offerte anfragen</Link>
            </div>
          </div>

          {/* Legal */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-4">{t('legal')}</p>
            <div className="space-y-2">
              <Link href={`/${locale}/impressum`} className="block text-sm text-white/50 hover:text-white transition-colors">{t('imprint')}</Link>
              <Link href={`/${locale}/datenschutz`} className="block text-sm text-white/50 hover:text-white transition-colors">{t('privacy')}</Link>
            </div>
            <div className="mt-6 space-y-1 text-xs text-white/25">
              <p>Teimur Alizadeh</p>
              <p>HR-Nr: CH-020.1.091.197-0</p>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-white/25">© {new Date().getFullYear()} Agrin Transporte. {t('allRights')}</p>
          <div className="flex gap-4">
            <a href="tel:+41765456606" className="text-xs text-white/25 hover:text-[#C9A84C] transition-colors">+41 76 545 66 06</a>
            <a href="mailto:kontakt@agrin.ch" className="text-xs text-white/25 hover:text-[#C9A84C] transition-colors">kontakt@agrin.ch</a>
          </div>
        </div>
      </div>
    </footer>
  )
}
