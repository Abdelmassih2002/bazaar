"use client"

import Link from "next/link"
import { useLocale } from "@/contexts/locale-context"
import { ShoppingCart, Package, ClipboardList, LayoutDashboard, Globe } from "lucide-react"

export function Navbar() {
  const { t, locale, setLocale } = useLocale()
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
        <Link href="/" className="text-xl font-bold tracking-tight">
          Bazaar
        </Link>
        <div className="flex items-center gap-1 sm:gap-2">
          <Link href="/products" className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            {t("nav.products")}
          </Link>
          <Link href="/cart" className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            {t("nav.cart")}
          </Link>
          <Link href="/orders" className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            {t("nav.orders")}
          </Link>
          <Link href="/admin" className="rounded-lg px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-800">
            {t("nav.admin")}
          </Link>
          <button
            onClick={() => setLocale(locale === "en" ? "ar" : "en")}
            className="ml-2 flex items-center gap-1 rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
          >
            <Globe className="h-4 w-4" />
            {locale === "en" ? "AR" : "EN"}
          </button>
          <Link href="/login" className="ml-2 rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-800 dark:bg-white dark:text-black">
            {t("nav.login")}
          </Link>
        </div>
      </nav>
    </header>
  )
}
