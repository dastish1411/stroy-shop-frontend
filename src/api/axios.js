import axios from 'axios'

// базовый адрес нашего FastAPI-бэкенда
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
})

// interceptor - код, который автоматически выполняется
// ПЕРЕД каждым запросом. Здесь мы подставляем токен авторизации,
// если он есть в localStorage - чтобы не писать это вручную в каждом запросе
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api