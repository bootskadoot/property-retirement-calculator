import React from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ReferenceLine
} from 'recharts'
import { useCalculations } from '../../hooks/useCalculations'
import { formatCurrency } from '../../utils/formatters'
import Card from '../ui/Card'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null

  return (
    <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
      <p className="font-medium text-gray-900 mb-2">Year {label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex justify-between gap-4 text-sm">
          <span style={{ color: entry.color }}>{entry.name}:</span>
          <span className="font-medium">{formatCurrency(entry.value)}</span>
        </div>
      ))}
    </div>
  )
}

export default function CashFlowChart() {
  const { cashFlowData } = useCalculations()

  if (!cashFlowData || cashFlowData.length === 0) {
    return (
      <Card title="Annual Cash Flow">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Add properties to see cash flow projections
        </div>
      </Card>
    )
  }

  const totalNetCashFlow = cashFlowData.reduce((sum, year) => sum + year.netCashFlow, 0)
  const avgNetCashFlow = totalNetCashFlow / cashFlowData.length

  return (
    <Card
      title="Annual Cash Flow"
      subtitle="Rental income vs. interest payments"
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={cashFlowData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="year"
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => `Y${value}`}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#6b7280' }}
              tickFormatter={(value) => formatCurrency(value, true)}
              width={70}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
            <ReferenceLine y={0} stroke="#94a3b8" />
            <Bar
              dataKey="rentalIncome"
              name="Rental Income"
              fill="#22c55e"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="interestPayments"
              name="Interest Payments"
              fill="#ef4444"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-gray-500">Average Annual Net Cash Flow</p>
          <p className={`text-lg font-semibold ${avgNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(avgNetCashFlow)}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Total Net Cash Flow</p>
          <p className={`text-lg font-semibold ${totalNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(totalNetCashFlow)}
          </p>
        </div>
      </div>
    </Card>
  )
}
