import { redirect } from 'next/navigation'
import { getSession, deleteSession } from '@/lib/auth'
import { getInvoices, getOrders, getActiveOrders } from '@/lib/data'
import PortalShell from '@/components/portal/PortalShell'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session) redirect(`/${locale}/portal/login`)
  if (session.roles.includes('admin')) {
    redirect(`/${locale}/portal/admin`)
  }

  const invoices = getInvoices(session.userId)
  const orders = getOrders(session.userId)
  const activeOrders = getActiveOrders(session.userId)

  async function logoutAction(): Promise<never> {
    'use server'
    await deleteSession()
    redirect(`/${locale}/portal/login`)
  }

  return (
    <PortalShell
      session={session}
      invoices={invoices}
      orders={orders}
      activeOrders={activeOrders}
      locale={locale}
      logoutAction={logoutAction}
    />
  )
}
