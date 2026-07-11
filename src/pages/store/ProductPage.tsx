import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Minus, Plus, ShoppingCart, ChevronLeft } from 'lucide-react'
import { QuoteButton } from '../../components/QuoteButton'
import { StorePageShell } from '../../components/store/StorePageShell'
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
      <StorePageShell className="py-24 text-center">
        <div className="gold-divider mx-auto max-w-xs" />
        <p className="luxury-body mt-8">Cargando pieza...</p>
      </StorePageShell>
    )
  }

  if (error || !product) {
    return (
      <StorePageShell narrow className="py-24 text-center">
        <p className="luxury-body">{error || 'Producto no encontrado.'}</p>
        <Link to="/catalogo" className="btn-secondary mt-8">
          Volver al catálogo
        </Link>
      </StorePageShell>
    )
  }

  const images = getProductImages(product)
  const imageUrl = images[selectedImage] ?? getProductImage(product)

  return (
    <StorePageShell>
      <Link
        to="/catalogo"
        className="mb-8 inline-flex items-center gap-2 font-body text-xs font-light uppercase tracking-widest text-champagne transition hover:text-amber-400"
      >
        <ChevronLeft className="h-4 w-4" />
        Volver al catálogo
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        <div>
          <div className="luxury-card relative aspect-square overflow-hidden">
            {imageUrl ? (
              <>
                <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
              </>
            ) : (
              <div className="flex h-full items-center justify-center">
                <span className="luxury-body text-xs tracking-widest">Sin imagen</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {images.map((img, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`luxury-card aspect-square overflow-hidden transition ${
                    selectedImage === index ? 'border-amber-500/60 ring-1 ring-amber-500/30' : ''
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex flex-col justify-center">
          {product.brand && (
            <p className="luxury-eyebrow">{product.brand.name}</p>
          )}
          <h1 className="luxury-heading mt-3 text-3xl md:text-4xl lg:text-5xl">{product.name}</h1>
          {product.category && (
            <p className="luxury-body mt-2 text-sm">{product.category.name}</p>
          )}

          <div className="gold-divider my-6 max-w-xs" />

          <div className="flex items-baseline gap-3">
            <span className="luxury-price text-4xl">{formatPrice(product.price)}</span>
            {product.compare_price && product.compare_price > product.price && (
              <span className="font-body text-lg font-light text-champagne/50 line-through">
                {formatPrice(product.compare_price)}
              </span>
            )}
          </div>

          {product.short_description && (
            <p className="luxury-body mt-6 leading-relaxed">{product.short_description}</p>
          )}

          <p className="mt-4 font-body text-[10px] uppercase tracking-widest text-champagne/50">
            SKU: {product.sku} · {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            {product.stock > 0 && (
              <>
                <div className="flex items-center rounded-sm border border-amber-500/25 bg-black/40">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-3 text-champagne transition hover:text-amber-400"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-body text-ivory">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    className="p-3 text-champagne transition hover:text-amber-400"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => addItem(product, quantity)}
                  className="btn-gold-shine px-8 py-3"
                >
                  <ShoppingCart className="h-4 w-4" />
                  Agregar al carrito
                </button>
              </>
            )}
            <QuoteButton product={product} quantity={quantity} />
          </div>

          <p className="luxury-body mt-4 text-xs">
            ¿Preferís otro medio de pago? Cotizá por WhatsApp sin compromiso.
          </p>

          {product.description && (
            <div className="mt-10 border-t border-amber-500/15 pt-8">
              <h2 className="luxury-heading text-xl">Descripción</h2>
              <p className="luxury-body mt-4 whitespace-pre-line leading-relaxed">
                {product.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </StorePageShell>
  )
}
