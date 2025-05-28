import { Order } from "./cart"

export type User = {
  email: string
  id: string
}

export interface UserContextType {
  user: User | null
  setUser: React.Dispatch<React.SetStateAction<User | null>>
}