"use client"

import { useLocale } from "@/contexts/locale-context"
import Link from "next/link"
import { Package, ShoppingCart, Truck, BarChart3, Globe } from "lucide-react"

export default function Home() {
  const { t, locale, setLocale } = useLocale()
  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="absolute right-4 top-4">
        <button
          onClick={() => setLocale(locale === "en" ? "ar" : "en")}
          className="flex items-center gap-1 rounded-lg border px-3 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Globe className="h-4 w-4" />
          {locale === "en" ? "العربية" : "English"}
        </button>
      </div>
      <section className="mx-auto max-w-5xl px-6 py-20 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {t("home.title")}
        </h1>
        <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
          {t("home.subtitle")}
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/register"
            className="rounded-lg bg-black px-6 py-3 text-white hover:bg-gray-800 dark:bg-white dark:text-black"
          >
            {t("home.cta")}
          </Link>
          <Link
            href="/login"
            className="rounded-lg border border-gray-300 px-6 py-3 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            {t("nav.login")}
          </Link>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-6 pb-20 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { icon: Package, title: "Catalog", desc: "Browse wholesale products with prices, stock, and MOQ." },
          { icon: ShoppingCart, title: "Cart", desc: "Build orders with quantity tiers and validation." },
          { icon: Truck, title: "Orders", desc: "Track status from pending to delivered." },
          { icon: BarChart3, title: "Dashboard", desc: "Wholesalers manage products, stock, and orders." },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-xl border border-gray-200 p-6 dark:border-gray-800"
          >
            <f.icon className="h-8 w-8" />
            <h3 className="mt-4 font-semibold">{f.title}</h3>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{f.desc}</p>
          </div>
        ))}
      </section>
    </main>
  )
}
