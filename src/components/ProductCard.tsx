import { Link } from 'react-router-dom'
import { ShoppingCart } from 'lucide-react'
import { QuoteButton } from './QuoteButton'
import { formatPrice, getProductImage } from '../lib/utils'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const imageUrl = getProductImage(product)

  return (
    <article className="card group overflow-hidden transition hover:border-gold-500/30">
      <Link to={`/producto/${product.slug}`} className="block">
        <div className="aspect-square overflow-hidden bg-noir-800">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-stone-600">
              Sin imagen
            </div>
          )}
        </div>
        <div className="p-4">
          {product.brand && (
            <p className="text-xs uppercase tracking-wider text-gold-500/80">{product.brand.name}</p>
          )}
          <h3 className="mt-1 font-display text-lg text-stone-100">{product.name}</h3>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-gold-400">{formatPrice(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="text-sm text-stone-500 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>
          {product.stock <= 0 && (
            <p className="mt-1 text-xs text-red-400">Sin stock</p>
          )}
        </div>
      </Link>
      <div className="space-y-2 px-4 pb-4">
        <QuoteButton product={product} fullWidth className="text-xs py-2" />
        {onAddToCart && product.stock > 0 && (
          <button
            type="button"
            onClick={() => onAddToCart(product)}
            className="btn-primary w-full text-xs"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar al carrito
          </button>
        )}
      </div>
    </article>
  )
}
