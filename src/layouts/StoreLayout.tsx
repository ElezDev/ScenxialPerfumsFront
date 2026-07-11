import { Link, NavLink, Outlet } from 'react-router-dom'
import { ShoppingBag, User, LogOut } from 'lucide-react'
import { MarbleBackground } from '../components/catalog/MarbleBackground'
import { WhatsAppButton } from '../components/WhatsAppButton'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `font-body text-xs font-light uppercase tracking-[0.2em] transition ${
    isActive ? 'text-amber-400' : 'text-champagne hover:text-amber-400'
  }`

export function StoreLayout() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()

  return (
    <div className="relative min-h-screen bg-luxury-black">
      <MarbleBackground />

      <header className="sticky top-0 z-50 border-b border-amber-500/15 bg-black/80 backdrop-blur-md">
        <div className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-5">
          <nav className="flex items-center gap-5 md:gap-8">
            <NavLink to="/" end className={navLinkClass}>
              Inicio
            </NavLink>
            <NavLink to="/catalogo" className={navLinkClass}>
              Catálogo
            </NavLink>
          </nav>

          <Link to="/" className="absolute left-1/2 -translate-x-1/2 text-center">
            <span className="luxury-title text-xl tracking-[0.28em] md:text-2xl lg:text-3xl">
              Permuferia
            </span>
          </Link>

          <div className="flex items-center gap-3 md:gap-4">
            <Link
              to="/carrito"
              className="relative rounded-sm p-2 text-champagne transition hover:text-amber-400"
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-amber-600 text-xs font-medium text-black">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <span className="hidden font-body text-xs font-light text-champagne lg:inline">
                  {user.name}
                </span>
                <button
                  type="button"
                  onClick={() => logout()}
                  className="rounded-sm p-2 text-champagne transition hover:text-amber-400"
                  title="Cerrar sesión"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-1 font-body text-xs font-light uppercase tracking-wider text-champagne transition hover:text-amber-400"
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Ingresar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="relative z-10">
        <Outlet />
      </main>

      <footer className="relative z-10 border-t border-amber-500/10 bg-black/60 backdrop-blur-sm">
        <div className="gold-divider" />
        <div className="mx-auto max-w-7xl px-4 py-14 text-center">
          <p className="luxury-title text-2xl tracking-[0.25em]">Permuferia</p>
          <p className="luxury-body mt-4 text-sm">
            Alta perfumería · Exclusividad · Elegancia nocturna
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            <Link to="/catalogo" className="luxury-eyebrow hover:text-amber-400">
              Catálogo
            </Link>
            <Link to="/carrito" className="luxury-eyebrow hover:text-amber-400">
              Carrito
            </Link>
            <Link to="/login" className="luxury-eyebrow hover:text-amber-400">
              Mi cuenta
            </Link>
          </div>
          <p className="mt-8 font-body text-xs font-light text-champagne/40">
            &copy; {new Date().getFullYear()} Permuferia. Todos los derechos reservados.
          </p>
        </div>
      </footer>

      <WhatsAppButton />
    </div>
  )
}
