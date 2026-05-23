import { redirect } from 'next/navigation'
import { getSession, deleteSession } from '@/lib/auth'
import { getUsers } from '@/lib/users'
import { getInvoices, getOrders, getActiveOrders } from '@/lib/data'
import AdminShell from '@/components/portal/admin/AdminShell'

export default async function AdminPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) redirect(`/${locale}/portal/login`)

  const [users, invoices, orders, activeOrders] = await Promise.all([
    Promise.resolve(getUsers()),
    Promise.resolve(getInvoices()),
    Promise.resolve(getOrders()),
    Promise.resolve(getActiveOrders()),
  ])

  async function logoutAction(): Promise<never> {
    'use server'
    await deleteSession()
    redirect(`/${locale}/portal/login`)
  }

  return (
    <AdminShell
      session={session}
      users={users}
      invoices={invoices}
      orders={orders}
      activeOrders={activeOrders}
      logoutAction={logoutAction}
    />
  )
}
