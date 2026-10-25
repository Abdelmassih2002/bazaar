"use client"

import { useLocale } from "@/contexts/locale-context"
import Link from "next/link"
import { Package, ShoppingCart, Truck, BarChart3, ArrowRight } from "lucide-react"

export default function Home() {
  const { t } = useLocale()
  const features = [
    { icon: Package, title: t("products.title"), desc: "Browse wholesale products with prices, stock, and MOQ." },
    { icon: ShoppingCart, title: t("cart.title"), desc: "Build orders with quantity tiers and validation." },
    { icon: Truck, title: t("orders.title"), desc: "Track status from pending to delivered." },
    { icon: BarChart3, title: t("admin.title"), desc: "Wholesalers manage products, stock, and orders." },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-950 dark:to-gray-900">
      <main>
        {/* Hero */}
        <section className="mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
          <span className="inline-block rounded-full bg-gray-100 px-4 py-1 text-sm font-medium text-gray-700 dark:bg-gray-800 dark:text-gray-300">
            B2B Wholesale Platform
          </span>
          <h1 className="mt-6 text-5xl font-extrabold tracking-tight sm:text-7xl">
            {t("home.title")}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600 dark:text-gray-400">
            {t("home.subtitle")}
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-black px-8 py-4 text-base font-semibold text-white shadow-lg transition hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              {t("home.cta")} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-300 px-8 py-4 text-base font-semibold hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
            >
              Browse Products
            </Link>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-gray-800 dark:bg-gray-900"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-800">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-4xl px-6 pb-20 text-center">
          <div className="rounded-3xl bg-black px-8 py-12 text-white dark:bg-white dark:text-black">
            <h2 className="text-3xl font-bold">Ready to modernize your wholesale ordering?</h2>
            <p className="mt-3 text-gray-300 dark:text-gray-600">
              Join Bazaar today — no more WhatsApp chaos.
            </p>
            <Link
              href="/register"
              className="mt-6 inline-block rounded-xl bg-white px-8 py-3 font-semibold text-black transition hover:bg-gray-200 dark:bg-black dark:text-white dark:hover:bg-gray-800"
            >
              {t("home.cta")}
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 dark:border-gray-800">
        © 2026 Bazaar. Built by Abdelmassih Gad.
      </footer>
    </div>
  )
}
