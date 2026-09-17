import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/axios'

function CatalogPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [search, setSearch] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [minQuantity, setMinQuantity] = useState('')

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/products')
        setProducts(response.data)
      } catch (err) {
        setError('Не удалось загрузить товары')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // useMemo - пересчитывает отфильтрованный список ТОЛЬКО когда
  // изменились сами товары или один из фильтров, а не при каждой перерисовке
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())

      const matchesMinPrice = minPrice === '' || product.price >= Number(minPrice)
      const matchesMaxPrice = maxPrice === '' || product.price <= Number(maxPrice)
      const matchesMinQuantity =
        minQuantity === '' || product.quantity >= Number(minQuantity)

      return matchesSearch && matchesMinPrice && matchesMaxPrice && matchesMinQuantity
    })
  }, [products, search, minPrice, maxPrice, minQuantity])

  const resetFilters = () => {
    setSearch('')
    setMinPrice('')
    setMaxPrice('')
    setMinQuantity('')
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
        <div className="mb-8 border-b border-charcoal/15 pb-6">
          <h1 className="font-display text-4xl font-semibold text-charcoal">
            Каталог товаров
          </h1>
          <p className="text-charcoal/60 mt-2">
            Стройматериалы от проверенных поставщиков
          </p>
        </div>

        {/* Панель поиска и фильтров */}
        <div className="bg-white border border-charcoal/10 rounded-sm p-5 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <input
              type="text"
              placeholder="Поиск по названию..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="md:col-span-2 border border-charcoal/20 rounded-sm px-3 py-2 focus:outline-none focus:border-steel"
            />
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
          </div>

          {(search || minPrice || maxPrice || minQuantity) && (
            <button
              onClick={resetFilters}
              className="mt-3 text-steel text-sm hover:underline"
            >
              Сбросить фильтры
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="group bg-white border border-charcoal/10 rounded-sm overflow-hidden flex flex-col hover:border-charcoal/30 transition-colors"
            >
              <div className="relative">
                <img
                  src={product.category.image_url}
                  alt={product.category.name}
                  className="w-full h-64 object-cover"
                />
                <span className="absolute top-2 left-2 bg-amber text-charcoal text-xs font-medium px-2 py-1 rounded-sm">
                  {product.price} сом / {product.unit === 'kg' ? 'кг' : 'шт'}
                </span>
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h2 className="font-medium text-charcoal mb-1 group-hover:text-steel transition-colors">
                  {product.name}
                </h2>
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
              ? 'Товаров пока нет.'
              : 'По заданным фильтрам ничего не найдено.'}
          </p>
        )}
      </div>
    </div>
  )
}

export default CatalogPage