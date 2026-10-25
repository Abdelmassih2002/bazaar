"use client"

import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { api } from "@/lib/api"

interface CartItem {
  id: string
  quantity: number
  product: { id: string; name: string; price: number }
}
interface Cart { id: string; items: CartItem[] }

export default function CheckoutPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const { data } = useQuery<Cart>({ queryKey: ["cart"], queryFn: () => api.get<Cart>("/cart") })
  const [address, setAddress] = useState("")
  const [notes, setNotes] = useState("")
  const [error, setError] = useState<string | null>(null)

  const checkoutMut = useMutation({
    mutationFn: () => api.post("/orders", {}),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cart"] })
      qc.invalidateQueries({ queryKey: ["orders"] })
      router.push("/orders")
    },
    onError: (e: Error) => setError(e.message),
  })

  const items = data?.items ?? []
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-10 text-center">
        <p className="text-gray-500">Your cart is empty.</p>
        <Link href="/products" className="mt-4 inline-block underline">Browse products</Link>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-10">
      <h1 className="text-2xl font-bold">Checkout</h1>
      <div className="mt-6 space-y-3">
        {items.map((i) => (
          <div key={i.id} className="flex justify-between rounded-lg border p-3 dark:border-gray-800">
            <span>{i.product.name} × {i.quantity}</span>
            <span>${(i.product.price * i.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-between border-t pt-4 font-bold dark:border-gray-800">
        <span>Total</span>
        <span>${total.toFixed(2)}</span>
      </div>
      <div className="mt-6 space-y-4">
        <div>
          <label className="block text-sm font-medium">Delivery address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Notes (optional)</label>
          <input
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 dark:border-gray-700 dark:bg-gray-900"
          />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button
          onClick={() => checkoutMut.mutate()}
          disabled={checkoutMut.isPending}
          className="w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black"
        >
          {checkoutMut.isPending ? "Placing order..." : "Place Order"}
        </button>
      </div>
    </main>
  )
}
