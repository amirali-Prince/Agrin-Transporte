import bcrypt from 'bcryptjs'
import fs from 'fs'
import path from 'path'

export type User = {
  id: string
  email: string
  name: string
  company: string
  role: 'kunde'
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

export function getUserByEmail(email: string) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase())
}

export function getUserById(id: string) {
  return getUsers().find(u => u.id === id)
}

export async function createUser(data: { email: string; name: string; company: string; password: string }): Promise<User> {
  const users = getUsers()
  if (users.find(u => u.email.toLowerCase() === data.email.toLowerCase())) throw new Error('E-Mail bereits vergeben')
  const user: User = {
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name,
    company: data.company,
    role: 'kunde',
    passwordHash: await bcrypt.hash(data.password, 12),
    createdAt: new Date().toISOString(),
  }
  saveUsers([...users, user])
  return user
}

export async function deleteUser(id: string) {
  saveUsers(getUsers().filter(u => u.id !== id))
}

export async function verifyCredentials(email: string, password: string) {
  const adminEmail = process.env.ADMIN_EMAIL
  const adminHash = process.env.ADMIN_PASSWORD_HASH

  if (adminEmail && email.toLowerCase() === adminEmail.toLowerCase()) {
    if (!adminHash || !(await bcrypt.compare(password, adminHash))) return null
    return { id: 'admin', email: adminEmail, name: 'Admin', role: 'admin' as const }
  }

  const user = getUserByEmail(email)
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) return null
  return { id: user.id, email: user.email, name: user.name, role: 'kunde' as const }
}
