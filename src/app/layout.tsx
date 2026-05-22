import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Agrin Transporte — Fahrzeug & Gütertransport Schweiz',
  description: 'Persönlicher Fahrzeug- und Gütertransport in der ganzen Schweiz und EU.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
