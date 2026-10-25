"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { api, isAuthenticated } from "@/lib/api"

interface CartItem {
  id: string
  product_id: string
  quantity: number
  product: { id: string; name: string; price: number; stock: number; moq: number; images: string[] }
}

interface Cart {
  id: string
  items: CartItem[]
}

export default function CartPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  const qc = useQueryClient()
  const { data, isLoading } = useQuery<Cart>({
    queryKey: ["cart"],
    queryFn: () => api.get<Cart>("/cart"),
  })

  const removeMut = useMutation({
    mutationFn: (itemId: string) => api.delete(`/cart/items/${itemId}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  })

  if (isLoading) return <main className="p-6">Loading cart...</main>

  const items = data?.items ?? []
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <h1 className="text-2xl font-bold">Your Cart</h1>
      {items.length === 0 && (
        <p className="mt-6 text-gray-500">
          Cart is empty.{" "}
          <Link href="/products" className="underline">
            Browse products
          </Link>
        </p>
      )}
      <ul className="mt-6 space-y-3">
        {items.map((i) => (
          <li key={i.id} className="flex items-center justify-between rounded-lg border p-4 dark:border-gray-800">
            <div>
              <p className="font-semibold">{i.product.name}</p>
              <p className="text-sm text-gray-500">
                ${i.product.price.toFixed(2)} × {i.quantity} = ${(i.product.price * i.quantity).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => removeMut.mutate(i.id)}
              className="text-sm text-red-600 hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
      {items.length > 0 && (
        <div className="mt-6 w-full flex items-center justify-between gap-4 flex-wrap border-t pt-4 dark:border-gray-800">
          <span className="text-lg font-bold">Total: ${total.toFixed(2)}</span>
          <button className="rounded-lg bg-black px-6 py-2 text-white hover:bg-gray-800 dark:bg-white dark:text-black">
            Checkout (TODO)
          </button>
        </div>
      )}
    </main>
  )
}
