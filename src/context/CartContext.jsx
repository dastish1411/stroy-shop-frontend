import { createContext, useContext, useState } from 'react'

const CartContext = createContext(null)

export function useCart() {
  return useContext(CartContext)
}

export function CartProvider({ children }) {
  // массив объектов вида { product, quantity }
  const [items, setItems] = useState([])

  const addToCart = (product, quantity) => {
    setItems((prevItems) => {
      // проверяем, есть ли уже этот товар в корзине
      const existing = prevItems.find((item) => item.product.id === product.id)

      if (existing) {
        // если уже есть - просто увеличиваем количество
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }

      // если нет - добавляем новую позицию
      return [...prevItems, { product, quantity }]
    })
  }

  const removeFromCart = (productId) => {
    setItems((prevItems) =>
      prevItems.filter((item) => item.product.id !== productId)
    )
  }

  const clearCart = () => {
    setItems([])
  }

  const totalItems = items.reduce((sum, item) => sum + 1, 0)

  const value = { items, addToCart, removeFromCart, clearCart, totalItems }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}