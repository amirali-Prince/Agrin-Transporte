import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getOrders } from '@/lib/data'

export async function GET() {
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return NextResponse.json(getOrders())
}
