
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  // адрес сайта, который будем тестировать - можно менять на локальный/продакшен
  use: {
    baseURL: 'https://frontend-dastan.toolforge.rest',
  },
  // таймаут ожидания для каждого действия (клик, ввод текста и т.д.)
  timeout: 30000,
})
