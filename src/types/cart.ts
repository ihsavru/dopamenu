import { MenuItem } from "./menu"

export type CartItem = {
  menuItem: MenuItem
}

export type Order = {
  items: CartItem[]
  timestamp: number
  status: string
}

export interface CartContextType {
  cart: CartItem[]
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>
}
