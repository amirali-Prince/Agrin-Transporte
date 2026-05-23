import { NextRequest, NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getUsers } from '@/lib/users'
import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

function generate(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  return Array.from({ length: 10 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getSession()
  if (!session || !session.roles.includes('admin')) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const users = getUsers()
  const idx = users.findIndex(u => u.id === id)
  if (idx === -1) return NextResponse.json({ error: 'Nicht gefunden' }, { status: 404 })

  const tempPassword = generate()
  users[idx].passwordHash = await bcrypt.hash(tempPassword, 12)

  const DATA = path.join(process.cwd(), 'src', 'data', 'users.json')
  fs.writeFileSync(DATA, JSON.stringify(users, null, 2), 'utf-8')

  return NextResponse.json({ tempPassword })
}
