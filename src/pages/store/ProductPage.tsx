import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, ChevronLeft } from 'lucide-react'
import { OlfactoryAccordion, parseOlfactoryNotes } from '../../components/catalog/OlfactoryAccordion'
import { QuoteButton } from '../../components/QuoteButton'
import { catalogApi } from '../../lib/api'
import { formatPrice, getProductImage, getProductImages } from '../../lib/utils'
import { useCart } from '../../context/CartContext'
import type { Product } from '../../types'

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>()
  const { addItem } = useCart()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    catalogApi
      .productBySlug(slug)
      .then(({ data }) => setProduct(data.data))
      .catch(() => setError('Producto no encontrado.'))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-20">
        <div className="boutique-line max-w-[120px]" />
        <p className="mt-10 font-body text-[10px] uppercase tracking-[0.4em] text-champagne/30">
          Cargando...
        </p>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center pt-20 text-center">
        <p className="font-body text-sm text-champagne/50">{error || 'Producto no encontrado.'}</p>
        <Link to="/catalogo" className="boutique-cta-outline mt-8">
          Volver al catálogo
        </Link>
      </div>
    )
  }

  const images = getProductImages(product)
  const imageUrl = images[selectedImage] ?? getProductImage(product)
  const olfactory = parseOlfactoryNotes(product.attributes)

  return (
    <div className="bg-carbon pt-24 pb-24 md:pb-0">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-10 md:py-20">
        <Link
          to="/catalogo"
          className="mb-12 inline-flex items-center gap-2 font-body text-[10px] uppercase tracking-[0.3em] text-champagne/40 transition-all duration-300 hover:text-aged-gold"
        >
          <ChevronLeft className="h-3.5 w-3.5" />
          Catálogo
        </Link>

        <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
          <div>
            <div className="relative aspect-[3/4] overflow-hidden bg-graphite">
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={product.name}
                  className="h-full w-full object-cover transition-transform duration-[600ms] ease-out hover:scale-105"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-champagne/20">—</div>
              )}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-carbon/40 to-transparent" />
            </div>
            {images.length > 1 && (
              <div className="mt-4 flex gap-3">
                {images.map((img, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`h-16 w-14 overflow-hidden transition-all duration-300 ${
                      selectedImage === index
                        ? 'ring-1 ring-aged-gold/50'
                        : 'opacity-40 hover:opacity-70'
                    }`}
                  >
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col justify-center lg:py-8">
            {product.brand && (
              <p className="font-body text-[10px] uppercase tracking-[0.4em] text-aged-gold/70">
                {product.brand.name}
              </p>
            )}
            <h1 className="mt-4 font-display text-4xl font-normal tracking-wide text-bone md:text-5xl">
              {product.name}
            </h1>
            {product.category && (
              <p className="mt-3 font-body text-xs font-light text-champagne/40">
                {product.category.name}
              </p>
            )}

            <div className="boutique-line my-8 max-w-[80px]" />

            <p className="font-display text-3xl text-aged-gold">{formatPrice(product.price)}</p>
            {product.compare_price && product.compare_price > product.price && (
              <p className="mt-1 font-body text-sm text-champagne/30 line-through">
                {formatPrice(product.compare_price)}
              </p>
            )}

            {product.stock > 0 && (
              <button
                type="button"
                onClick={() => addItem(product, quantity)}
                className="boutique-cta-solid mt-8 flex w-full items-center justify-center gap-2 sm:mt-10"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar al carrito
              </button>
            )}

            {product.short_description && (
              <p className="mt-8 font-body text-sm font-light leading-relaxed text-champagne/60">
                {product.short_description}
              </p>
            )}

            <p className="mt-4 font-body text-[10px] uppercase tracking-[0.25em] text-champagne/30">
              {product.stock > 0 ? `${product.stock} unidades` : 'Agotado'}
            </p>

            {product.stock > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="font-body text-[10px] uppercase tracking-[0.25em] text-bone/50">
                  Cantidad
                </span>
                <div className="flex items-center border border-white/10">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2 text-champagne/50 transition-colors hover:text-bone"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center font-body text-sm text-bone">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="px-3 py-2 text-champagne/50 transition-colors hover:text-bone"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-4">
              <QuoteButton product={product} quantity={quantity} fullWidth />
            </div>

            {olfactory && (
              <div className="mt-14">
                <p className="mb-4 font-body text-[10px] uppercase tracking-[0.4em] text-aged-gold/50">
                  Pirámide olfativa
                </p>
                <OlfactoryAccordion sections={olfactory} />
              </div>
            )}

            {product.description && (
              <div className="mt-14">
                <p className="mb-4 font-body text-[10px] uppercase tracking-[0.4em] text-aged-gold/50">
                  Descripción
                </p>
                <p className="font-body text-sm font-light leading-[1.8] text-champagne/50 whitespace-pre-line">
                  {product.description}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {product.stock > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/[0.08] bg-carbon/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <button
            type="button"
            onClick={() => addItem(product, quantity)}
            className="boutique-cta-solid flex w-full items-center justify-center gap-2"
          >
            <ShoppingCart className="h-4 w-4" />
            Agregar · {formatPrice(product.price * quantity)}
          </button>
        </div>
      )}
    </div>
  )
}
