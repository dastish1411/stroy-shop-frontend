import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function RegisterPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'client',
  })
  const [error, setError] = useState('')

  const navigate = useNavigate()

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await api.post('/auth/register', formData)
      navigate('/login')
    } catch (err) {
      const detail = err.response?.data?.detail || 'Ошибка регистрации'
      setError(detail)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-concrete">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-charcoal/10 rounded-sm p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl font-semibold mb-6 text-center text-charcoal">
          Регистрация
        </h1>

        {error && (
          <p className="text-brick text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-charcoal">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-charcoal">Пароль</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-charcoal">Имя</label>
          <input
            type="text"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-charcoal">Телефон</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-charcoal">Я хочу быть</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
          >
            <option value="client">Покупателем</option>
            <option value="supplier">Поставщиком</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-amber text-charcoal font-medium py-2 rounded-sm hover:brightness-110 transition"
        >
          Зарегистрироваться
        </button>

        <p className="text-sm text-center mt-4 text-charcoal/60">
          Уже есть аккаунт?{' '}
          <Link to="/login" className="text-steel hover:underline">
            Войти
          </Link>
        </p>
      </form>
    </div>
  )
}

export default RegisterPage