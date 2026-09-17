import { useState, useEffect } from 'react'
import api from '../api/axios'

const typeLabels = {
  sale: 'Продажа',
  withdrawal: 'Вывод средств',
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

function SupplierFinancePage() {
  const [finance, setFinance] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const response = await api.get('/payments/supplier/finance')
        setFinance(response.data)
      } catch (err) {
        setError('Не удалось загрузить данные')
      } finally {
        setLoading(false)
      }
    }

    fetchFinance()
  }, [])

  if (loading) {
    return <div className="text-charcoal/60">Загрузка...</div>
  }

  if (error) {
    return <div className="text-brick">{error}</div>
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-charcoal mb-6">
        Финансы
      </h2>

      <div className="bg-charcoal text-white rounded-sm p-6 mb-6">
        <p className="text-concrete/60 text-sm mb-1">Текущий баланс</p>
        <p className="font-display text-4xl font-semibold">
          {finance.balance} сом
        </p>
      </div>

      <h3 className="font-medium text-charcoal mb-3">История начислений</h3>

      {finance.transactions.length === 0 ? (
        <p className="text-charcoal/50">Начислений пока нет.</p>
      ) : (
        <div className="bg-white border border-charcoal/10 rounded-sm">
          {finance.transactions.map((tx, index) => (
            <div
              key={tx.id}
              className={`flex justify-between items-center p-4 ${
                index !== finance.transactions.length - 1
                  ? 'border-b border-charcoal/10'
                  : ''
              }`}
            >
              <div>
                <p className="text-charcoal">{typeLabels[tx.type] || tx.type}</p>
                <p className="text-charcoal/50 text-sm">
                  По заказу #{tx.sub_order_id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-green-700 font-medium">+{tx.amount} сом</p>
                <p className="text-charcoal/50 text-sm">
                  Баланс: {tx.balance_after} сом
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SupplierFinancePage