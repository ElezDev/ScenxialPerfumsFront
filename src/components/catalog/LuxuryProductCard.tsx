import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { formatPrice, getProductImage } from '../../lib/utils'
import { whatsappProductQuoteUrl } from '../../lib/whatsapp'
import type { Product } from '../../types'

interface LuxuryProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function LuxuryProductCard({ product, onAddToCart }: LuxuryProductCardProps) {
  const imageUrl = getProductImage(product)

  return (
    <article className="luxury-card group flex flex-col">
      <Link to={`/producto/${product.slug}`} className="block flex-1">
        <div className="relative aspect-[3/4] overflow-hidden">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/10 transition duration-500 group-hover:from-black/90" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-black/60">
              <span className="font-body text-xs font-light tracking-widest text-[#B8AFA0]/50">
                Sin imagen
              </span>
            </div>
          )}

          {product.brand && (
            <p className="absolute left-4 top-4 font-body text-[10px] font-light uppercase tracking-[0.25em] text-amber-400/80">
              {product.brand.name}
            </p>
          )}
        </div>

        <div className="relative p-5">
          <div className="absolute -top-px left-5 right-5 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />

          <h3 className="font-display text-lg font-medium leading-snug text-[#F5F0E8] transition group-hover:text-amber-200">
            {product.name}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="luxury-price text-2xl">{formatPrice(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="font-body text-sm font-light text-[#B8AFA0]/60 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {product.stock <= 0 && (
            <p className="mt-2 font-body text-[10px] font-light uppercase tracking-widest text-red-400/80">
              Agotado
            </p>
          )}
        </div>
      </Link>

      <div className="space-y-2.5 px-5 pb-5">
        <a
          href={whatsappProductQuoteUrl(product, 1, formatPrice)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp-gold w-full"
        >
          Cotizar por WhatsApp
        </a>

        {onAddToCart && product.stock > 0 && (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="btn-gold-shine w-full"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar al carrito
          </button>
        )}
      </div>
    </article>
  )
}
