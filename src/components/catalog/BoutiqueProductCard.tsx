import type { MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, ShoppingBag } from 'lucide-react'
import { formatPrice, getProductImage } from '../../lib/utils'
import { whatsappProductQuoteUrl } from '../../lib/whatsapp'
import type { Product } from '../../types'

interface BoutiqueProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function BoutiqueProductCard({ product, onAddToCart }: BoutiqueProductCardProps) {
  const imageUrl = getProductImage(product)
  const isExclusive = product.is_featured
  const isLimited = product.compare_price != null && product.compare_price > product.price
  const inStock = product.stock > 0
  const whatsappUrl = whatsappProductQuoteUrl(product, 1, formatPrice)

  function handleAdd(e: MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    onAddToCart?.(product)
  }

  return (
    <article className="boutique-product-card group">
      <div className="relative">
        <Link to={`/producto/${product.slug}`} className="block">
          {(isExclusive || isLimited) && (
            <span className="boutique-badge">
              {isLimited ? 'Edición limitada' : 'Exclusivo'}
            </span>
          )}

          <div className="boutique-product-image-wrap">
            {imageUrl ? (
              <img
                src={imageUrl}
                alt={product.name}
                className="boutique-product-image"
              />
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="font-body text-xs uppercase tracking-[0.3em] text-bone/30">
                  —
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="absolute bottom-3 left-3 right-3 z-10 flex items-center justify-between sm:bottom-4">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="boutique-quick-wa"
            aria-label={`Cotizar ${product.name} por WhatsApp`}
          >
            <MessageCircle className="h-4 w-4" strokeWidth={1.5} />
          </a>

          {onAddToCart && inStock && (
            <button
              type="button"
              onClick={handleAdd}
              className="flex h-10 w-10 items-center justify-center bg-aged-gold text-carbon shadow-lg transition-all duration-300 hover:scale-105 hover:bg-bone sm:h-11 sm:w-11"
              aria-label={`Agregar ${product.name} al carrito`}
            >
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
            </button>
          )}
        </div>
      </div>

      <Link to={`/producto/${product.slug}`} className="mt-5 block space-y-1.5 text-center sm:mt-6">
        {product.brand && (
          <p className="font-body text-[10px] font-normal uppercase tracking-[0.3em] text-aged-gold sm:text-xs">
            {product.brand.name}
          </p>
        )}
        <h3 className="font-display text-lg font-normal tracking-wide text-bone transition-colors duration-300 group-hover:text-aged-gold sm:text-xl">
          {product.name}
        </h3>
        <p className="font-body text-sm font-normal tracking-wider text-bone/70 sm:text-base">
          {formatPrice(product.price)}
        </p>
      </Link>

      <div className="mt-4 grid grid-cols-2 gap-2 sm:mt-5">
        {onAddToCart && inStock ? (
          <button
            type="button"
            onClick={handleAdd}
            className="boutique-cta-solid flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px]"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Agregar
          </button>
        ) : (
          <span />
        )}
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="boutique-cta-whatsapp flex items-center justify-center gap-1.5 text-[10px] sm:text-[11px]"
        >
          <MessageCircle className="h-3.5 w-3.5" />
          Cotizar
        </a>
      </div>

      <Link
        to={`/producto/${product.slug}`}
        className="boutique-cta-outline mt-2 flex w-full items-center justify-center text-[10px] sm:text-[11px]"
      >
        Ver detalle
      </Link>

      {!inStock && (
        <p className="mt-2 text-center font-body text-[10px] uppercase tracking-[0.25em] text-bone/40">
          Agotado
        </p>
      )}
    </article>
  )
}
