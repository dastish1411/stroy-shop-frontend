import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import api from '../api/axios'

function SupplierProductFormPage() {
  const { id } = useParams()
  const isEditMode = Boolean(id)
  const navigate = useNavigate()

  const [categories, setCategories] = useState([])
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    price: '',
    quantity: '',
    unit: 'kg',
    description: '',
  })
  const [loading, setLoading] = useState(isEditMode)
  const [error, setError] = useState('')

  // загружаем список категорий для выпадающего списка - нужен всегда
  useEffect(() => {
    api.get('/categories/').then((response) => setCategories(response.data))
  }, [])

  // если это режим редактирования - подгружаем текущие данные товара
  useEffect(() => {
    if (!isEditMode) return

    const fetchProduct = async () => {
      try {
        const response = await api.get(`/products/${id}`)
        const product = response.data
        setFormData({
          name: product.name,
          category_id: product.category.id,
          price: product.price,
          quantity: product.quantity,
          unit: product.unit,
          description: product.description || '',
        })
      } catch (err) {
        setError('Не удалось загрузить товар')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, isEditMode])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    const payload = {
      ...formData,
      category_id: Number(formData.category_id),
      price: Number(formData.price),
      quantity: Number(formData.quantity),
    }

    try {
      if (isEditMode) {
        await api.patch(`/supplier/products/${id}`, payload)
      } else {
        await api.post('/supplier/products', payload)
      }
      navigate('/supplier/products')
    } catch (err) {
      const detail = err.response?.data?.detail || 'Ошибка сохранения товара'
      setError(detail)
    }
  }

  if (loading) {
    return <div className="text-center mt-10 text-charcoal/60">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-xl mx-auto px-6 py-10">
        <Link to="/supplier/products" className="text-steel hover:underline mb-6 inline-block">
          ← Мои товары
        </Link>

        <div className="bg-white border border-charcoal/10 rounded-sm p-8">
          <h1 className="font-display text-2xl font-semibold text-charcoal mb-6">
            {isEditMode ? 'Редактировать товар' : 'Новый товар'}
          </h1>

          {error && (
            <p className="text-brick text-sm mb-4 bg-brick/10 p-3 rounded-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Название
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Категория
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
              >
                <option value="">Выберите категорию</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Цена (сом)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-charcoal mb-1">
                  Единица измерения
                </label>
                <select
                  name="unit"
                  value={formData.unit}
                  onChange={handleChange}
                  className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
                >
                  <option value="kg">Килограммы</option>
                  <option value="piece">Штуки</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Количество на складе
              </label>
              <input
                type="number"
                step="0.001"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-charcoal mb-1">
                Описание
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
              />
            </div>

            <button
              type="submit"
              className="bg-amber text-charcoal font-medium py-3 rounded-sm hover:brightness-110 transition mt-2"
            >
              {isEditMode ? 'Сохранить изменения' : 'Добавить товар'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default SupplierProductFormPage