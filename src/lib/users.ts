import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'
import type { Role } from './auth'

export type User = {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company: string
  roles: Role[]
  passwordHash: string
  createdAt: string
}

const DATA = path.join(process.cwd(), 'src', 'data', 'users.json')

export function getUsers(): User[] {
  if (!fs.existsSync(DATA)) return []
  try { return JSON.parse(fs.readFileSync(DATA, 'utf-8')) } catch { return [] }
}

function saveUsers(users: User[]) {
  fs.writeFileSync(DATA, JSON.stringify(users, null, 2), 'utf-8')
}

function normalizePhone(phone: string): string {
  const digits = phone.replace(/\s/g, '').replace(/^0/, '+41')
  return digits
}

function isPhone(input: string): boolean {
  return /^[+\d]/.test(input) && input.replace(/[\s+\-]/g, '').length >= 9
}

// --- Admin accounts from env ---
function getAdmins(): { user: Omit<User, 'passwordHash'>; hash: string }[] {
  const admins = []
  for (let i = 1; i <= 10; i++) {
    const first = process.env[`ADMIN_${i}_FIRST`]
    if (!first) break
    admins.push({
      user: {
        id: `admin_${i}`,
        firstName: first,
        lastName: process.env[`ADMIN_${i}_LAST`] ?? '',
        email: process.env[`ADMIN_${i}_EMAIL`],
        phone: process.env[`ADMIN_${i}_PHONE`]
          ? normalizePhone(process.env[`ADMIN_${i}_PHONE`]!)
          : undefined,
        company: 'Agrin Transport',
        roles: (process.env[`ADMIN_${i}_ROLES`] ?? 'admin').split(',') as Role[],
        createdAt: '2025-01-01T00:00:00.000Z',
      },
      hash: process.env[`ADMIN_${i}_HASH`] ?? '',
    })
  }
  return admins
}

export function getUserById(id: string): User | undefined {
  if (id.startsWith('admin_')) {
    const admin = getAdmins().find(a => a.user.id === id)
    if (admin) return { ...admin.user, passwordHash: '' }
  }
  return getUsers().find(u => u.id === id)
}

export async function createUser(data: {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company: string
  password: string
}): Promise<User> {
  const users = getUsers()
  const norm = data.phone ? normalizePhone(data.phone) : undefined

  const exists = users.find(u =>
    (data.email && u.email?.toLowerCase() === data.email.toLowerCase()) ||
    (norm && u.phone === norm)
  )
  if (exists) throw new Error('E-Mail oder Telefonnummer bereits vergeben')

  const user: User = {
    id: crypto.randomUUID(),
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: norm,
    company: data.company,
    roles: ['kunde'],
    passwordHash: await bcrypt.hash(data.password, 12),
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, user])
  return user
}

export async function deleteUser(id: string) {
  saveUsers(getUsers().filter(u => u.id !== id))
}

export async function verifyCredentials(input: string, password: string): Promise<{
  id: string; firstName: string; lastName: string; roles: Role[]; company?: string
} | null> {
  const norm = isPhone(input) ? normalizePhone(input) : null

  // Check admins
  for (const { user, hash } of getAdmins()) {
    const match = norm
      ? user.phone === norm
      : user.email?.toLowerCase() === input.toLowerCase()
    if (!match) continue
    if (!hash || !(await bcrypt.compare(password, hash))) return null
    return { id: user.id, firstName: user.firstName, lastName: user.lastName, roles: user.roles, company: user.company }
  }

  // Check customers
  const users = getUsers()
  const user = norm
    ? users.find(u => u.phone === norm)
    : users.find(u => u.email?.toLowerCase() === input.toLowerCase())
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null
  return { id: user.id, firstName: user.firstName, lastName: user.lastName, roles: user.roles, company: user.company }
}
