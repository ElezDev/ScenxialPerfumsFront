import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Check, ChevronLeft, ChevronRight, MessageCircle, Sparkles } from 'lucide-react'
import { LuxuryProductCard } from '../../components/catalog/LuxuryProductCard'
import { LuxurySectionHeader } from '../../components/store/LuxurySectionHeader'
import { StorePageShell } from '../../components/store/StorePageShell'
import { catalogApi } from '../../lib/api'
import { useCart } from '../../context/CartContext'
import { assetUrl, formatPrice } from '../../lib/utils'
import { whatsappUrl } from '../../lib/whatsapp'
import type { Banner, Category, Product, Promo } from '../../types'

export function HomePage() {
  const { addItem } = useCart()
  const [featured, setFeatured] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)
  const [bannerIndex, setBannerIndex] = useState(0)

  useEffect(() => {
    Promise.all([
      catalogApi.products({ featured: true, per_page: 8 }),
      catalogApi.categories({ active_only: true }),
      catalogApi.banners({ active_only: true }),
      catalogApi.promos({ active_only: true }),
    ])
      .then(([productsRes, categoriesRes, bannersRes, promosRes]) => {
        setFeatured(productsRes.data.data)
        setCategories(categoriesRes.data.data.slice(0, 6))
        setBanners(bannersRes.data.data)
        setPromos(promosRes.data.data.slice(0, 3))
      })
      .finally(() => setLoading(false))
  }, [])

  const currentBanner = banners[bannerIndex] ?? null
  const bannerImage = assetUrl(currentBanner?.image)

  function promoDiscount(promo: Promo) {
    if (promo.discount_type === 'percentage') return `${promo.discount_value}% OFF`
    return `${formatPrice(promo.discount_value)} OFF`
  }

  return (
    <div>
      <section className="relative overflow-hidden border-b border-amber-500/10">
        {bannerImage && (
          <div
            className="absolute inset-0 bg-cover bg-center opacity-15"
            style={{ backgroundImage: `url(${bannerImage})` }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/60 to-luxury-black" />

        <div className="relative mx-auto max-w-7xl px-4 py-24 text-center md:py-36">
          {currentBanner ? (
            <>
              {currentBanner.subtitle && (
                <p className="luxury-eyebrow mb-6 inline-flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 text-amber-500/80" />
                  {currentBanner.subtitle}
                </p>
              )}
              <h1 className="luxury-title text-4xl md:text-6xl lg:text-7xl">
                {currentBanner.title}
              </h1>
              {currentBanner.link_url && (
                <Link to={currentBanner.link_url} className="btn-primary mt-10 px-10 py-3.5">
                  {currentBanner.link_text ?? 'Descubrir'}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="luxury-eyebrow mb-6">Colección Exclusiva 2026</p>
              <h1 className="luxury-title text-4xl md:text-6xl lg:text-7xl">Descubrí tu esencia</h1>
              <p className="luxury-body mx-auto mt-6 max-w-lg text-sm leading-relaxed">
                Fragancias de autor, esencias selectas y piezas únicas.
                Una experiencia de boutique de alta perfumería.
              </p>
              <Link to="/catalogo" className="btn-primary mt-10 px-10 py-3.5">
                Explorar catálogo
                <ArrowRight className="h-4 w-4" />
              </Link>
            </>
          )}

          {banners.length > 1 && (
            <div className="mt-12 flex items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => setBannerIndex((i) => (i - 1 + banners.length) % banners.length)}
                className="rounded-sm border border-amber-500/20 p-2 text-champagne transition hover:border-amber-500/50 hover:text-amber-400"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <div className="flex gap-2">
                {banners.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setBannerIndex(i)}
                    className={`h-1.5 transition-all ${
                      i === bannerIndex
                        ? 'w-8 bg-amber-500'
                        : 'w-1.5 bg-amber-500/20 hover:bg-amber-500/40'
                    }`}
                  />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setBannerIndex((i) => (i + 1) % banners.length)}
                className="rounded-sm border border-amber-500/20 p-2 text-champagne transition hover:border-amber-500/50 hover:text-amber-400"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </section>

      {promos.length > 0 && (
        <section className="border-b border-amber-500/10 bg-black/30">
          <StorePageShell className="py-12">
            <div className="grid gap-4 md:grid-cols-3">
              {promos.map((promo) => (
                <div
                  key={promo.id}
                  className="luxury-card flex items-center gap-4 p-5"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-sm border border-amber-500/20 bg-amber-500/5">
                    <span className="luxury-price text-sm">{promoDiscount(promo)}</span>
                  </div>
                  <div>
                    <p className="font-display text-lg text-ivory">{promo.title}</p>
                    {promo.code && (
                      <code className="mt-1 inline-block rounded-sm border border-amber-500/20 bg-black/50 px-2 py-0.5 font-body text-[10px] tracking-widest text-amber-400">
                        {promo.code}
                      </code>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </StorePageShell>
        </section>
      )}

      {categories.length > 0 && (
        <StorePageShell className="py-20">
          <LuxurySectionHeader
            eyebrow="Explorar"
            title="Categorías"
            subtitle="Navegá por nuestras colecciones curadas con la precisión de una maison de perfumería."
          />
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.slug}`}
                className="luxury-card group p-5 text-center"
              >
                <h3 className="font-display text-lg text-amber-400/90 transition group-hover:text-amber-300">
                  {cat.name}
                </h3>
                {cat.products_count != null && (
                  <p className="mt-2 font-body text-[10px] uppercase tracking-widest text-champagne/50">
                    {cat.products_count} piezas
                  </p>
                )}
              </Link>
            ))}
          </div>
        </StorePageShell>
      )}

      <StorePageShell className="py-20">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <p className="luxury-eyebrow">Selección</p>
            <h2 className="luxury-heading mt-2 text-3xl">Destacados</h2>
          </div>
          <Link
            to="/catalogo"
            className="font-body text-xs font-light uppercase tracking-widest text-amber-400 transition hover:text-amber-300"
          >
            Ver todos →
          </Link>
        </div>

        {loading ? (
          <p className="luxury-body py-12 text-center">Cargando colección...</p>
        ) : featured.length === 0 ? (
          <p className="luxury-body py-12 text-center">Próximamente nuevas piezas exclusivas.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((product) => (
              <LuxuryProductCard key={product.id} product={product} onAddToCart={addItem} />
            ))}
          </div>
        )}
      </StorePageShell>

      <section className="relative overflow-hidden border-y border-amber-500/10">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_right,rgba(212,175,55,0.1),transparent_55%)]" />
        <StorePageShell className="relative py-16">
          <div className="flex flex-col items-center gap-10 md:flex-row md:justify-between">
            <div className="max-w-xl text-center md:text-left">
              <p className="luxury-eyebrow">Atención personalizada</p>
              <h2 className="luxury-heading mt-3 text-3xl md:text-4xl">
                Asesoramiento exclusivo por WhatsApp
              </h2>
              <p className="luxury-body mt-4 text-sm leading-relaxed">
                Te ayudamos a elegir la fragancia perfecta. Consultá sin compromiso,
                como en una boutique de alta gama.
              </p>
              <ul className="mt-6 space-y-3">
                {['Catálogo exclusivo', 'Compras seguras', 'Envíos a todo el país', 'Ofertas privadas'].map(
                  (item) => (
                    <li key={item} className="flex items-center justify-center gap-3 md:justify-start">
                      <span className="flex h-5 w-5 items-center justify-center rounded-sm border border-amber-500/30 bg-amber-500/10 text-amber-400">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="font-body text-sm font-light text-ivory/80">{item}</span>
                    </li>
                  ),
                )}
              </ul>
            </div>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp-gold shrink-0 px-10 py-4 text-sm"
            >
              <MessageCircle className="h-5 w-5" />
              Consultar ahora
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </StorePageShell>
      </section>
    </div>
  )
}
