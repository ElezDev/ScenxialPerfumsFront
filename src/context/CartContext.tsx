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
import { CART_KEY } from '../lib/brand'
import type { CartItem, Decant, Product } from '../types'

interface CartContextValue {
  items: CartItem[]
  totalItems: number
  subtotal: number
  addItem: (product: Product, quantity?: number, decant?: Decant | null) => void
  removeItem: (productId: number, decantId?: number | null) => void
  updateQuantity: (productId: number, quantity: number, decantId?: number | null) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(CART_KEY)
    return stored ? (JSON.parse(stored) as CartItem[]) : []
  } catch {
    return []
  }
}

function sameLine(item: CartItem, productId: number, decantId?: number | null) {
  return item.product.id === productId && (item.decant?.id ?? null) === (decantId ?? null)
}

function lineUnitPrice(item: CartItem) {
  return item.decant?.price ?? item.product.price
}

function lineStockLimit(item: CartItem) {
  return item.decant?.stock ?? item.product.stock
}

function lineLabel(item: CartItem) {
  return item.decant ? `${item.product.name} · Decant ${item.decant.ml}ml` : item.product.name
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart)

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items))
  }, [items])

  const addItem = useCallback((product: Product, quantity = 1, decant: Decant | null = null) => {
    setItems((prev) => {
      const stockLimit = decant ? decant.stock : product.stock
      const existing = prev.find((item) => sameLine(item, product.id, decant?.id))
      const label = decant ? `${product.name} · Decant ${decant.ml}ml` : product.name

      if (existing) {
        const newQty = Math.min(existing.quantity + quantity, stockLimit)
        if (newQty === existing.quantity) {
          toastInfo('Stock máximo', `No hay más unidades disponibles de ${label}.`)
          return prev
        }
        toastSuccess('Carrito actualizado', `${label} · ${newQty} u.`)
        return prev.map((item) =>
          sameLine(item, product.id, decant?.id) ? { ...item, quantity: newQty } : item,
        )
      }

      const qty = Math.min(quantity, stockLimit)
      toastSuccess('Agregado al carrito', `${label}${qty > 1 ? ` · ${qty} u.` : ''}`)
      return [...prev, { product, quantity: qty, decant }]
    })
  }, [])

  const removeItem = useCallback((productId: number, decantId: number | null = null) => {
    setItems((prev) => {
      const item = prev.find((i) => sameLine(i, productId, decantId))
      if (item) toastInfo('Eliminado del carrito', lineLabel(item))
      return prev.filter((i) => !sameLine(i, productId, decantId))
    })
  }, [])

  const updateQuantity = useCallback(
    (productId: number, quantity: number, decantId: number | null = null) => {
      setItems((prev) =>
        prev
          .map((item) => {
            if (!sameLine(item, productId, decantId)) return item
            const qty = Math.max(1, Math.min(quantity, lineStockLimit(item)))
            return { ...item, quantity: qty }
          })
          .filter((item) => item.quantity > 0),
      )
    },
    [],
  )

  const clearCart = useCallback(() => setItems([]), [])

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items],
  )

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + lineUnitPrice(item) * item.quantity, 0),
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
