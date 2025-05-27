export type MenuItemType =
  | "starters"
  | "mains"
  | "sides"
  | "desserts"
  | "specials"

export type MenuItem = {
  id: string
  name: string
  durationInSeconds?: number
  description?: string
  type: MenuItemType
}

export interface MenuContextType {
  menuItems: MenuItem[]
  setMenuItems: React.Dispatch<React.SetStateAction<MenuItem[]>>
  addMenuItem: (item: MenuItem) => Promise<void>
}
