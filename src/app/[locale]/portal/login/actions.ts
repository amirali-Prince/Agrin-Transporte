'use server'

import { verifyCredentials } from '@/lib/users'
import { createSession } from '@/lib/auth'
import { redirect } from 'next/navigation'

export async function loginAction(locale: string, _prev: { error: string } | null, formData: FormData): Promise<{ error: string }> {
  const identifier = (formData.get('identifier') as string)?.trim()
  const password = formData.get('password') as string

  if (!identifier || !password) return { error: 'Bitte alle Felder ausfüllen.' }

  const user = await verifyCredentials(identifier, password)
  if (!user) return { error: 'Zugangsdaten falsch.' }

  await createSession({
    userId: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    roles: user.roles,
    company: user.company,
  })

  const isAdmin = user.roles.includes('admin')
  redirect(isAdmin ? `/${locale}/portal/admin` : `/${locale}/portal/dashboard`)
}
