import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'
import { useCart } from '../context/CartContext'

function ProductPage() {
  const { id } = useParams()
  const { addToCart } = useCart()

  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [added, setAdded] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`)
        setProduct(response.data)
      } catch (err) {
        setError('Товар не найден')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleAddToCart = () => {
    addToCart(product, Number(quantity))
    setAdded(true)
  }

  if (loading) {
    return <div className="text-center mt-10 text-charcoal/60">Загрузка...</div>
  }

  if (error || !product) {
    return (
      <div className="text-center mt-10 text-brick">
        {error || 'Товар не найден'}
      </div>
    )
  }

  const unitLabel = product.unit === 'kg' ? 'кг' : 'шт'

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link to="/catalog" className="text-steel hover:underline mb-6 inline-block">
          ← Назад в каталог
        </Link>

        {/* Одна цельная панель с внутренними разделителями вместо отдельных карточек */}
        <div className="bg-white border border-charcoal/10 rounded-sm grid grid-cols-1 md:grid-cols-3">
          {/* Левая часть - описание */}
          <div className="md:col-span-2 p-8 md:border-r border-charcoal/10">
            <p className="text-charcoal/50 text-sm mb-2">{product.category.name}</p>
            <h1 className="font-display text-3xl font-semibold text-charcoal mb-4">
              {product.name}
            </h1>
            <p className="text-charcoal/50 mb-6">
              В наличии: {product.quantity} {unitLabel}
            </p>

            {product.description ? (
              <p className="text-charcoal/80 leading-relaxed">
                {product.description}
              </p>
            ) : (
              <p className="text-charcoal/40 italic">Описание отсутствует</p>
            )}
          </div>

          {/* Правая часть - покупка + поставщик, разделены одной внутренней линией */}
          <div className="flex flex-col">
            <div className="p-6 border-b border-charcoal/10">
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-2xl font-semibold text-charcoal">
                  {product.price} сом
                </span>
                <span className="text-charcoal/50 text-sm">/ {unitLabel}</span>
              </div>

              <label className="block text-sm font-medium text-charcoal mb-1">
                Количество ({unitLabel})
              </label>
              <input
                type="number"
                min="0.001"
                step="0.001"
                max={product.quantity}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full border border-charcoal/20 rounded-sm px-3 py-2 mb-4 focus:outline-none focus:border-steel"
              />

              <p className="text-charcoal/60 text-sm mb-4">
                Сумма: {(quantity * product.price).toFixed(2)} сом
              </p>

              <button
                onClick={handleAddToCart}
                className="w-full bg-amber text-charcoal font-medium py-3 rounded-sm hover:brightness-110 transition"
              >
                В корзину
              </button>

              {added && (
                <p className="text-steel text-center text-sm mt-3">
                  Добавлено!{' '}
                  <Link to="/cart" className="underline">
                    В корзину
                  </Link>
                </p>
              )}
            </div>

            <div className="p-6">
              <p className="text-charcoal/50 text-xs uppercase tracking-wide mb-2">
                Поставщик
              </p>
              <h2 className="font-medium text-charcoal mb-2">
                {product.supplier.name}
              </h2>
              {product.supplier.description && (
                <p className="text-charcoal/60 text-sm mb-2">
                  {product.supplier.description}
                </p>
              )}
              {product.supplier.contact_phone && (
                <p className="text-charcoal/60 text-sm">
                  {product.supplier.contact_phone}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductPage