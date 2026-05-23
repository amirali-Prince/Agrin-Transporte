import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUsers, createUser } from '@/lib/users'

function adminGuard(session: Awaited<ReturnType<typeof getSession>>) {
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export async function GET() {
  const session = await getSession()
  const guard = adminGuard(session)
  if (guard) return guard
  return NextResponse.json(getUsers())
}

export async function POST(req: NextRequest) {
  const session = await getSession()
  const guard = adminGuard(session)
  if (guard) return guard

  const body = await req.json().catch(() => null)
  if (!body?.firstName || !body?.lastName || !body?.company || !body?.password) {
    return NextResponse.json({ error: 'Pflichtfelder fehlen' }, { status: 400 })
  }
  if (body.password.length < 8) {
    return NextResponse.json({ error: 'Passwort muss mindestens 8 Zeichen haben' }, { status: 400 })
  }
  try {
    const user = await createUser(body)
    return NextResponse.json(user, { status: 201 })
  } catch (e: unknown) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Fehler' }, { status: 409 })
  }
}
