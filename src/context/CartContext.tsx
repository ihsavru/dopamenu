import { createContext, useState } from "react"
import { CartContextType, CartItem } from "../types/cart"
import { useUserContext } from "../hooks/useUserContext"
import { supabase } from "../supabaseClient"

export const CartContext = createContext<CartContextType>({
  cart: [],
  setCart: () => {},
  placeOrder: async () => {},
})

export const CartContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [cart, setCart] = useState<CartItem[]>([])
  const { user } = useUserContext()

  const placeOrder = async () => {
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert([{ user_id: user.id, status: "pending" }])
      .select()
      .single()

    if (orderError || !order) {
      console.error("Failed to create order", orderError)
      return
    }

    const orderItems = cart.map(({ menuItem }) => ({
      order_id: order.id,
      menu_item_id: menuItem.id,
    }))

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(orderItems)

    if (itemsError) {
      console.error("Failed to insert order items", itemsError)
      return
    }

    setCart([])
  }

  return (
    <CartContext.Provider value={{ cart, setCart, placeOrder }}>
      {children}
    </CartContext.Provider>
  )
}
