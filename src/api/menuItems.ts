import { supabase } from "../supabaseClient"

export const fetchMenuItems = async (): Promise<MenuItem[]> => {
  const { data, error } = await supabase.from("menu_items").select("*")

  if (error) throw new Error(error.message)
  return data
}

export const createMenuItem = async (item: MenuItem) => {
  const { data, error } = await supabase.from("menu_items").insert([item])
  if (error) throw new Error(error.message)
  return data
}
