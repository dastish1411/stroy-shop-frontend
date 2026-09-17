import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    try {
      await login(email, password)
      navigate('/')
    } catch (err) {
      setError('Неверный email или пароль')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-concrete">
      <form
        onSubmit={handleSubmit}
        className="bg-white border border-charcoal/10 rounded-sm p-8 w-full max-w-sm"
      >
        <h1 className="font-display text-2xl font-semibold mb-6 text-center text-charcoal">
          Вход
        </h1>

        {error && (
          <p className="text-brick text-sm mb-4 text-center">{error}</p>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1 text-charcoal">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-1 text-charcoal">Пароль</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-amber text-charcoal font-medium py-2 rounded-sm hover:brightness-110 transition"
        >
          Войти
        </button>
      </form>
    </div>
  )
}

export default LoginPage