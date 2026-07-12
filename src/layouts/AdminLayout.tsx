import { NavLink, Outlet, Link } from 'react-router-dom'
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Tag,
  Image,
  Percent,
  ShoppingCart,
  Users,
  LogOut,
  Store,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const sidebarLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition ${
    isActive
      ? 'bg-gold-500/10 text-gold-400'
      : 'text-stone-400 hover:bg-noir-800 hover:text-stone-200'
  }`

const navSections = [
  {
    label: 'General',
    items: [{ to: '/admin', end: true, icon: LayoutDashboard, label: 'Dashboard' }],
  },
  {
    label: 'Catálogo',
    items: [
      { to: '/admin/productos', icon: Package, label: 'Productos' },
      { to: '/admin/categorias', icon: FolderTree, label: 'Categorías' },
      { to: '/admin/marcas', icon: Tag, label: 'Marcas' },
    ],
  },
  {
    label: 'Marketing',
    items: [
      { to: '/admin/banners', icon: Image, label: 'Banners' },
      { to: '/admin/promos', icon: Percent, label: 'Promociones' },
    ],
  },
  {
    label: 'Ventas',
    items: [{ to: '/admin/ordenes', icon: ShoppingCart, label: 'Órdenes' }],
  },
  {
    label: 'Sistema',
    items: [{ to: '/admin/usuarios', icon: Users, label: 'Usuarios' }],
  },
]

export function AdminLayout() {
  const { user, logout } = useAuth()

  return (
    <div className="flex min-h-screen bg-noir-950">
      <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-noir-800 bg-noir-900">
        <div className="border-b border-noir-800 px-6 py-5">
          <Link to="/admin" className="font-display text-xl text-gold-400">
            Scenxial
          </Link>
          <p className="mt-0.5 font-body text-[9px] font-light uppercase tracking-[0.4em] text-stone-600">
            Perfums · Admin
          </p>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-4">
          {navSections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 px-3 text-xs font-medium uppercase tracking-wider text-stone-600">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map(({ to, icon: Icon, label, ...rest }) => (
                  <NavLink key={to} to={to} end={'end' in rest ? rest.end : undefined} className={sidebarLinkClass}>
                    <Icon className="h-4 w-4" />
                    {label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-noir-800 p-4">
          <Link
            to="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-stone-400 transition hover:bg-noir-800 hover:text-stone-200"
          >
            <Store className="h-4 w-4" />
            Ver tienda
          </Link>
          <div className="flex items-center justify-between rounded-lg bg-noir-800 px-3 py-2">
            <span className="truncate text-xs text-stone-400">{user?.name}</span>
            <button
              type="button"
              onClick={() => logout()}
              className="text-stone-500 transition hover:text-gold-400"
              title="Cerrar sesión"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </aside>

      <div className="ml-64 flex-1">
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
