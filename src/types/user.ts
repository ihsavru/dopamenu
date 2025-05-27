import { Order } from "./cart"

export type User = {
  orders: Order[]
}

export interface UserContextType {
  user: User
  setCart: React.Dispatch<React.SetStateAction<User>>
}