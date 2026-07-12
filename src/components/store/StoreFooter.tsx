import { type FormEvent, useState } from 'react'
import { Link } from 'react-router-dom'
import { Mail } from 'lucide-react'
import { ScenxialLogo } from './ScenxialLogo'
import { toastSuccess } from '../../lib/alerts'
import { BRAND } from '../../lib/brand'

function SocialIcon({ href, label, children }: { href: string; label: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="text-champagne/40 transition-all duration-300 hover:text-aged-gold"
    >
      {children}
    </a>
  )
}

export function StoreFooter() {
  const [email, setEmail] = useState('')

  function handleNewsletter(e: FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    toastSuccess('Suscripción registrada', 'Pronto recibirás nuestras novedades.')
    setEmail('')
  }

  return (
    <footer className="border-t border-white/[0.06] bg-carbon">
      <div className="mx-auto max-w-7xl px-6 py-20 md:px-10">
        <div className="grid gap-16 md:grid-cols-3">
          <div className="text-center md:text-left">
            <ScenxialLogo size="md" asLink={false} />
            <p className="mt-6 font-body text-xs font-light leading-relaxed text-champagne/40">
              {BRAND.motto}
            </p>
          </div>

          <div className="text-center">
            <p className="font-body text-[10px] uppercase tracking-[0.4em] text-aged-gold/60">
              Newsletter
            </p>
            <p className="mt-4 font-body text-xs font-light text-champagne/40">
              Acceso anticipado a lanzamientos exclusivos.
            </p>
            <form onSubmit={handleNewsletter} className="mt-6">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                className="boutique-newsletter-input"
              />
            </form>
          </div>

          <div className="flex flex-col items-center md:items-end">
            <div className="flex gap-6">
              <SocialIcon href="https://instagram.com" label="Instagram">
                <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25">
                  <rect x="2" y="2" width="20" height="20" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
                </svg>
              </SocialIcon>
              <SocialIcon href="mailto:contacto@scenxial.com" label="Email">
                <Mail className="h-4 w-4" strokeWidth={1.25} />
              </SocialIcon>
            </div>
            <div className="mt-8 flex gap-8">
              {[
                { to: '/catalogo', label: 'Catálogo' },
                { to: '/carrito', label: 'Carrito' },
                { to: '/login', label: 'Cuenta' },
              ].map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="font-body text-[10px] uppercase tracking-[0.25em] text-champagne/30 transition-all duration-300 hover:text-aged-gold"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="boutique-line mt-16" />
        <p className="mt-8 text-center font-body text-[10px] font-light tracking-[0.3em] text-champagne/20">
          &copy; {new Date().getFullYear()} {BRAND.copyright}
        </p>
      </div>
    </footer>
  )
}
