import { createContext, useState } from "react"
import { CartContextType, CartItem } from "../types/cart"

export const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
})

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([])

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  )
}
