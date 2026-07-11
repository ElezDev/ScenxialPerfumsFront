import { useEffect, useState } from 'react'
import { DataTable } from '../../components/admin/DataTable'
import { adminApi } from '../../lib/api'
import { toastSuccess } from '../../lib/alerts'
import { formatPrice, statusLabel } from '../../lib/utils'
import type { Order, OrderStatus } from '../../types'

const PER_PAGE = 15

const orderStatuses: OrderStatus[] = [
  'pending',
  'processing',
  'shipped',
  'delivered',
  'cancelled',
]

export function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [meta, setMeta] = useState({ from: null as number | null, to: null as number | null, total: 0 })

  function load() {
    setLoading(true)
    adminApi
      .orders({
        status: filter || undefined,
        search: search || undefined,
        page,
        per_page: PER_PAGE,
      })
      .then(({ data }) => {
        setOrders(data.data)
        setLastPage(data.meta.last_page)
        setMeta({ from: data.meta.from, to: data.meta.to, total: data.meta.total })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    load()
  }, [filter, search, page])

  function handleFilterChange(value: string) {
    setFilter(value)
    setPage(1)
  }

  function handleSearch(value: string) {
    setSearch(value)
    setPage(1)
  }

  async function updateStatus(orderId: number, status: string) {
    await adminApi.updateOrderStatus(orderId, { status })
    toastSuccess('Estado actualizado', statusLabel(status as OrderStatus))
    load()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl text-stone-100">Órdenes</h1>
      </div>

      <DataTable
        loading={loading}
        search={search}
        onSearch={handleSearch}
        searchPlaceholder="Buscar por nº orden, cliente o email..."
        currentPage={page}
        lastPage={lastPage}
        onPageChange={setPage}
        meta={meta}
        isEmpty={orders.length === 0}
        emptyMessage="No hay órdenes."
        toolbar={
          <select
            value={filter}
            onChange={(e) => handleFilterChange(e.target.value)}
            className="input-field sm:w-48"
          >
            <option value="">Todos los estados</option>
            {orderStatuses.map((s) => (
              <option key={s} value={s}>
                {statusLabel(s)}
              </option>
            ))}
          </select>
        }
      >
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-noir-700 text-left text-stone-500">
              <th className="px-6 py-3">Nº Orden</th>
              <th className="px-6 py-3">Cliente</th>
              <th className="px-6 py-3">Total</th>
              <th className="px-6 py-3">Estado</th>
              <th className="px-6 py-3">Pago</th>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b border-noir-800">
                <td className="px-6 py-3 text-gold-400">{order.order_number}</td>
                <td className="px-6 py-3">
                  <div>{order.customer_name}</div>
                  <div className="text-xs text-stone-500">{order.customer_email}</div>
                </td>
                <td className="px-6 py-3">{formatPrice(order.total)}</td>
                <td className="px-6 py-3">{statusLabel(order.status)}</td>
                <td className="px-6 py-3">{statusLabel(order.payment_status)}</td>
                <td className="px-6 py-3 text-stone-500">
                  {new Date(order.created_at).toLocaleDateString('es-AR')}
                </td>
                <td className="px-6 py-3">
                  <select
                    value={order.status}
                    onChange={(e) => updateStatus(order.id, e.target.value)}
                    className="input-field text-xs"
                  >
                    {orderStatuses.map((s) => (
                      <option key={s} value={s}>
                        {statusLabel(s)}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </DataTable>
    </div>
  )
}
