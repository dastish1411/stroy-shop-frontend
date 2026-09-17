import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import api from '../api/axios'

const statusLabels = {
  pending_payment: 'Ожидает оплаты',
}

function CartPage() {
  const { items, removeFromCart, clearCart } = useCart()
  const [error, setError] = useState('')
  const [orderResult, setOrderResult] = useState(null)
  const navigate = useNavigate()

  const totalAmount = items.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )

  const handleCheckout = async () => {
    setError('')

    const orderData = {
      items: items.map((item) => ({
        product_id: item.product.id,
        quantity: item.quantity,
      })),
    }

    try {
      const response = await api.post('/orders/', orderData)
      setOrderResult(response.data)
      clearCart()
    } catch (err) {
      const detail = err.response?.data?.detail || 'Ошибка оформления заказа'
      setError(detail)
    }
  }

  if (orderResult) {
    return (
      <div className="min-h-screen bg-concrete">
        <div className="max-w-2xl mx-auto px-6 py-10">
          <div className="bg-white border border-charcoal/10 rounded-sm p-8">
            <h1 className="font-display text-2xl font-semibold text-charcoal mb-2">
              Заказ оформлен
            </h1>
            <p className="text-charcoal/60 mb-6">
              Ваш заказ разбит на {orderResult.sub_orders.length}{' '}
              под-заказ(а/ов) по количеству поставщиков. Оплатите каждый
              отдельно в разделе «Мои заказы».
            </p>

            <div className="border border-charcoal/10 rounded-sm">
              {orderResult.sub_orders.map((subOrder, index) => (
                <div
                  key={subOrder.id}
                  className={`flex justify-between items-center p-4 ${
                    index !== orderResult.sub_orders.length - 1
                      ? 'border-b border-charcoal/10'
                      : ''
                  }`}
                >
                  <div>
                    <p className="font-medium text-charcoal">
                      Заказ #{subOrder.id}
                    </p>
                    <p className="text-charcoal/50 text-sm">
                      {subOrder.amount} сом
                    </p>
                  </div>
                  <span className="text-xs bg-amber/20 text-amber px-2 py-1 rounded-sm">
                    {statusLabels[subOrder.status] || subOrder.status}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex gap-4 mt-6">
              <Link
                to="/orders"
                className="bg-amber text-charcoal font-medium px-5 py-2 rounded-sm hover:brightness-110 transition"
              >
                Перейти к оплате
              </Link>
              <Link to="/" className="text-steel hover:underline self-center">
                Вернуться в каталог
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-charcoal/15 pb-6">
          <h1 className="font-display text-4xl font-semibold text-charcoal">
            Корзина
          </h1>
        </div>

        {error && (
          <p className="text-brick text-sm mb-4 bg-brick/10 p-3 rounded-sm">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <p className="text-charcoal/50">
            Корзина пуста.{' '}
            <Link to="/" className="text-steel hover:underline">
              Перейти в каталог
            </Link>
          </p>
        ) : (
          <>
            <div className="bg-white border border-charcoal/10 rounded-sm">
              {items.map((item, index) => (
                <div
                  key={item.product.id}
                  className={`flex justify-between items-center p-5 ${
                    index !== items.length - 1 ? 'border-b border-charcoal/10' : ''
                  }`}
                >
                  <div>
                    <p className="font-medium text-charcoal">{item.product.name}</p>
                    <p className="text-charcoal/50 text-sm">
                      {item.quantity} {item.product.unit === 'kg' ? 'кг' : 'шт'} ×{' '}
                      {item.product.price} сом ={' '}
                      {item.quantity * item.product.price} сом
                    </p>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-brick hover:underline text-sm"
                  >
                    Убрать
                  </button>
                </div>
              ))}
            </div>

            <div className="bg-white border border-charcoal/10 rounded-sm p-5 mt-4 flex justify-between items-center">
              <p className="text-xl font-semibold text-charcoal">
                Итого: {totalAmount} сом
              </p>
              <button
                onClick={handleCheckout}
                className="bg-amber text-charcoal font-medium px-6 py-3 rounded-sm hover:brightness-110 transition"
              >
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default CartPage