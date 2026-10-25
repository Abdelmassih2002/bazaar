"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { api, isAuthenticated } from "@/lib/api"

interface OrderItem { id: string; product_name: string; quantity: number; unit_price: number }
interface Order { id: string; status: string; total: number; created_at: string; items: OrderItem[] }

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default function OrdersPage() {
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login")
    }
  }, [router])

  const { data, isLoading, error } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: () => api.get<Order[]>("/orders"),
  })

  if (isLoading) return <main className="p-6">Loading orders...</main>
  if (error) return <main className="p-6 text-red-600">Failed to load orders.</main>

  return (
    <main className="mx-auto max-w-4xl px-6 py-10">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Link href="/products" className="rounded-lg border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          Back to Products
        </Link>
      </div>
      <div className="mt-6 space-y-4">
        {data?.map((o) => (
          <div key={o.id} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex items-center justify-between">
              <span className="font-mono text-sm text-gray-500">#{o.id.slice(0, 8)}</span>
              <span className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[o.status] ?? ""}`}>
                {o.status}
              </span>
            </div>
            <ul className="mt-3 space-y-1 text-sm">
              {o.items.map((it) => (
                <li key={it.id} className="flex justify-between">
                  <span>{it.product_name} × {it.quantity}</span>
                  <span>${(it.unit_price * it.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex justify-between border-t pt-2 font-bold dark:border-gray-800">
              <span>Total</span>
              <span>${o.total.toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
      {(!data || data.length === 0) && (
        <p className="mt-10 text-center text-gray-500">No orders yet.</p>
      )}
    </main>
  )
}
