import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function SupplierProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchMyProducts = async () => {
    try {
      const response = await api.get('/supplier/products')
      setProducts(response.data)
    } catch (err) {
      setError('Не удалось загрузить товары')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchMyProducts()
  }, [])

  const handleDelete = async (productId) => {
    if (!confirm('Удалить этот товар?')) return

    try {
      await api.delete(`/supplier/products/${productId}`)
      fetchMyProducts()
    } catch (err) {
      alert('Не удалось удалить товар')
    }
  }

  if (loading) {
    return <div className="text-charcoal/60">Загрузка...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display text-2xl font-semibold text-charcoal">
          Товары
        </h2>
        <Link
          to="/supplier/products/new"
          className="bg-amber text-charcoal font-medium px-5 py-2 rounded-sm hover:brightness-110 transition"
        >
          + Добавить товар
        </Link>
      </div>

      {error && <p className="text-brick mb-4">{error}</p>}

      {products.length === 0 ? (
        <p className="text-charcoal/50">У вас пока нет товаров.</p>
      ) : (
        <div className="bg-white border border-charcoal/10 rounded-sm">
          {products.map((product, index) => (
            <div
              key={product.id}
              className={`flex justify-between items-center p-5 ${
                index !== products.length - 1 ? 'border-b border-charcoal/10' : ''
              }`}
            >
              <div>
                <h3 className="font-medium text-charcoal">{product.name}</h3>
                <p className="text-charcoal/50 text-sm">
                  {product.price} сом / {product.unit === 'kg' ? 'кг' : 'шт'} ·{' '}
                  В наличии: {product.quantity}{' '}
                  {product.unit === 'kg' ? 'кг' : 'шт'}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  to={`/supplier/products/${product.id}/edit`}
                  className="text-steel hover:underline text-sm"
                >
                  Изменить
                </Link>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="text-brick hover:underline text-sm"
                >
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SupplierProductsPage