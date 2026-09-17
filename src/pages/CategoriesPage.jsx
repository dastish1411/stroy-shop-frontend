import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function CategoriesPage() {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
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

    fetchCategories()
  }, [])

  if (loading) {
    return <div className="text-center mt-10 text-charcoal/60">Загрузка...</div>
  }

  if (error) {
    return <div className="text-center mt-10 text-brick">{error}</div>
  }

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-charcoal/15 pb-6">
          <h1 className="font-display text-4xl font-semibold text-charcoal">
            Каталог
          </h1>
          <p className="text-charcoal/60 mt-2">
            Выберите категорию стройматериалов
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/categories/${category.id}`}
              className="group bg-white border border-charcoal/10 rounded-sm overflow-hidden flex flex-col hover:border-charcoal/30 transition-colors"
            >
              <img
                src={category.image_url}
                alt={category.name}
                className="w-full h-64 object-cover"
              />
              <div className="p-5">
                <h2 className="font-display text-xl font-semibold text-charcoal group-hover:text-steel transition-colors">
                  {category.name}
                </h2>
              </div>
            </Link>
          ))}
        </div>

        {categories.length === 0 && (
          <p className="text-charcoal/50 mt-4">Категорий пока нет.</p>
        )}
      </div>
    </div>
  )
}

export default CategoriesPage