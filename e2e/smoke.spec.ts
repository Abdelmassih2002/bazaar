import { test, expect } from "@playwright/test"

test("landing page loads", async ({ page }) => {
  await page.goto("/")
  await expect(page).toHaveTitle(/Bazaar/)
  await expect(page.getByRole("heading", { name: "Bazaar" })).toBeVisible()
})

test("navigate to login", async ({ page }) => {
  await page.goto("/")
  await page.getByRole("link", { name: "Sign In" }).click()
  await expect(page).toHaveURL(/\/login/)
  await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible()
})

test("navigate to register", async ({ page }) => {
  await page.goto("/login")
  await page.getByRole("link", { name: "Register" }).click()
  await expect(page).toHaveURL(/\/register/)
  await expect(page.getByRole("heading", { name: "Create account" })).toBeVisible()
})
