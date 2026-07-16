import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ShoppingCart, User, LogOut, Menu, X } from 'lucide-react'
import { ScenxialLogo } from './ScenxialLogo'
import { useScrolled } from '../../hooks/useScrollReveal'
import { useAuth } from '../../context/AuthContext'
import { useCart } from '../../context/CartContext'

interface StoreNavbarProps {
  transparent?: boolean
}

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-body text-xs font-normal uppercase tracking-[0.2em] transition-all duration-300 ${
    isActive ? 'text-aged-gold' : 'text-bone/80 hover:text-bone'
  }`

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  `block py-3 font-body text-sm font-normal uppercase tracking-[0.25em] transition-all duration-300 ${
    isActive ? 'text-aged-gold' : 'text-bone/80 hover:text-bone'
  }`

export function StoreNavbar({ transparent = false }: StoreNavbarProps) {
  const scrolled = useScrolled(60)
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)

  const isSolid = !transparent || scrolled

  return (
    <>
      <header
        className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
          isSolid
            ? 'border-b border-white/[0.06] bg-carbon/95 backdrop-blur-xl'
            : 'bg-transparent'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 md:px-10 md:py-4">
          {/* Mobile: menú + logo */}
          <div className="flex items-center gap-3 md:hidden">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-1.5 text-bone/80 transition-colors hover:text-aged-gold"
              aria-label="Abrir menú"
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
            </button>
            <ScenxialLogo size="sm" align="left" />
          </div>

          {/* Desktop: nav izquierda */}
          <nav className="hidden items-center gap-8 md:flex">
            <NavLink to="/" end className={navLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" className={navLinkClass}>
              Catálogo
            </NavLink>
            <NavLink to="/asesoria" className={navLinkClass}>
              Asesoría
            </NavLink>
          </nav>

          {/* Desktop: logo centrado */}
          <div className="absolute left-1/2 hidden -translate-x-1/2 md:block">
            <ScenxialLogo size="sm" />
          </div>

          {/* Acciones derecha */}
          <div className="flex items-center gap-3 sm:gap-4">
            <Link
              to="/carrito"
              className="relative p-1.5 text-bone/80 transition-all duration-300 hover:text-aged-gold"
            >
              <ShoppingCart className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-aged-gold text-[9px] font-medium text-carbon">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <button
                type="button"
                onClick={() => logout()}
                className="p-1.5 text-bone/80 transition-all duration-300 hover:text-aged-gold"
                title="Cerrar sesión"
              >
                <LogOut className="h-4 w-4 sm:h-[18px] sm:w-[18px]" strokeWidth={1.5} />
              </button>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1.5 p-1.5 font-body text-xs font-normal uppercase tracking-[0.15em] text-bone/80 transition-all duration-300 hover:text-aged-gold"
              >
                <User className="h-4 w-4" strokeWidth={1.5} />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Drawer móvil */}
      {menuOpen && (
        <div className="fixed inset-0 z-[60] md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-carbon/80 backdrop-blur-sm"
            onClick={() => setMenuOpen(false)}
            aria-label="Cerrar menú"
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,18rem)] flex-col bg-graphite px-6 py-6 shadow-2xl">
            <div className="mb-8 flex items-center justify-between">
              <ScenxialLogo size="sm" align="left" asLink={false} />
              <button
                type="button"
                onClick={() => setMenuOpen(false)}
                className="p-1 text-bone/60 hover:text-bone"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col border-t border-white/[0.06] pt-4">
              <NavLink to="/" end className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                Inicio
              </NavLink>
              <NavLink to="/catalogo" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                Catálogo
              </NavLink>
              <NavLink to="/asesoria" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                Asesoría
              </NavLink>
              <NavLink to="/carrito" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                Carrito {totalItems > 0 && `(${totalItems})`}
              </NavLink>
              {!user && (
                <NavLink to="/login" className={mobileNavLinkClass} onClick={() => setMenuOpen(false)}>
                  Ingresar
                </NavLink>
              )}
            </nav>
          </div>
        </div>
      )}
    </>
  )
}
