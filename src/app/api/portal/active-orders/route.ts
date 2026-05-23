import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getActiveOrders } from '@/lib/data'

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const orders = session.roles.includes('admin') || session.roles.includes('fahrer')
    ? getActiveOrders()
    : getActiveOrders(session.userId)

  return NextResponse.json(orders)
}
