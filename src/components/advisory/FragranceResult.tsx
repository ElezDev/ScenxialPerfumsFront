import { Link } from 'react-router-dom'
import { MessageCircle, RotateCcw } from 'lucide-react'
import { BoutiqueProductCard } from '../catalog/BoutiqueProductCard'
import { whatsappUrl } from '../../lib/whatsapp'
import { advisoryWhatsAppMessage, type FragranceProfile } from '../../lib/fragranceAdvisor'
import type { Product } from '../../types'

interface FragranceResultProps {
  profile: FragranceProfile
  recommendations: Product[]
  onRestart: () => void
  onAddToCart?: (product: Product) => void
}

export function FragranceResult({
  profile,
  recommendations,
  onRestart,
  onAddToCart,
}: FragranceResultProps) {
  const waUrl = whatsappUrl(advisoryWhatsAppMessage(profile))

  return (
    <div className="space-y-12">
      <div className="border border-aged-gold/20 bg-graphite/40 p-6 sm:p-10">
        <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
          Tu perfil olfativo
        </p>
        <h2 className="mt-3 font-display text-3xl text-bone sm:text-4xl">
          {profile.primary.name}
        </h2>
        {profile.secondary && (
          <p className="mt-2 font-body text-sm text-bone/60">
            Con matices de <span className="text-aged-gold">{profile.secondary.name}</span>
          </p>
        )}

        <div className="boutique-line my-6 max-w-[80px]" />

        <p className="font-body text-sm leading-relaxed text-bone/70">
          {profile.primary.description}
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-bone/40">
              Intensidad
            </p>
            <p className="mt-1 font-body text-sm capitalize text-bone">{profile.intensity}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-bone/40">
              Ocasiones
            </p>
            <p className="mt-1 font-body text-sm text-bone/70">{profile.primary.occasions}</p>
          </div>
          <div>
            <p className="font-body text-[10px] uppercase tracking-[0.25em] text-bone/40">
              Estación
            </p>
            <p className="mt-1 font-body text-sm text-bone/70">{profile.primary.season}</p>
          </div>
        </div>

        <ul className="mt-8 space-y-3">
          {profile.tips.map((tip) => (
            <li key={tip} className="flex gap-3 font-body text-sm leading-relaxed text-bone/65">
              <span className="mt-1.5 h-1 w-1 shrink-0 bg-aged-gold" />
              {tip}
            </li>
          ))}
        </ul>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="boutique-cta-whatsapp inline-flex items-center gap-2"
          >
            <MessageCircle className="h-4 w-4" />
            Asesoría personalizada
          </a>
          <button
            type="button"
            onClick={onRestart}
            className="boutique-cta-outline inline-flex items-center gap-2"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Repetir test
          </button>
        </div>
      </div>

      {recommendations.length > 0 && (
        <div>
          <div className="mb-8 flex items-end justify-between">
            <div>
              <p className="font-body text-xs uppercase tracking-[0.35em] text-aged-gold">
                Para vos
              </p>
              <h3 className="mt-2 font-display text-2xl text-bone">Fragancias sugeridas</h3>
            </div>
            <Link
              to="/catalogo"
              className="font-body text-xs uppercase tracking-[0.2em] text-bone/50 hover:text-aged-gold"
            >
              Ver catálogo
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {recommendations.slice(0, 6).map((product) => (
              <BoutiqueProductCard
                key={product.id}
                product={product}
                onAddToCart={onAddToCart}
              />
            ))}
          </div>
        </div>
      )}

      {recommendations.length === 0 && (
        <div className="border border-white/[0.06] bg-graphite/30 p-8 text-center">
          <p className="font-body text-sm text-bone/60">
            Consultá con nuestro equipo para encontrar la fragancia ideal según tu perfil{' '}
            <span className="text-aged-gold">{profile.primary.name}</span>.
          </p>
          <Link to="/catalogo" className="boutique-cta-outline mt-6 inline-flex">
            Explorar catálogo
          </Link>
        </div>
      )}
    </div>
  )
}
