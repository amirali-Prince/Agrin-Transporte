'use client'
import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'

export default function PortalLogin() {
  const locale = useLocale()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        setError('Ungültige E-Mail oder Passwort.')
      } else {
        window.location.href = `/${locale}/portal/dashboard`
      }
    } catch {
      setError('Ein Fehler ist aufgetreten. Bitte versuchen Sie es erneut.')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href={`/${locale}`}>
            <Image src="/logo.png" alt="Agrin Transporte" width={120} height={40} className="h-10 w-auto mx-auto mb-6" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Firmenportal</h1>
          <p className="text-white/40 text-sm mt-1">Melden Sie sich mit Ihrem Firmenkonto an</p>
        </div>

        <form onSubmit={handleLogin} className="bg-zinc-950 border border-white/8 rounded-2xl p-6 space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 text-red-400 text-sm">{error}</div>
          )}
          <div>
            <label className="block text-xs text-white/50 mb-1.5">E-Mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
          </div>
          <div>
            <label className="block text-xs text-white/50 mb-1.5">Passwort</label>
            <input
              type="password"
              required
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-[#C9A84C]/50 transition-colors"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A84C] hover:bg-[#b8963e] disabled:opacity-60 text-black font-bold py-3 rounded-xl transition-colors text-sm"
          >
            {loading ? 'Anmelden...' : 'Anmelden'}
          </button>
        </form>

        <p className="text-center text-white/25 text-xs mt-6">
          Noch kein Firmenkonto?{' '}
          <a href="mailto:kontakt@agrin.ch" className="text-[#C9A84C] hover:underline">kontakt@agrin.ch</a>
        </p>
        <div className="text-center mt-4">
          <Link href={`/${locale}`} className="text-white/30 hover:text-white text-xs transition-colors">← Zurück zur Website</Link>
        </div>
      </div>
    </div>
  )
}
