import { useContext } from "react"
import { CartContext } from "../context/CartContext"

export const useCartContext = () => {
  const context = useContext(CartContext)
  if (!context)
    throw new Error("useCartContext must be used within a CartContext.Provider")
  return context
}
