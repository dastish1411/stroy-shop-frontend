import { useState, useEffect } from 'react'
import { Outlet, NavLink } from 'react-router-dom'
import api from '../api/axios'

function SupplierLayout() {
  const [supplier, setSupplier] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await api.get('/supplier/me')
        setSupplier(response.data)
      } catch (err) {
        // если не удалось загрузить - просто не покажем блок с данными компании,
        // остальной кабинет (товары/заказы) всё равно должен работать
      } finally {
        setLoading(false)
      }
    }

    fetchSupplier()
  }, [])

  const linkClass = ({ isActive }) =>
    `block px-4 py-3 rounded-sm transition-colors ${
      isActive
        ? 'bg-charcoal text-white'
        : 'text-charcoal/70 hover:bg-charcoal/5'
    }`

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-charcoal/15 pb-6">
          <p className="text-charcoal/50 text-sm mb-1">Личный кабинет поставщика</p>

          {loading ? (
            <h1 className="font-display text-3xl font-semibold text-charcoal">
              Загрузка...
            </h1>
          ) : supplier ? (
            <>
              <h1 className="font-display text-3xl font-semibold text-charcoal mb-2">
                {supplier.name}
              </h1>
              <div className="flex flex-wrap gap-x-6 gap-y-1 text-charcoal/60 text-sm">
                {supplier.description && <span>{supplier.description}</span>}
                {supplier.contact_phone && <span>Тел: {supplier.contact_phone}</span>}
                <span className="font-medium text-charcoal">
                  Баланс: {supplier.balance} сом
                </span>
              </div>
            </>
          ) : (
            <h1 className="font-display text-3xl font-semibold text-charcoal">
              Личный кабинет
            </h1>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <nav className="bg-white border border-charcoal/10 rounded-sm p-2 h-fit">
            <NavLink to="/supplier" end className={linkClass}>
              Товары
            </NavLink>
            <NavLink to="/supplier/orders" className={linkClass}>
              Заказы
            </NavLink>
            <NavLink to="/supplier/finance" className={linkClass}>
              Финансы
            </NavLink>
          </nav>

          <div className="md:col-span-3">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}

export default SupplierLayout