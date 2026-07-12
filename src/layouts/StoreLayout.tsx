import { Outlet, useLocation } from 'react-router-dom'
import { StoreFooter } from '../components/store/StoreFooter'
import { StoreNavbar } from '../components/store/StoreNavbar'
import { WhatsAppButton } from '../components/WhatsAppButton'

export function StoreLayout() {
  const { pathname } = useLocation()
  const isCatalog = pathname === '/catalogo'

  return (
    <div className="min-h-screen bg-carbon">
      <StoreNavbar transparent={isCatalog} />

      <main className={isCatalog ? '' : 'pt-20'}>
        <Outlet />
      </main>

      <StoreFooter />
      <WhatsAppButton />
    </div>
  )
}
