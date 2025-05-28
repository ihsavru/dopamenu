import { createContext, useState, useEffect } from "react"
import { UserContextType, User } from "../types/user"
import { supabase } from "../supabaseClient"

export const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
})

export const UserContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user || null)
      }
    )

    return () => {
      authListener.subscription?.unsubscribe()
    }
  }, [])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}
