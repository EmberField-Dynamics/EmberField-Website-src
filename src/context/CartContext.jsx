import { createContext, useContext, useState, useEffect } from 'react'
import { getProduct } from '../data/services.jsx'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('ed-cart')
      return raw ? JSON.parse(raw) : []
    } catch {
      return []
    }
  })
  const [open, setOpen] = useState(false)

  useEffect(() => {
    try {
      localStorage.setItem('ed-cart', JSON.stringify(items))
    } catch {}
  }, [items])

  const add = (slug, qty = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.slug === slug)
      if (existing) {
        return prev.map((i) => (i.slug === slug ? { ...i, qty: Math.min(i.qty + qty, 9) } : i))
      }
      const product = getProduct(slug)
      if (!product) return prev
      return [...prev, { slug, qty: Math.min(qty, 9) }]
    })
  }

  const setQty = (slug, qty) => {
    if (qty <= 0) return remove(slug)
    setItems((prev) => prev.map((i) => (i.slug === slug ? { ...i, qty: Math.min(qty, 9) } : i)))
  }

  const remove = (slug) => setItems((prev) => prev.filter((i) => i.slug !== slug))

  const clear = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.qty, 0)

  const value = { items, add, setQty, remove, clear, count, open, setOpen }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  return useContext(CartContext)
}