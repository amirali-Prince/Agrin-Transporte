import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUsers, deleteUser } from '@/lib/users'
import fs from 'fs'
import path from 'path'

function adminGuard(session: Awaited<ReturnType<typeof getSession>>) {
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  return null
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  const guard = adminGuard(session)
  if (guard) return guard

  const { id } = await params
  const body = await req.json().catch(() => null)
  if (!body) return NextResponse.json({ error: 'Invalid body' }, { status: 400 })

  const DATA = path.join(process.cwd(), 'src', 'data', 'users.json')
  const users = getUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const updated = {
    ...users[idx],
    ...(body.firstName && { firstName: body.firstName }),
    ...(body.lastName && { lastName: body.lastName }),
    ...(body.company && { company: body.company }),
    ...(body.email !== undefined && { email: body.email || undefined }),
    ...(body.phone !== undefined && { phone: body.phone || undefined }),
  }
  users[idx] = updated
  fs.writeFileSync(DATA, JSON.stringify(users, null, 2), 'utf-8')
  return NextResponse.json(updated)
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  const guard = adminGuard(session)
  if (guard) return guard

  const { id } = await params
  await deleteUser(id)
  return NextResponse.json({ ok: true })
}
