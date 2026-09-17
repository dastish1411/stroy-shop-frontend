import { useState, useEffect } from 'react'
import api from '../api/axios'

const statusLabels = {
  pending_payment: 'Ожидает оплаты клиента',
  paid: 'Оплачен',
  processing: 'В сборке',
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

const nextAction = {
  paid: { label: 'Взять в сборку', nextStatus: 'processing' },
  processing: { label: 'Отправить', nextStatus: 'shipped' },
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

function SupplierOrdersPage() {
  const [subOrders, setSubOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/supplier/orders')
      setSubOrders(response.data)
    } catch (err) {
      setError('Не удалось загрузить заказы')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const handleChangeStatus = async (subOrderId, newStatus) => {
    setActionError('')
    try {
      await api.patch(`/orders/supplier/orders/${subOrderId}/status`, {
        status: newStatus,
      })
      fetchOrders()
    } catch (err) {
      setActionError(err.response?.data?.detail || 'Ошибка смены статуса')
    }
  }

  if (loading) {
    return <div className="text-charcoal/60">Загрузка...</div>
  }

  if (error) {
    return <div className="text-brick">{error}</div>
  }

  const sorted = [...subOrders].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  )

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
        Заказы
      </h2>

      {actionError && (
        <p className="text-brick text-sm mb-4 bg-brick/10 p-3 rounded-sm">
          {actionError}
        </p>
      )}

      {sorted.length === 0 ? (
        <p className="text-charcoal/50">Заказов пока нет.</p>
      ) : (
        <div className="flex flex-col gap-4">
          {sorted.map((subOrder) => {
            const action = nextAction[subOrder.status]

            return (
              <div
                key={subOrder.id}
                className="bg-white border border-charcoal/10 rounded-sm p-5"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-medium text-charcoal">
                      Заказ #{subOrder.id}
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
                      <span>
                        {(item.quantity * item.price_at_purchase).toFixed(2)} сом
                      </span>
                    </p>
                  ))}
                  <p className="font-medium text-charcoal mt-2 flex justify-between">
                    <span>Итого</span>
                    <span>{subOrder.amount} сом</span>
                  </p>
                </div>

                {action && (
                  <button
                    onClick={() => handleChangeStatus(subOrder.id, action.nextStatus)}
                    className="bg-steel text-white font-medium px-4 py-2 rounded-sm hover:brightness-110 transition text-sm"
                  >
                    {action.label}
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SupplierOrdersPage