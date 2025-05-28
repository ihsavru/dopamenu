import { supabase } from "../supabaseClient"
import { CartItem } from "../types/cart"

export const fetchOrders = async (userId: string) => {
  const { data, error } = await supabase
    .from("orders")
    .select("*, order_items (*, menu_items(*))")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

export const createOrder = async ({
  items,
  userId,
}: {
  items: CartItem[]
  userId: string
}) => {
  const { data: order, error } = await supabase
    .from("orders")
    .insert([{ user_id: userId, status: "pending" }])
    .select()
    .single()

  if (error) throw error

  const orderItems = items.map(({ menuItem }) => ({
    order_id: order.id,
    menu_item_id: menuItem.id,
  }))

  const { error: itemError } = await supabase
    .from("order_items")
    .insert(orderItems)

  if (itemError) throw itemError

  return order
}
