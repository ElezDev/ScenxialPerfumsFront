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
import { DashboardPage } from './pages/admin/DashboardPage'
import { ProductsPage } from './pages/admin/ProductsPage'
import { CategoriesPage } from './pages/admin/CategoriesPage'
import { BrandsPage } from './pages/admin/BrandsPage'
import { BannersPage } from './pages/admin/BannersPage'
import { PromosPage } from './pages/admin/PromosPage'
import { OrdersPage } from './pages/admin/OrdersPage'
import { UsersPage } from './pages/admin/UsersPage'

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
              <Route path="/admin" element={<AdminLayout />}>
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
