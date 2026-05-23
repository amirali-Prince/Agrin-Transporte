import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { updateOrderStatus } from '@/lib/data'
import type { OrderStatus } from '@/lib/data'

const VALID_STATUSES: OrderStatus[] = ['angenommen', 'unterwegs', 'abgeholt', 'geliefert']

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  if (!session.roles.includes('fahrer') && !session.roles.includes('admin')) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json().catch(() => null)
  if (!body || typeof body.id !== 'string' || !VALID_STATUSES.includes(body.status)) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 })
  }

  updateOrderStatus(body.id, body.status as OrderStatus, body.driverNote || undefined)
  return NextResponse.json({ ok: true })
}
