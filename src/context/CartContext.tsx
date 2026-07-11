import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { toastInfo, toastSuccess } from '../lib/alerts'
import type { CartItem, Product } from '../types'

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: number) => void
  updateQuantity: (productId: number, quantity: number) => void
  clearCart: () => void
}

const CART_KEY = 'permuferia_cart'

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, product.stock)
        if (newQty === existing.quantity) {
          toastInfo('Stock máximo', `No hay más unidades de ${product.name}.`)
          return prev
        }
        toastSuccess('Carrito actualizado', `${product.name} · ${newQty} u.`)
        return prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item,
        )
      }
      const qty = Math.min(quantity, product.stock)
      toastSuccess('Agregado al carrito', `${product.name}${qty > 1 ? ` · ${qty} u.` : ''}`)
      return [...prev, { product, quantity: qty }]
    })
  }, [])

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => {
      const item = prev.find((i) => i.product.id === productId)
      if (item) toastInfo('Eliminado del carrito', item.product.name)
      return prev.filter((i) => i.product.id !== productId)
    })
  }, [])

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    setItems((prev) =>
      prev
        .map((item) => {
          if (item.product.id !== productId) return item
          const qty = Math.max(1, Math.min(quantity, item.product.stock))
          return { ...item, quantity: qty }
        })
        .filter((item) => item.quantity > 0),
    )
  }, [])

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    [items],
  )

  const value = useMemo(
    () => ({
      items,
      totalItems,
      subtotal,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    }),
    [items, totalItems, subtotal, addItem, removeItem, updateQuantity, clearCart],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart debe usarse dentro de CartProvider')
  return ctx
}
