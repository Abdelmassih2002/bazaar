export type UserRole = "retailer" | "wholesaler" | "admin"

export interface User {
  id: string
  email: string
  role: UserRole
  business_name: string
  phone: string
  address: string
}

export interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  moq: number
  category_id: string
  images: string[]
  wholesaler_id: string
}

export interface CartItem {
  id: string
  product_id: string
  product: Product
  quantity: number
}

export interface Cart {
  id: string
  retailer_id: string
  items: CartItem[]
}

export type OrderStatus = "pending" | "accepted" | "shipped" | "delivered" | "cancelled"

export interface OrderItem {
  id: string
  product_id: string
  product: Product
  quantity: number
  unit_price: number
}

export interface Order {
  id: string
  retailer_id: string
  wholesaler_id: string
  status: OrderStatus
  total: number
  created_at: string
  items: OrderItem[]
}
