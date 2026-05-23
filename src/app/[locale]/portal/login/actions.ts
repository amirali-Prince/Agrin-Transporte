'use server'

import { verifyCredentials } from '@/lib/users'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(locale: string, _prev: { error: string } | null, formData: FormData): Promise<{ error: string }> {
  const email = (formData.get('email') as string)?.trim()
  const password = formData.get('password') as string

  if (!email || !password) return { error: 'Bitte alle Felder ausfüllen.' }

  const user = await verifyCredentials(email, password)
  if (!user) return { error: 'E-Mail oder Passwort falsch.' }

  await createSession({ userId: user.id, email: user.email, name: user.name, role: user.role })

  redirect(user.role === 'admin' ? `/${locale}/portal/admin` : `/${locale}/portal/dashboard`)
}
