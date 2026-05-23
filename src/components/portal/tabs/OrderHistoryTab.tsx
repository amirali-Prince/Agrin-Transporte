'use client'

import type { Order } from '@/lib/data'

const MONTHS = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez']

function OrderRow({ order }: { order: Order }) {
  const date = new Date(order.date).toLocaleDateString('de-CH', { day: '2-digit', month: '2-digit', year: 'numeric' })
  return (
    <div className="py-3 border-b border-white/[0.05] last:border-0">
      <div className="flex items-center justify-between mb-1">
        <p className="text-sm font-medium text-white">{order.vehicle || '—'}</p>
        {order.price > 0 && <p className="text-sm font-semibold text-white">CHF {order.price.toFixed(2)}</p>}
      </div>
      <div className="flex items-center gap-2 text-xs text-white/35">
        <span>{order.pickupLocation}</span>
        <span>→</span>
        <span>{order.deliveryLocation}</span>
        <span className="ml-auto">{date}</span>
      </div>
    </div>
  )
}

export default function OrderHistoryTab({ orders }: { orders: Order[] }) {
  const byYear = orders.reduce<Record<number, Record<number, Order[]>>>((acc, o) => {
    if (!acc[o.year]) acc[o.year] = {}
    if (!acc[o.year][o.month]) acc[o.year][o.month] = []
    acc[o.year][o.month].push(o)
    return acc
  }, {})

  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a)

  return (
    <div className="px-5 pt-7">
      <h2 className="text-xl font-bold text-white mb-6">Auftragshistorie</h2>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <svg className="w-12 h-12 mx-auto mb-3 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-sm text-white/25">Noch keine Aufträge vorhanden</p>
        </div>
      ) : (
        years.map(year => (
          <div key={year} className="mb-6">
            <p className="text-xs font-bold uppercase tracking-widest text-white/30 mb-3">{year}</p>
            {Object.keys(byYear[year]).map(Number).sort((a, b) => b - a).map(month => (
              <div key={month} className="mb-4">
                <p className="text-xs text-white/20 mb-1 ml-1">{MONTHS[month - 1]}</p>
                <div className="rounded-xl px-4" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                  {byYear[year][month].map(o => <OrderRow key={o.id} order={o} />)}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  )
}
