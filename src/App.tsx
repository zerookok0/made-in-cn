import { lazy, Suspense, useEffect } from 'react'
import { CartDrawer } from './components/CartDrawer'
import { SiteFooter } from './components/SiteFooter'
import { SiteHeader } from './components/SiteHeader'
import { CartProvider } from './lib/cart'
import { useRoute } from './lib/router'
import { CraftPage } from './pages/CraftPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'
import { ProductPage } from './pages/ProductPage'
import { ShopPage } from './pages/ShopPage'

const Admin = lazy(() => import('./pages/Admin'))

function ScrollToTop() {
  const route = useRoute()
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
  }, [route.path])
  return null
}

function Routes() {
  const { path } = useRoute()
  const segments = path.split('/').filter(Boolean)

  if (path === '/') return <HomePage />
  if (path === '/shop') return <ShopPage />
  if (path === '/craft') return <CraftPage />
  if (segments[0] === 'collection' && segments[1]) return <ProductPage slug={segments[1]} />
  return <NotFoundPage />
}

function Shell() {
  const route = useRoute()

  if (route.path === '/admin') {
    return (
      <Suspense
        fallback={
          <div className="admin-loading">
            Loading content studio…
          </div>
        }
      >
        <Admin />
      </Suspense>
    )
  }

  return (
    <CartProvider>
      <ScrollToTop />
      <SiteHeader />
      <main id="main">
        <Routes />
      </main>
      <SiteFooter />
      <CartDrawer />
    </CartProvider>
  )
}

export default function App() {
  return <Shell />
}
