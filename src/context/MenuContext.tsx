import { createContext, useState, useEffect } from "react"
import { MenuContextType, MenuItem } from "../types/menu"
import { useUserContext } from "../hooks/useUserContext"
import { supabase } from "../supabaseClient"

export const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  setMenuItems: () => {},
  addMenuItem: async () => {},
})

export const MenuContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])

  const { user } = useUserContext()

  const fetchMenuItems = async () => {
    if (!user) return

    const { data, error } = await supabase
      .from("menu_items")
      .select("*")
      .eq("user_id", user.id)

    if (error) {
      console.error("Error fetching menu items:", error)
    } else {
      setMenuItems(data || [])
    }
  }

  useEffect(() => {
    fetchMenuItems()
  }, [user])

  const addMenuItem = async (item: MenuItem) => {
    const { data, error } = await supabase.from("menu_items").insert([
      {
        ...item,
        user_id: user.id,
      },
    ])

    if (error) {
      console.error("Error adding item:", error)
    } else {
      fetchMenuItems()
    }
  }

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems, addMenuItem }}>
      {children}
    </MenuContext.Provider>
  )
}
