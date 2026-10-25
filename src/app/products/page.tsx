"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import { api, isAuthenticated } from "@/lib/api"
import type { Product } from "@/types"

export default function ProductsPage() {
  const qc = useQueryClient()
  const { data, isLoading, error } = useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: () => api.get<Product[]>("/products"),
  })

  const addMut = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) => {
      if (!isAuthenticated()) {
        throw new Error("Please log in to add items to cart")
      }
      return api.post("/cart/items", { product_id: productId, quantity })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["cart"] }),
  })

  if (isLoading) return <main className="p-6">Loading products...</main>
  if (error) return <main className="p-6 text-red-600">Failed to load products.</main>

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/cart" className="rounded-lg border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          View Cart
        </Link>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {data?.map((p) => (
          <div key={p.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <h2 className="font-semibold">{p.name}</h2>
            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">{p.description}</p>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-lg font-bold">${p.price.toFixed(2)}</span>
              <span className="text-sm text-gray-500">Stock: {p.stock} · MOQ: {p.moq}</span>
            </div>
            <button
              onClick={() => addMut.mutate({ productId: p.id, quantity: p.moq })}
              disabled={addMut.isPending}
              className="mt-3 w-full rounded-lg bg-black px-4 py-2 text-white hover:bg-gray-800 disabled:opacity-50 dark:bg-white dark:text-black"
            >
              {addMut.isPending ? "Adding..." : `Add to Cart (min ${p.moq})`}
            </button>
          </div>
        ))}
      </div>
      {(!data || data.length === 0) && (
        <p className="mt-10 text-center text-gray-500">No products yet.</p>
      )}
    </main>
  )
}
