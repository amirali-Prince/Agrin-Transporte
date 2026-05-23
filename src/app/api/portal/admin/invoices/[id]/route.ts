import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { updateInvoice, getInvoices } from '@/lib/data'

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  updateInvoice(id, body)
  return NextResponse.json({ ok: true })
}
