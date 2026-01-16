import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
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

export default function TimelineChart() {
  const { timelineData, projection } = useCalculations()

  if (!timelineData || timelineData.length === 0) {
    return (
      <Card title="Portfolio Growth Timeline">
        <div className="h-64 flex items-center justify-center text-gray-500">
          Add properties to see your portfolio projection
        </div>
      </Card>
    )
  }

  // Find years with property purchases
  const purchaseYears = projection
    .filter(y => y.events.propertiesPurchased > 0)
    .map(y => y.year)

  return (
    <Card
      title="Portfolio Growth Timeline"
      subtitle={`${timelineData.length - 1} year projection`}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={timelineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorEquity" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDebt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
              </linearGradient>
            </defs>
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
              wrapperStyle={{ paddingTop: '20px' }}
              formatter={(value) => <span className="text-sm text-gray-600">{value}</span>}
            />
            <Area
              type="monotone"
              dataKey="portfolioValue"
              name="Portfolio Value"
              stroke="#3b82f6"
              strokeWidth={2}
              fill="url(#colorValue)"
            />
            <Area
              type="monotone"
              dataKey="equity"
              name="Equity"
              stroke="#22c55e"
              strokeWidth={2}
              fill="url(#colorEquity)"
            />
            <Area
              type="monotone"
              dataKey="debt"
              name="Debt"
              stroke="#ef4444"
              strokeWidth={2}
              fill="url(#colorDebt)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {purchaseYears.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            <span className="font-medium">Purchase opportunities:</span>{' '}
            Years {purchaseYears.join(', ')}
          </p>
        </div>
      )}
    </Card>
  )
}
