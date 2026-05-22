import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/lib/routing'
import { getMessages } from 'next-intl/server'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    default: 'Agrin Transporte — Fahrzeug & Gütertransport Schweiz & EU',
    template: '%s | Agrin Transporte',
  },
  description: 'Persönlicher Fahrzeug- und Gütertransport in der ganzen Schweiz und EU. Inhaber Teimur Alizadeh fährt selbst — seit 2016.',
  keywords: ['Fahrzeugtransport', 'Gütertransport', 'Auto Transport Schweiz', 'Transport Kanton Zürich', 'EU Transport'],
  openGraph: {
    siteName: 'Agrin Transporte',
    locale: 'de_CH',
  },
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  if (!hasLocale(routing.locales, locale)) notFound()

  const messages = await getMessages()

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="bg-black text-white antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
