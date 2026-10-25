"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { api } from "@/lib/api"

interface Dashboard {
  total_products: number
  total_orders: number
  pending_orders: number
  total_revenue: number
  low_stock_count: number
  low_stock_products: { id: string; name: string; stock: number }[]
}

export default function AdminPage() {
  const { data, isLoading, error } = useQuery<Dashboard>({
    queryKey: ["admin-dashboard"],
    queryFn: () => api.get<Dashboard>("/admin/dashboard"),
  })

  if (isLoading) return <main className="p-6">Loading dashboard...</main>
  if (error) return <main className="p-6 text-red-600">Failed to load dashboard. (Wholesaler/Admin role required)</main>

  return (
    <main className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="text-2xl font-bold">Admin Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Products", value: data?.total_products },
          { label: "Orders", value: data?.total_orders },
          { label: "Pending", value: data?.pending_orders },
          { label: "Revenue", value: `$${data?.total_revenue?.toFixed(2)}` },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="mt-1 text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-8">
        <h2 className="text-lg font-semibold">Low Stock ({data?.low_stock_count})</h2>
        <ul className="mt-3 space-y-2">
          {data?.low_stock_products.map((p) => (
            <li key={p.id} className="flex justify-between rounded-lg border p-3 dark:border-gray-800">
              <span>{p.name}</span>
              <span className="text-red-600">Stock: {p.stock}</span>
            </li>
          ))}
          {data?.low_stock_products.length === 0 && (
            <p className="text-sm text-gray-500">All products well-stocked.</p>
          )}
        </ul>
      </div>
      <div className="mt-8 flex gap-3">
        <Link href="/products" className="rounded-lg border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          Manage Products
        </Link>
        <Link href="/orders" className="rounded-lg border px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800">
          View Orders
        </Link>
      </div>
    </main>
  )
}
