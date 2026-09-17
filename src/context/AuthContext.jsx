import { createContext, useContext, useState } from 'react'
import api from '../api/axios'

// создаём "контейнер" для данных авторизации
const AuthContext = createContext(null)

// хук для удобного доступа к контексту из любого компонента
export function useAuth() {
  return useContext(AuthContext)
}

// компонент-обёртка, который будет "оборачивать" всё приложение
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password })
    const { access_token, refresh_token } = response.data

    localStorage.setItem('access_token', access_token)
    localStorage.setItem('refresh_token', refresh_token)

    // после логина сразу подгружаем данные пользователя
    const meResponse = await api.get('/auth/me')
    setUser(meResponse.data)
  }

  const logout = async () => {
  const refreshToken = localStorage.getItem('refresh_token')
  try {
    if (refreshToken) {
      await api.post('/auth/logout', { refresh_token: refreshToken })
    }
  } catch (err) {
    // даже если запрос на сервер не удался - всё равно чистим локальные данные
    console.error('Ошибка при выходе:', err)
  }

  localStorage.removeItem('access_token')
  localStorage.removeItem('refresh_token')
  setUser(null)
}

  const value = { user, login, logout }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}