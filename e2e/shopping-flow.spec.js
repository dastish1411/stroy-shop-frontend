import { test, expect } from '@playwright/test'

// ПРОВЕРКА: пользователь может открыть главную страницу и увидеть категории
test('главная страница показывает категории товаров', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Каталог')).toBeVisible()
  await expect(page.getByText('Цемент')).toBeVisible()
})

// ПРОВЕРКА: новый пользователь может зарегистрироваться
test('пользователь может зарегистрироваться', async ({ page }) => {
  await page.goto('/register')

  const uniqueEmail = `e2e_test_${Date.now()}@example.com`

  await page.fill('input[name="email"]', uniqueEmail)
  await page.fill('input[name="password"]', 'test123456')
  await page.click('button[type="submit"]')

  await expect(page).toHaveURL(/.*\/login/)
})

// ПРОВЕРКА: залогиненный клиент может добавить товар в корзину
test('клиент может добавить товар в корзину', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'client1@example.com')
  await page.fill('input[type="password"]', '123')
  await page.click('button[type="submit"]')

  await expect(page.getByText('Мои заказы')).toBeVisible()

  await page.getByText('Цемент').click()
  await page.locator('a[href^="/products/"]').first().click()
  await page.getByText('В корзину').click()

  await expect(page.getByText('Добавлено!')).toBeVisible()
})

// ПРОВЕРКА: клиент может оформить заказ из корзины
test('клиент может оформить заказ', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'client1@example.com')
  await page.fill('input[type="password"]', '123')
  await page.click('button[type="submit"]')

  await page.getByText('Цемент').click()
  await page.locator('a[href^="/products/"]').first().click()
  await page.getByText('В корзину').click()

  await page.getByText(/Корзина/).click()
  await page.getByText('Оформить заказ').click()

  await expect(page.getByText('Заказ оформлен')).toBeVisible()
})

// ПРОВЕРКА: неавторизованный пользователь не может попасть в личный кабинет поставщика
test('неавторизованный пользователь не может попасть в кабинет поставщика', async ({ page }) => {
  await page.goto('/supplier')
  await expect(page).toHaveURL(/.*\/login/)
})