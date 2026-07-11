import { useEffect, useState } from 'react'
import { adminApi } from '../../lib/api'
import { formatPrice, statusLabel } from '../../lib/utils'
import type { DashboardStats } from '../../types'

export function DashboardPage() {
  const [data, setData] = useState<DashboardStats | null>(null)

  useEffect(() => {
    adminApi.dashboard().then(({ data: stats }) => setData(stats))
  }, [])

  if (!data) return <p className="text-stone-500">Cargando dashboard...</p>

  const cards = [
    { label: 'Ventas totales', value: formatPrice(Number(data.stats.total_sales)) },
    { label: 'Órdenes', value: String(data.stats.total_orders) },
    { label: 'Pendientes', value: String(data.stats.pending_orders) },
    { label: 'Productos', value: String(data.stats.total_products) },
    { label: 'Clientes', value: String(data.stats.total_customers) },
  ]

  return (
    <div>
      <h1 className="mb-8 font-display text-3xl text-stone-100">Dashboard</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
          <div key={card.label} className="card p-5">
            <p className="text-sm text-stone-500">{card.label}</p>
            <p className="mt-1 text-2xl font-semibold text-gold-400">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="card mt-8">
        <div className="border-b border-noir-700 px-6 py-4">
          <h2 className="font-display text-xl text-stone-100">Órdenes recientes</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-noir-700 text-left text-stone-500">
                <th className="px-6 py-3">Nº Orden</th>
                <th className="px-6 py-3">Cliente</th>
                <th className="px-6 py-3">Total</th>
                <th className="px-6 py-3">Estado</th>
                <th className="px-6 py-3">Pago</th>
              </tr>
            </thead>
            <tbody>
              {data.recent_orders.map((order) => (
                <tr key={order.id} className="border-b border-noir-800">
                  <td className="px-6 py-3 text-gold-400">{order.order_number}</td>
                  <td className="px-6 py-3">{order.customer_name}</td>
                  <td className="px-6 py-3">{formatPrice(order.total)}</td>
                  <td className="px-6 py-3">{statusLabel(order.status)}</td>
                  <td className="px-6 py-3">{statusLabel(order.payment_status)}</td>
                </tr>
              ))}
              {data.recent_orders.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-stone-500">
                    No hay órdenes recientes.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
