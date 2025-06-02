import { supabase } from "../supabaseClient"
import { MenuItem } from "../types/menu"

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase.from("menu_items").select("*")

  if (error) throw new Error(error.message)
  return data
}

export const createMenuItem = async (item: MenuItem) => {
  const { data, error } = await supabase
    .from("menu_items")
    .insert([item])
  if (error) throw new Error(error.message)
  return data
}

export const deleteMenuItem = async (id: number) => {
  const { data, error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", id)
  if (error) throw new Error(error.message)
  return data
}
