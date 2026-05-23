import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth'

export default async function PortalPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session) redirect(`/${locale}/portal/login`)
  redirect(session.roles.includes('admin') ? `/${locale}/portal/admin` : `/${locale}/portal/dashboard`)
}
