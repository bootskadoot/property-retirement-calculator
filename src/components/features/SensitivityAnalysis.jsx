import React, { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'
import { useCalculations } from '../../hooks/useCalculations'
import { useCalculator } from '../../context/CalculatorContext'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { generateProjection, calculateStrategicSaleScenario } from '../../utils/calculations'
import Card from '../ui/Card'

const VARIABLES = [
  { key: 'appreciationRate', label: 'Appreciation Rate', min: 0.02, max: 0.08, step: 0.005, format: formatPercent },
  { key: 'rentalYield', label: 'Rental Yield', min: 0.03, max: 0.06, step: 0.005, format: formatPercent },
  { key: 'interestRate', label: 'Interest Rate', min: 0.05, max: 0.09, step: 0.005, format: formatPercent },
]

export default function SensitivityAnalysis() {
  const { state } = useCalculator()
  const { monthlyIncomeGoal, annualIncomeGoal, assumptions, targetYears } = useCalculations()
  const [selectedVariable, setSelectedVariable] = useState('appreciationRate')

  const sensitivityData = useMemo(() => {
    // Allow analysis with cash-only (no properties)
    if (state.properties.length === 0 && state.cashAllocated === 0) return []

    const variable = VARIABLES.find(v => v.key === selectedVariable)
    if (!variable) return []

    const results = []

    for (let value = variable.min; value <= variable.max; value += variable.step) {
      const modifiedAssumptions = {
        ...assumptions,
        [selectedVariable]: value
      }

      const propertiesWithDefaults = state.properties.map(p => ({
        ...p,
        purchasePrice: p.purchasePrice || p.currentValue,
        currentValue: p.currentValue || 0,
        loanAmount: p.loanAmount || 0
      }))

      try {
        const projection = generateProjection(
          propertiesWithDefaults,
          state.cashAllocated,
          modifiedAssumptions,
          targetYears
        )

        const scenario = calculateStrategicSaleScenario(projection, monthlyIncomeGoal, modifiedAssumptions)

        results.push({
          value,
          displayValue: variable.format(value),
          monthlyIncome: scenario.monthlyIncome,
          goalAchieved: scenario.goalAchieved,
          propertiesKept: scenario.debtFreeProperties.length
        })
      } catch (error) {
        console.error('Error calculating sensitivity:', error)
      }
    }

    return results
  }, [state.properties, state.cashAllocated, assumptions, targetYears, monthlyIncomeGoal, selectedVariable])

  const currentVariable = VARIABLES.find(v => v.key === selectedVariable)
  const currentValue = assumptions[selectedVariable]

  // Show empty state only if no properties AND no cash
  if (state.properties.length === 0 && state.cashAllocated === 0) {
    return (
      <Card title="Sensitivity Analysis">
        <div className="py-8 text-center text-gray-500">
          Add properties or cash to invest to see how different assumptions affect your results
        </div>
      </Card>
    )
  }

  return (
    <Card
      title="Sensitivity Analysis"
      subtitle="See how changes in assumptions affect your outcome"
    >
      <div className="mb-6">
        <label className="input-label">Select Variable to Analyze</label>
        <div className="flex flex-wrap gap-2">
          {VARIABLES.map(variable => (
            <button
              key={variable.key}
              type="button"
              onClick={() => setSelectedVariable(variable.key)}
              className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                selectedVariable === variable.key
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {variable.label}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={sensitivityData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis
              dataKey="displayValue"
              tick={{ fontSize: 11, fill: '#6b7280' }}
              interval="preserveStartEnd"
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickFormatter={(value) => formatCurrency(value, true)}
              width={65}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null
                const data = payload[0].payload
                return (
                  <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
                    <p className="font-medium text-gray-900 mb-1">
                      {currentVariable?.label}: {data.displayValue}
                    </p>
                    <p className="text-sm">
                      Monthly Income: <span className="font-medium">{formatCurrency(data.monthlyIncome)}</span>
                    </p>
                    <p className="text-sm">
                      Properties Kept: <span className="font-medium">{data.propertiesKept}</span>
                    </p>
                    <p className={`text-sm font-medium ${data.goalAchieved ? 'text-green-600' : 'text-amber-600'}`}>
                      {data.goalAchieved ? 'Goal Achieved' : 'Below Target'}
                    </p>
                  </div>
                )
              }}
            />
            <ReferenceLine
              y={monthlyIncomeGoal}
              stroke="#ef4444"
              strokeDasharray="5 5"
              label={{ value: 'Target', position: 'right', fill: '#ef4444', fontSize: 11 }}
            />
            <ReferenceLine
              x={currentVariable?.format(currentValue)}
              stroke="#6b7280"
              strokeDasharray="3 3"
            />
            <Line
              type="monotone"
              dataKey="monthlyIncome"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 6, fill: '#3b82f6' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm text-gray-600">
        <p>
          <span className="font-medium">Current {currentVariable?.label}:</span>{' '}
          {currentVariable?.format(currentValue)}
        </p>
        <p className="mt-1 text-gray-500">
          The red dashed line shows your target income of {formatCurrency(monthlyIncomeGoal)}/month.
          The gray line marks your current assumption.
        </p>
      </div>
    </Card>
  )
}
