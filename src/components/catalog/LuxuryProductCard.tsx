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
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-[1.65rem]">
          {imageUrl ? (
            <>
              <img
                src={imageUrl}
                alt={product.name}
                className="h-full w-full object-cover transition duration-[1.2s] ease-out group-hover:scale-[1.06]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-obsidian via-obsidian/30 to-transparent opacity-80 transition duration-700 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(201,162,39,0.08),transparent_60%)] opacity-0 transition duration-700 group-hover:opacity-100" />
            </>
          ) : (
            <div className="flex h-full items-center justify-center bg-void/80">
              <span className="font-body text-[10px] font-extralight uppercase tracking-[0.4em] text-mist/40">
                Sin imagen
              </span>
            </div>
          )}

          {product.brand && (
            <span className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/30 px-3 py-1 font-body text-[9px] font-light uppercase tracking-[0.3em] text-gold-400/80 backdrop-blur-md">
              {product.brand.name}
            </span>
          )}
        </div>

        <div className="relative px-6 pb-2 pt-5">
          <h3 className="font-display text-lg font-medium leading-snug text-pearl transition duration-300 group-hover:text-gold-300">
            {product.name}
          </h3>

          <div className="mt-3 flex items-baseline gap-2">
            <span className="luxury-price text-2xl">{formatPrice(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="font-body text-sm font-extralight text-mist/50 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {product.stock <= 0 && (
            <p className="mt-2 font-body text-[9px] font-light uppercase tracking-[0.35em] text-red-400/70">
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
            <ShoppingCart className="h-3.5 w-3.5" />
            Agregar al carrito
          </button>
        )}
      </div>
    </article>
  )
}
