import { useState, useEffect } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import api from '../api/axios'

// набор цветов для линий разных поставщиков - циклически используем по очереди
const lineColors = ['#E2A83A', '#46586B', '#A83C2E', '#4A7C59', '#7B5EA7']

function AdminDashboardPage() {
  const [summary, setSummary] = useState(null)
  const [chartData, setChartData] = useState([])
  const [supplierNames, setSupplierNames] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, monthlyRes] = await Promise.all([
          api.get('/admin/summary'),
          api.get('/admin/monthly-sales'),
        ])

        setSummary(summaryRes.data)

        // превращаем плоский список [{month, supplier_name, total}, ...]
        // в формат, удобный для recharts: [{month: "2026-01", "СтройМир": 5000, "БазаКровля": 3000}, ...]
        const grouped = {}
        const names = new Set()

        monthlyRes.data.forEach((row) => {
          if (!grouped[row.month]) {
            grouped[row.month] = { month: row.month }
          }
          grouped[row.month][row.supplier_name] = row.total
          names.add(row.supplier_name)
        })

        setChartData(Object.values(grouped))
        setSupplierNames(Array.from(names))
      } catch (err) {
        setError('Не удалось загрузить данные')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
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
            Панель администратора
          </h1>
        </div>

        {/* Карточки со сводкой */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white border border-charcoal/10 rounded-sm p-4">
            <p className="text-charcoal/50 text-sm">Клиенты</p>
            <p className="text-2xl font-semibold text-charcoal">{summary.total_clients}</p>
          </div>
          <div className="bg-white border border-charcoal/10 rounded-sm p-4">
            <p className="text-charcoal/50 text-sm">Поставщики</p>
            <p className="text-2xl font-semibold text-charcoal">{summary.total_suppliers}</p>
          </div>
          <div className="bg-white border border-charcoal/10 rounded-sm p-4">
            <p className="text-charcoal/50 text-sm">Товары</p>
            <p className="text-2xl font-semibold text-charcoal">{summary.total_products}</p>
          </div>
          <div className="bg-white border border-charcoal/10 rounded-sm p-4">
            <p className="text-charcoal/50 text-sm">Заказы</p>
            <p className="text-2xl font-semibold text-charcoal">{summary.total_orders}</p>
          </div>
          <div className="bg-charcoal rounded-sm p-4">
            <p className="text-concrete/60 text-sm">Общая выручка</p>
            <p className="text-2xl font-semibold text-white">{summary.total_revenue} сом</p>
          </div>
        </div>

        {/* График продаж по месяцам */}
        <div className="bg-white border border-charcoal/10 rounded-sm p-6">
          <h2 className="font-medium text-charcoal mb-4">Продажи по месяцам</h2>

          {chartData.length === 0 ? (
            <p className="text-charcoal/50">Пока недостаточно данных для графика.</p>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E1C1A1A" />
                <XAxis dataKey="month" stroke="#1E1C1A99" />
                <YAxis stroke="#1E1C1A99" />
                <Tooltip />
                <Legend />
                {supplierNames.map((name, index) => (
                  <Line
                    key={name}
                    type="monotone"
                    dataKey={name}
                    stroke={lineColors[index % lineColors.length]}
                    strokeWidth={2}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminDashboardPage