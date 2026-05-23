import fs from 'fs'
import path from 'path'

function file(name: string) {
  return path.join(process.cwd(), 'src', 'data', name)
}

function read<T>(name: string): T[] {
  const p = file(name)
  if (!fs.existsSync(p)) return []
  try { return JSON.parse(fs.readFileSync(p, 'utf-8')) } catch { return [] }
}

function write<T>(name: string, data: T[]) {
  fs.writeFileSync(file(name), JSON.stringify(data, null, 2), 'utf-8')
}

// --- Types ---

export type InvoiceStatus = 'offen' | 'bezahlt'
export type DocType = 'rechnung' | 'quittung'

export type Invoice = {
  id: string
  number: string
  customerId: string
  customerName: string
  customerCompany: string
  type: DocType
  status: InvoiceStatus
  vehicle: string
  amount: number
  date: string
  year: number
  month: number
  canvaDesignId?: string
  pdfUrl?: string
  notes?: string
  createdAt: string
}

export type OrderStatus = 'angenommen' | 'unterwegs' | 'abgeholt' | 'geliefert'

export type Order = {
  id: string
  customerId: string
  customerName: string
  customerCompany: string
  vehicle: string
  pickupLocation: string
  deliveryLocation: string
  date: string
  year: number
  month: number
  price: number
  notes?: string
  createdAt: string
}

export type ActiveOrder = {
  id: string
  customerId: string
  customerName: string
  customerCompany: string
  vehicle: string
  pickupLocation: string
  deliveryLocation: string
  scheduledDate: string
  status: OrderStatus
  statusUpdatedAt: string
  driverNote?: string
  createdAt: string
}

// --- Invoice helpers ---

function nextInvoiceNumber(type: DocType): string {
  const all = read<Invoice>('invoices.json')
  const year = new Date().getFullYear()
  const prefix = type === 'rechnung' ? 'AG' : 'QU'
  const filtered = all.filter(i => i.year === year && i.type === type)
  const num = String(filtered.length + 1).padStart(3, '0')
  return `${prefix}-${year}-${num}`
}

export function getInvoices(customerId?: string): Invoice[] {
  const all = read<Invoice>('invoices.json')
  return customerId ? all.filter(i => i.customerId === customerId) : all
}

export function createInvoice(data: Omit<Invoice, 'id' | 'number' | 'year' | 'month' | 'createdAt'>): Invoice {
  const date = new Date(data.date)
  const invoice: Invoice = {
    ...data,
    id: crypto.randomUUID(),
    number: nextInvoiceNumber(data.type),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    createdAt: new Date().toISOString(),
  }
  write('invoices.json', [...read<Invoice>('invoices.json'), invoice])
  return invoice
}

export function updateInvoice(id: string, patch: Partial<Invoice>) {
  const all = read<Invoice>('invoices.json')
  write('invoices.json', all.map(i => i.id === id ? { ...i, ...patch } : i))
}

export function deleteInvoice(id: string) {
  write('invoices.json', read<Invoice>('invoices.json').filter(i => i.id !== id))
}

// --- Order helpers ---

export function getOrders(customerId?: string): Order[] {
  const all = read<Order>('orders.json')
  return customerId ? all.filter(o => o.customerId === customerId) : all
}

export function createOrder(data: Omit<Order, 'id' | 'year' | 'month' | 'createdAt'>): Order {
  const date = new Date(data.date)
  const order: Order = {
    ...data,
    id: crypto.randomUUID(),
    year: date.getFullYear(),
    month: date.getMonth() + 1,
    createdAt: new Date().toISOString(),
  }
  write('orders.json', [...read<Order>('orders.json'), order])
  return order
}

// --- Active orders ---

export function getActiveOrders(customerId?: string): ActiveOrder[] {
  const all = read<ActiveOrder>('active_orders.json')
  return customerId ? all.filter(o => o.customerId === customerId) : all
}

export function createActiveOrder(data: Omit<ActiveOrder, 'id' | 'status' | 'statusUpdatedAt' | 'createdAt'>): ActiveOrder {
  const order: ActiveOrder = {
    ...data,
    id: crypto.randomUUID(),
    status: 'angenommen',
    statusUpdatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }
  write('active_orders.json', [...read<ActiveOrder>('active_orders.json'), order])
  return order
}

export function updateOrderStatus(id: string, status: OrderStatus, driverNote?: string) {
  const all = read<ActiveOrder>('active_orders.json')
  write('active_orders.json', all.map(o =>
    o.id === id ? { ...o, status, driverNote: driverNote ?? o.driverNote, statusUpdatedAt: new Date().toISOString() } : o
  ))

  // Move to history when delivered
  if (status === 'geliefert') {
    const order = all.find(o => o.id === id)
    if (order) {
      const date = new Date().toISOString().split('T')[0]
      createOrder({
        customerId: order.customerId,
        customerName: order.customerName,
        customerCompany: order.customerCompany,
        vehicle: order.vehicle,
        pickupLocation: order.pickupLocation,
        deliveryLocation: order.deliveryLocation,
        date,
        price: 0,
        notes: order.driverNote,
      })
      write('active_orders.json', read<ActiveOrder>('active_orders.json').filter(o => o.id !== id))
    }
  }
}
