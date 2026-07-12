import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, MessageCircle } from 'lucide-react'
import { BoutiqueProductCard } from '../../components/catalog/BoutiqueProductCard'
import { ScrollReveal } from '../../components/catalog/ScrollReveal'
import { BannerCarousel } from '../../components/store/BannerCarousel'
import { PromoCarousel } from '../../components/store/PromoCarousel'
import { catalogApi } from '../../lib/api'
import { BRAND } from '../../lib/brand'
import { useCart } from '../../context/CartContext'
import { whatsappUrl } from '../../lib/whatsapp'
import type { Banner, Category, Product, Promo } from '../../types'

export function HomePage() {
  const { addItem } = useCart()
  const [featured, setFeatured] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [banners, setBanners] = useState<Banner[]>([])
  const [promos, setPromos] = useState<Promo[]>([])
  const [loading, setLoading] = useState(true)

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
        setPromos(promosRes.data.data)
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="bg-carbon">
      <BannerCarousel banners={banners} />
      <PromoCarousel promos={promos} />

      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14 md:px-10">
          <div className="mb-8 flex items-end justify-between border-b border-white/[0.06] pb-6">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
                Explorar
              </p>
              <h2 className="mt-2 font-display text-2xl text-bone sm:text-3xl">
                Categorías
              </h2>
            </div>
            <Link
              to="/catalogo"
              className="font-body text-xs uppercase tracking-[0.2em] text-bone/60 transition-colors hover:text-aged-gold"
            >
              Ver todo
            </Link>
          </div>

          <div className="boutique-carousel-track flex gap-3 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible lg:grid-cols-6">
            {categories.map((cat) => (
              <Link
                key={cat.id}
                to={`/catalogo?categoria=${cat.slug}`}
                className="boutique-category-pill group min-w-[140px] shrink-0 snap-center sm:min-w-0"
              >
                <h3 className="font-display text-base text-bone transition-colors duration-300 group-hover:text-aged-gold sm:text-lg">
                  {cat.name}
                </h3>
                {cat.products_count != null && (
                  <p className="mt-2 font-body text-[10px] uppercase tracking-[0.3em] text-bone/40">
                    {cat.products_count} piezas
                  </p>
                )}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="border-t border-white/[0.06] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
                Selección
              </p>
              <h2 className="mt-2 font-display text-2xl text-bone sm:text-3xl">
                Destacados
              </h2>
              <p className="mt-2 font-body text-sm text-bone/60">
                Agregá al carrito con un solo clic
              </p>
            </div>
            <Link
              to="/catalogo"
              className="hidden items-center gap-1.5 font-body text-xs uppercase tracking-[0.2em] text-aged-gold transition-colors hover:text-bone sm:flex"
            >
              Ver catálogo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center py-16">
              <div className="boutique-line max-w-[120px]" />
              <p className="mt-6 font-body text-sm text-bone/50">Cargando colección...</p>
            </div>
          ) : featured.length === 0 ? (
            <div className="py-16 text-center">
              <p className="font-body text-sm text-bone/60">Próximamente nuevas piezas exclusivas.</p>
              <Link to="/catalogo" className="boutique-cta-outline mt-6 inline-flex">
                Ir al catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 sm:gap-y-14 lg:grid-cols-3 xl:grid-cols-4">
              {featured.map((product, i) => (
                <ScrollReveal key={product.id} delay={i * 50}>
                  <BoutiqueProductCard product={product} onAddToCart={addItem} />
                </ScrollReveal>
              ))}
            </div>
          )}

          <div className="mt-10 text-center sm:hidden">
            <Link to="/catalogo" className="boutique-cta-outline inline-flex items-center gap-2">
              Ver catálogo completo
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] py-10 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-10">
          <div className="flex flex-col items-center gap-8 border border-white/[0.06] bg-graphite/50 p-8 text-center md:flex-row md:justify-between md:p-12 md:text-left">
            <div className="max-w-md">
              <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
                Atención personalizada
              </p>
              <h2 className="mt-3 font-display text-2xl text-bone sm:text-3xl">
                Asesoramiento exclusivo
              </h2>
              <p className="mt-3 font-body text-sm leading-relaxed text-bone/65">
                {BRAND.motto}. Elegí tu fragancia con la guía de nuestros expertos.
              </p>
            </div>
            <a
              href={whatsappUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="boutique-cta-solid inline-flex shrink-0 items-center gap-2"
            >
              <MessageCircle className="h-4 w-4" />
              Consultar por WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
