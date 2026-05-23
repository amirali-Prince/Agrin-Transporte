import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const session = await getSession()
  if (!session || (!session.roles.includes('fahrer') && !session.roles.includes('admin'))) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const formData = await req.formData().catch(() => null)
  if (!formData) return NextResponse.json({ error: 'Invalid' }, { status: 400 })

  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  try {
    const { put } = await import('@vercel/blob')
    const orderId = formData.get('orderId') as string
    const blob = await put(`fahrer-photos/${orderId}-${Date.now()}.jpg`, file, { access: 'public' })
    return NextResponse.json({ url: blob.url })
  } catch {
    return NextResponse.json({ url: null })
  }
}
