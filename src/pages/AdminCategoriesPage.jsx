import { useState, useEffect } from 'react'
import api from '../api/axios'

function AdminCategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({ name: '', image_url: '' })
  const [submitting, setSubmitting] = useState(false)

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories/')
      setCategories(response.data)
    } catch (err) {
      setError('Не удалось загрузить категории')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      await api.post('/categories/', formData)
      setFormData({ name: '', image_url: '' })
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.detail || 'Ошибка создания категории')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (categoryId) => {
    if (!confirm('Удалить эту категорию?')) return

    setError('')
    try {
      await api.delete(`/categories/${categoryId}`)
      fetchCategories()
    } catch (err) {
      setError(err.response?.data?.detail || 'Не удалось удалить категорию')
    }
  }

  if (loading) {
    return <div className="text-center mt-10 text-charcoal/60">Загрузка...</div>
  }

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-charcoal/15 pb-6">
          <h1 className="font-display text-4xl font-semibold text-charcoal">
            Категории
          </h1>
        </div>

        <div className="bg-white border border-charcoal/10 rounded-sm p-6 mb-6">
          <h2 className="font-medium text-charcoal mb-4">Новая категория</h2>

          {error && (
            <p className="text-brick text-sm mb-4 bg-brick/10 p-3 rounded-sm">
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input
              type="text"
              name="name"
              placeholder="Название категории"
              value={formData.name}
              onChange={handleChange}
              required
              className="border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            />
            <input
              type="text"
              name="image_url"
              placeholder="Ссылка на фото"
              value={formData.image_url}
              onChange={handleChange}
              required
              className="border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            />
            <button
              type="submit"
              disabled={submitting}
              className="bg-amber text-charcoal font-medium py-2 rounded-sm hover:brightness-110 transition disabled:opacity-50 self-start px-6"
            >
              {submitting ? 'Создание...' : 'Добавить категорию'}
            </button>
          </form>
        </div>

        <div className="bg-white border border-charcoal/10 rounded-sm">
          {categories.map((category, index) => (
            <div
              key={category.id}
              className={`flex items-center justify-between gap-4 p-4 ${
                index !== categories.length - 1 ? 'border-b border-charcoal/10' : ''
              }`}
            >
              <div className="flex items-center gap-4">
                <img
                  src={category.image_url}
                  alt={category.name}
                  className="w-16 h-16 object-cover rounded-sm"
                />
                <p className="font-medium text-charcoal">{category.name}</p>
              </div>
              <button
                onClick={() => handleDelete(category.id)}
                className="text-brick hover:underline text-sm"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default AdminCategoriesPage