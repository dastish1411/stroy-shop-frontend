import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'

function Navbar() {
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <nav className="bg-charcoal px-6 py-4 flex justify-between items-center">
      <Link to="/" className="font-display text-xl font-semibold text-white tracking-tight">
        Stroy Shop
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="text-concrete hover:text-amber transition-colors">
          Каталог
        </Link>

        {user?.role === 'supplier' && (
          <Link to="/supplier" className="text-concrete hover:text-amber transition-colors">
            Личный кабинет
          </Link>
        )}

        {user?.role === 'admin' && (
          <>
            <Link to="/admin" className="text-concrete hover:text-amber transition-colors">
              Админ-панель
            </Link>
            <Link to="/admin/categories" className="text-concrete hover:text-amber transition-colors">
              Категории
            </Link>
          </>
        )}

        {user && user.role === 'client' && (
          <Link to="/orders" className="text-concrete hover:text-amber transition-colors">
            Мои заказы
          </Link>
        )}

        {user ? (
          <>
            {user.role === 'client' && (
              <Link to="/cart" className="text-concrete hover:text-amber transition-colors">
                Корзина ({totalItems})
              </Link>
            )}
            <span className="text-concrete/60 text-sm">
              {user.full_name || user.email}
            </span>
            <button
              onClick={handleLogout}
              className="bg-brick text-white px-4 py-2 rounded-sm hover:brightness-110 transition"
            >
              Выйти
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-concrete hover:text-amber transition-colors">
              Войти
            </Link>
            <Link
              to="/register"
              className="bg-amber text-charcoal font-medium px-4 py-2 rounded-sm hover:brightness-110 transition"
            >
              Регистрация
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar