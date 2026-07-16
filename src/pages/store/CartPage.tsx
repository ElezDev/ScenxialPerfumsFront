import { Link } from 'react-router-dom'
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react'
import { LuxurySectionHeader } from '../../components/store/LuxurySectionHeader'
import { StorePageShell } from '../../components/store/StorePageShell'
import { useCart } from '../../context/CartContext'
import { formatPrice, getProductImage } from '../../lib/utils'

export function CartPage() {
  const { items, subtotal, updateQuantity, removeItem } = useCart()

  if (items.length === 0) {
    return (
      <StorePageShell narrow className="py-24 text-center">
        <ShoppingCart className="mx-auto h-14 w-14 text-amber-500/30" />
        <h1 className="luxury-heading mt-6 text-2xl">Tu carrito está vacío</h1>
        <p className="luxury-body mt-3 text-sm">Explora nuestra colección exclusiva.</p>
        <Link to="/catalogo" className="btn-primary mt-8 px-10">
          Ir al catálogo
        </Link>
      </StorePageShell>
    )
  }

  return (
    <StorePageShell>
      <LuxurySectionHeader eyebrow="Tu selección" title="Carrito" align="left" />

      <div className="grid gap-10 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => {
            const imageUrl = getProductImage(item.product)
            const unitPrice = item.decant?.price ?? item.product.price
            return (
              <div
                key={`${item.product.id}-${item.decant?.id ?? 'full'}`}
                className="luxury-card flex gap-5 p-5"
              >
                <div className="h-24 w-20 shrink-0 overflow-hidden rounded-sm border border-amber-500/15 bg-black/60">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt={item.product.name}
                      loading="lazy"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-champagne/30">
                      —
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <h3 className="font-display text-lg text-ivory">{item.product.name}</h3>
                    {item.decant && (
                      <span className="mt-1 inline-block rounded-sm border border-amber-500/25 px-2 py-0.5 text-xs text-amber-400">
                        Decant {item.decant.ml}ml
                      </span>
                    )}
                    <p className="luxury-price mt-1 text-lg">{formatPrice(unitPrice)}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center rounded-sm border border-amber-500/25 bg-black/40">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity - 1, item.decant?.id)
                        }
                        className="p-2 text-champagne transition hover:text-amber-400"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-body text-sm text-ivory">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product.id, item.quantity + 1, item.decant?.id)
                        }
                        className="p-2 text-champagne transition hover:text-amber-400"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeItem(item.product.id, item.decant?.id)}
                      className="text-champagne/50 transition hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <p className="self-center font-display text-lg text-ivory">
                  {formatPrice(unitPrice * item.quantity)}
                </p>
              </div>
            )
          })}
        </div>

        <div className="luxury-card h-fit p-6">
          <h2 className="luxury-heading text-xl">Resumen</h2>
          <div className="gold-divider my-5" />
          <div className="space-y-3 font-body text-sm font-light">
            <div className="flex justify-between text-champagne">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between border-t border-amber-500/15 pt-3">
              <span className="luxury-heading text-base">Total</span>
              <span className="luxury-price text-2xl">{formatPrice(subtotal)}</span>
            </div>
          </div>
          <Link to="/checkout" className="btn-gold-shine mt-8 w-full py-3">
            Finalizar compra
          </Link>
        </div>
      </div>
    </StorePageShell>
  )
}
