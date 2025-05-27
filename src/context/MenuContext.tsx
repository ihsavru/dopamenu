import { createContext, useState } from "react"
import { MenuContextType, MenuItem } from "../types/menu"

export const MenuContext = createContext<MenuContextType>({
  menuItems: [],
  setMenuItems: () => {},
})

export const MenuContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([{name: 'walk', description: 'walk', type: 'starters'}])

  return (
    <MenuContext.Provider value={{ menuItems, setMenuItems }}>
      {children}
    </MenuContext.Provider>
  )
}
