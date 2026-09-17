import { useState, useEffect } from 'react'
import api from '../api/axios'
import PaymentModal from '../components/PaymentModal'

const statusLabels = {
  pending_payment: 'Ожидает оплаты',
  paid: 'Оплачен',
  processing: 'Собирается',
  shipped: 'Отправлен',
  delivered: 'Доставлен',
  cancelled: 'Отменён',
}

const statusColors = {
  pending_payment: 'bg-amber/20 text-amber',
  paid: 'bg-steel/20 text-steel',
  processing: 'bg-steel/20 text-steel',
  shipped: 'bg-steel/20 text-steel',
  delivered: 'bg-green-100 text-green-700',
  cancelled: 'bg-brick/20 text-brick',
}

const formatDate = (isoString) => {
  return new Date(isoString).toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [payingSubOrder, setPayingSubOrder] = useState(null)

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/history')
      setOrders(response.data)
    } catch (err) {
      setError('Не удалось загрузить заказы')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleConfirmPayment = async (method) => {
    setActionError('')
    try {
      await api.post(`/payments/${payingSubOrder.id}`, { method })
      setPayingSubOrder(null)
      fetchOrders()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Ошибка оплаты')
      setPayingSubOrder(null)
    }
  }

  const handleConfirmDelivery = async (subOrderId) => {
    setActionError('')
    try {
      await api.patch(`/orders/${subOrderId}/confirm-delivery`)
      fetchOrders()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Ошибка подтверждения')
    }
  }

  if (loading) {
    return <div className="text-center mt-10 text-charcoal/60">Загрузка...</div>
  }

  if (error) {
    return <div className="text-center mt-10 text-brick">{error}</div>
  }

  const allSubOrders = orders
    .flatMap((order) => order.sub_orders)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

  return (
    <div className="min-h-screen bg-concrete">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="mb-8 border-b border-charcoal/15 pb-6">
          <h1 className="font-display text-4xl font-semibold text-charcoal">
            Мои заказы
          </h1>
        </div>

        {actionError && (
          <p className="text-brick text-sm mb-4 bg-brick/10 p-3 rounded-sm">
            {actionError}
          </p>
        )}

        {allSubOrders.length === 0 ? (
          <p className="text-charcoal/50">У вас пока нет заказов.</p>
        ) : (
          <div className="flex flex-col gap-4">
            {allSubOrders.map((subOrder) => (
              <div
                key={subOrder.id}
                className="bg-white border border-charcoal/10 rounded-sm p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-charcoal">
                      Заказ #{subOrder.id} · {subOrder.supplier.name}
                    </p>
                    <p className="text-charcoal/50 text-sm">
                      {formatDate(subOrder.created_at)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-sm whitespace-nowrap ${statusColors[subOrder.status]}`}
                  >
                    {statusLabels[subOrder.status]}
                  </span>
                </div>

                <div className="text-sm text-charcoal/70 mb-3 border-t border-charcoal/10 pt-3">
                  {subOrder.items.map((item) => (
                    <p key={item.id} className="flex justify-between">
                      <span>
                        {item.product.name} — {item.quantity}{' '}
                        {item.product.unit === 'kg' ? 'кг' : 'шт'}
                      </span>
                      <span>{(item.quantity * item.price_at_purchase).toFixed(2)} сом</span>
                    </p>
                  ))}
                  <p className="font-medium text-charcoal mt-2 flex justify-between">
                    <span>Итого</span>
                    <span>{subOrder.amount} сом</span>
                  </p>
                </div>

                {subOrder.status === 'pending_payment' && (
                  <button
                    onClick={() => setPayingSubOrder(subOrder)}
                    className="bg-amber text-charcoal font-medium px-4 py-2 rounded-sm hover:brightness-110 transition text-sm"
                  >
                    Оплатить
                  </button>
                )}

                {subOrder.status === 'shipped' && (
                  <button
                    onClick={() => handleConfirmDelivery(subOrder.id)}
                    className="bg-steel text-white font-medium px-4 py-2 rounded-sm hover:brightness-110 transition text-sm"
                  >
                    Подтвердить получение
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {payingSubOrder && (
        <PaymentModal
          subOrder={payingSubOrder}
          onClose={() => setPayingSubOrder(null)}
          onConfirm={handleConfirmPayment}
        />
      )}
    </div>
  )
}

export default OrdersPage