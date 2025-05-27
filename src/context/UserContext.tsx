import { createContext, useState } from "react"
import { UserContextType, User } from "../types/user"

export const UserContext = createContext<UserContextType>({
  user: [],
  setUser: () => {},
})

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User>({ orders: [] })

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
