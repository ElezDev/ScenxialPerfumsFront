import { Suspense, lazy } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'
import { AdminRoute } from './components/AdminRoute'
import { StoreLayout } from './layouts/StoreLayout'
import { AdminLayout } from './layouts/AdminLayout'
import { HomePage } from './pages/store/HomePage'
import { CatalogPage } from './pages/store/CatalogPage'
import { AdvisoryPage } from './pages/store/AdvisoryPage'
import { ProductPage } from './pages/store/ProductPage'
import { CartPage } from './pages/store/CartPage'
import { CheckoutPage, CheckoutResultPage } from './pages/store/CheckoutPage'
import { LoginPage, RegisterPage, AdminLoginPage } from './pages/store/AuthPages'

const DashboardPage = lazy(() =>
  import('./pages/admin/DashboardPage').then((m) => ({ default: m.DashboardPage })),
)
const ProductsPage = lazy(() =>
  import('./pages/admin/ProductsPage').then((m) => ({ default: m.ProductsPage })),
)
const CategoriesPage = lazy(() =>
  import('./pages/admin/CategoriesPage').then((m) => ({ default: m.CategoriesPage })),
)
const BrandsPage = lazy(() =>
  import('./pages/admin/BrandsPage').then((m) => ({ default: m.BrandsPage })),
)
const BannersPage = lazy(() =>
  import('./pages/admin/BannersPage').then((m) => ({ default: m.BannersPage })),
)
const PromosPage = lazy(() =>
  import('./pages/admin/PromosPage').then((m) => ({ default: m.PromosPage })),
)
const OrdersPage = lazy(() =>
  import('./pages/admin/OrdersPage').then((m) => ({ default: m.OrdersPage })),
)
const UsersPage = lazy(() =>
  import('./pages/admin/UsersPage').then((m) => ({ default: m.UsersPage })),
)

function AdminFallback() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-500/30 border-t-gold-500" />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            <Route path="/admin/login" element={<AdminLoginPage />} />

            <Route element={<StoreLayout />}>
              <Route index element={<HomePage />} />
              <Route path="catalogo" element={<CatalogPage />} />
              <Route path="asesoria" element={<AdvisoryPage />} />
              <Route path="producto/:slug" element={<ProductPage />} />
              <Route path="carrito" element={<CartPage />} />
              <Route path="checkout" element={<CheckoutPage />} />
              <Route path="checkout/resultado" element={<CheckoutResultPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="registro" element={<RegisterPage />} />
            </Route>

            <Route element={<AdminRoute />}>
              <Route
                path="/admin"
                element={
                  <Suspense fallback={<AdminFallback />}>
                    <AdminLayout />
                  </Suspense>
                }
              >
                <Route index element={<DashboardPage />} />
                <Route path="productos" element={<ProductsPage />} />
                <Route path="categorias" element={<CategoriesPage />} />
                <Route path="marcas" element={<BrandsPage />} />
                <Route path="banners" element={<BannersPage />} />
                <Route path="promos" element={<PromosPage />} />
                <Route path="ordenes" element={<OrdersPage />} />
                <Route path="usuarios" element={<UsersPage />} />
              </Route>
            </Route>
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
