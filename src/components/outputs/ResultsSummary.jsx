import React from 'react'
import { useCalculations } from '../../hooks/useCalculations'
import { useCalculator } from '../../context/CalculatorContext'
import { formatCurrency, formatPercent, formatYears } from '../../utils/formatters'
import Card from '../ui/Card'

export default function ResultsSummary() {
  const { state } = useCalculator()
  const { saleScenario, goalProgress, projection, portfolioTotals, targetYears } = useCalculations()

  if (!saleScenario || !goalProgress || state.properties.length === 0) {
    return (
      <Card title="Retirement Scenario">
        <div className="text-center py-12 text-gray-500">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          <p className="text-lg font-medium">Enter Your Portfolio Details</p>
          <p className="mt-1">Add properties and set your goals to see your retirement projection</p>
        </div>
      </Card>
    )
  }

  const finalYear = projection[projection.length - 1]

  return (
    <div className="space-y-6">
      {/* Hero Result */}
      <Card className={goalProgress.goalAchieved ? 'border-green-200 bg-gradient-to-br from-green-50 to-emerald-50' : 'border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50'}>
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${
            goalProgress.goalAchieved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
          }`}>
            {goalProgress.goalAchieved ? 'Goal Achievable' : 'Adjustments Needed'}
          </div>

          <h2 className="text-4xl font-bold text-gray-900 mb-2">
            {formatCurrency(goalProgress.projectedMonthlyIncome)}
            <span className="text-lg font-normal text-gray-500">/month</span>
          </h2>

          <p className="text-gray-600">
            Projected passive income in {formatYears(targetYears)}
          </p>
        </div>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-primary-600">
              {saleScenario.debtFreeProperties.length}
            </p>
            <p className="text-sm text-gray-500 mt-1">Debt-Free Properties</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(saleScenario.totalAnnualIncome, true)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Annual Rental Income</p>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <p className="text-3xl font-bold text-purple-600">
              {formatCurrency(finalYear?.totals.totalValue || 0, true)}
            </p>
            <p className="text-sm text-gray-500 mt-1">Final Portfolio Value</p>
          </div>
        </Card>
      </div>

      {/* Journey Summary */}
      <Card title="Your Investment Journey">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-500">Starting Portfolio</p>
            <p className="text-lg font-semibold text-gray-900">
              {state.properties.length} properties
            </p>
            <p className="text-sm text-gray-400">
              {formatCurrency(portfolioTotals.totalValue, true)} value
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Properties Acquired</p>
            <p className="text-lg font-semibold text-gray-900">
              +{(finalYear?.properties.length || 0) - state.properties.length}
            </p>
            <p className="text-sm text-gray-400">
              Over {targetYears} years
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Properties Sold</p>
            <p className="text-lg font-semibold text-gray-900">
              {saleScenario.summary.propertiesSold}
            </p>
            <p className="text-sm text-gray-400">
              {formatCurrency(saleScenario.summary.totalSaleProceeds, true)} proceeds
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Debt Cleared</p>
            <p className="text-lg font-semibold text-green-600">
              {formatCurrency(saleScenario.summary.debtCleared, true)}
            </p>
            <p className="text-sm text-gray-400">
              100% debt-free
            </p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h4 className="font-medium text-gray-900 mb-3">Tax Considerations</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
            <p className="mb-2">
              <span className="font-medium">Gross Annual Rent:</span>{' '}
              {formatCurrency(saleScenario.totalAnnualIncome)}
            </p>
            <p className="mb-2">
              <span className="font-medium">Estimated Tax ({formatPercent(state.assumptions.taxBracket)}):</span>{' '}
              {formatCurrency(saleScenario.totalAnnualIncome * state.assumptions.taxBracket)}
            </p>
            <p>
              <span className="font-medium">After-Tax Annual Income:</span>{' '}
              <span className="text-green-600 font-semibold">{formatCurrency(saleScenario.afterTaxIncome)}</span>
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
