import { type FormEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { orderApi } from '../../lib/api'
import { toastError } from '../../lib/alerts'
import { LuxurySectionHeader } from '../../components/store/LuxurySectionHeader'
import { StorePageShell } from '../../components/store/StorePageShell'
import { formatPrice } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

export function CheckoutPage() {
  const { user } = useAuth()
  const { items, subtotal, clearCart } = useCart()
  const [loading, setLoading] = useState(false)

  if (items.length === 0) {
    return (
      <StorePageShell narrow className="py-24 text-center">
        <p className="luxury-body">No hay productos en el carrito.</p>
        <Link to="/catalogo" className="btn-primary mt-6">
          Ir al catálogo
        </Link>
      </StorePageShell>
    )
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)

    const form = new FormData(e.currentTarget)

    try {
      const { data } = await orderApi.create({
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
        })),
        customer_name: form.get('customer_name') as string,
        customer_email: form.get('customer_email') as string,
        customer_phone: (form.get('customer_phone') as string) || undefined,
        shipping_address: form.get('shipping_address') as string,
        shipping_city: (form.get('shipping_city') as string) || undefined,
        shipping_state: (form.get('shipping_state') as string) || undefined,
        shipping_postal_code: (form.get('shipping_postal_code') as string) || undefined,
        notes: (form.get('notes') as string) || undefined,
      })

      clearCart()
      const paymentUrl = data.payment.sandbox_init_point || data.payment.init_point
      sessionStorage.setItem('last_order_id', String(data.data.id))
      window.location.href = paymentUrl
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Error al crear la orden. Intentá de nuevo.'
      toastError('Error en el checkout', message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <StorePageShell narrow>
      <LuxurySectionHeader
        eyebrow="Finalizar"
        title="Checkout"
        subtitle="Completá tus datos para procesar el pago de forma segura."
        align="left"
      />

      <div className="luxury-card mb-8 p-5">
        <p className="luxury-body text-sm">
          {items.length} producto{items.length !== 1 ? 's' : ''} · Total:{' '}
          <span className="luxury-price text-xl">{formatPrice(subtotal)}</span>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid gap-5 md:grid-cols-2">
          <div>
            <label className="luxury-label">Nombre completo *</label>
            <input
              name="customer_name"
              required
              defaultValue={user?.name ?? ''}
              className="input-field"
            />
          </div>
          <div>
            <label className="luxury-label">Email *</label>
            <input
              name="customer_email"
              type="email"
              required
              defaultValue={user?.email ?? ''}
              className="input-field"
            />
          </div>
        </div>
        <div>
          <label className="luxury-label">Teléfono</label>
          <input name="customer_phone" defaultValue={user?.phone ?? ''} className="input-field" />
        </div>
        <div>
          <label className="luxury-label">Dirección de envío *</label>
          <textarea name="shipping_address" required rows={2} className="input-field" />
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          <div>
            <label className="luxury-label">Ciudad</label>
            <input name="shipping_city" className="input-field" />
          </div>
          <div>
            <label className="luxury-label">Provincia</label>
            <input name="shipping_state" className="input-field" />
          </div>
          <div>
            <label className="luxury-label">Código postal</label>
            <input name="shipping_postal_code" className="input-field" />
          </div>
        </div>
        <div>
          <label className="luxury-label">Notas</label>
          <textarea
            name="notes"
            rows={2}
            className="input-field"
            placeholder="Instrucciones de entrega..."
          />
        </div>

        <p className="luxury-body text-xs">
          Serás redirigido a Mercado Pago para completar el pago de forma segura.
        </p>

        <button type="submit" disabled={loading} className="btn-gold-shine w-full py-3.5">
          {loading ? 'Procesando...' : 'Pagar con Mercado Pago'}
        </button>
      </form>
    </StorePageShell>
  )
}

export function CheckoutResultPage() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'loading' | 'paid' | 'pending' | 'failed'>('loading')
  const [orderNumber, setOrderNumber] = useState('')

  useEffect(() => {
    const orderId = sessionStorage.getItem('last_order_id')
    if (!orderId) {
      setStatus('pending')
      return
    }

    orderApi
      .paymentStatus(Number(orderId))
      .then(({ data }) => {
        setOrderNumber(data.order_number)
        if (data.payment_status === 'paid') setStatus('paid')
        else if (data.payment_status === 'failed') setStatus('failed')
        else setStatus('pending')
      })
      .catch(() => setStatus('pending'))
  }, [])

  return (
    <StorePageShell narrow className="py-20 text-center">
      {status === 'loading' && (
        <>
          <div className="gold-divider mx-auto max-w-xs" />
          <p className="luxury-body mt-8">Verificando pago...</p>
        </>
      )}

      {status === 'paid' && (
        <>
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-sm border border-amber-500/40 bg-amber-500/10 text-3xl text-amber-400">
            ✓
          </div>
          <h1 className="luxury-heading text-3xl">Pago confirmado</h1>
          {orderNumber && (
            <p className="luxury-body mt-3">
              Orden <span className="text-amber-400">{orderNumber}</span>
            </p>
          )}
          <p className="luxury-body mt-4 text-sm">
            Gracias por tu compra. Te enviaremos un email con los detalles.
          </p>
        </>
      )}

      {status === 'pending' && (
        <>
          <h1 className="luxury-heading text-3xl">Pago pendiente</h1>
          <p className="luxury-body mt-4 text-sm">
            Tu pago está siendo procesado. Te notificaremos cuando se confirme.
          </p>
        </>
      )}

      {status === 'failed' && (
        <>
          <h1 className="luxury-heading text-3xl text-red-400/90">Pago fallido</h1>
          <p className="luxury-body mt-4 text-sm">
            Hubo un problema con el pago. Podés intentar nuevamente.
          </p>
        </>
      )}

      <button type="button" onClick={() => navigate('/')} className="btn-primary mt-10 px-10">
        Volver al inicio
      </button>
    </StorePageShell>
  )
}
