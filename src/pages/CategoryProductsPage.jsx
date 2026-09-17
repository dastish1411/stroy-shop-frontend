import { useState, useEffect, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import api from '../api/axios'

function CategoryProductsPage() {
  const { categoryId } = useParams()

  const [products, setProducts] = useState([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minQuantity, setMinQuantity] = useState('')
  const [sortBy, setSortBy] = useState('default')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get('/products', {
          params: { category_id: categoryId },
        })
        setProducts(response.data)
        if (response.data.length > 0) {
          setCategoryName(response.data[0].category.name)
        }
      } catch (err) {
        setError('Не удалось загрузить товары')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [categoryId])

  const filteredProducts = useMemo(() => {
    let result = products.filter((product) => {
      const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice)
      const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice)
      const matchesMinQuantity =
        minQuantity === '' || product.quantity >= Number(minQuantity)

      return matchesMinPrice && matchesMaxPrice && matchesMinQuantity
    })

    // sort() изменяет массив "на месте", поэтому делаем копию через [...result],
    // чтобы не мутировать исходные данные напрямую
    switch (sortBy) {
      case 'price_asc':
        result = [...result].sort((a, b) => a.price - b.price)
        break
      case 'price_desc':
        result = [...result].sort((a, b) => b.price - a.price)
        break
      case 'quantity_asc':
        result = [...result].sort((a, b) => a.quantity - b.quantity)
        break
      case 'quantity_desc':
        result = [...result].sort((a, b) => b.quantity - a.quantity)
        break
      default:
        break
    }

    return result
  }, [products, minPrice, maxPrice, minQuantity, sortBy])

  const resetFilters = () => {
    setMinPrice('')
    setMaxPrice('')
    setMinQuantity('')
    setSortBy('default')
  }

  if (loading) {
    return <div className="text-center mt-10 text-charcoal/60">Загрузка...</div>
  }

  if (error) {
    return <div className="text-center mt-10 text-brick">{error}</div>
  }

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <Link to="/" className="text-steel hover:underline mb-4 inline-block">
          ← Все категории
        </Link>

        <div className="mb-8 border-b border-charcoal/15 pb-6">
          <h1 className="font-display text-4xl font-semibold text-charcoal">
            {categoryName || 'Товары'}
          </h1>
          <p className="text-charcoal/60 mt-2">
            Сравните предложения разных поставщиков
          </p>
        </div>

        <div className="bg-white border border-charcoal/10 rounded-sm p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="number"
              placeholder="Цена от"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              className="border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            />
            <input
              type="number"
              placeholder="Цена до"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            />
            <input
              type="number"
              placeholder="Мин. остаток"
              value={minQuantity}
              onChange={(e) => setMinQuantity(e.target.value)}
              className="border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            >
              <option value="default">Без сортировки</option>
              <option value="price_asc">Цена: сначала дешевле</option>
              <option value="price_desc">Цена: сначала дороже</option>
              <option value="quantity_desc">Остаток: сначала больше</option>
              <option value="quantity_asc">Остаток: сначала меньше</option>
            </select>
          </div>

          {(minPrice || maxPrice || minQuantity || sortBy !== 'default') && (
            <button
              onClick={resetFilters}
              className="mt-3 text-steel text-sm hover:underline"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        <div className="bg-white border border-charcoal/10 rounded-sm">
          {filteredProducts.map((product, index) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className={`flex justify-between items-center p-5 hover:bg-concrete/50 transition-colors ${
                index !== filteredProducts.length - 1 ? 'border-b border-charcoal/10' : ''
              }`}
            >
              <div>
                <h2 className="font-medium text-charcoal">{product.name}</h2>
                <p className="text-charcoal/50 text-sm">{product.supplier.name}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-charcoal">
                  {product.price} сом / {product.unit === 'kg' ? 'кг' : 'шт'}
                </p>
                <p className="text-charcoal/50 text-sm">
                  В наличии: {product.quantity}{' '}
                  {product.unit === 'kg' ? 'кг' : 'шт'}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-charcoal/50 mt-4">
            {products.length === 0
              ? 'В этой категории пока нет товаров.'
              : 'По заданным фильтрам ничего не найдено.'}
          </p>
        )}
      </div>
    </div>
  )
}

export default CategoryProductsPage