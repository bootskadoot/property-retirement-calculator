import React from 'react'
import { StatCard } from '../ui/Card'
import { useCalculations } from '../../hooks/useCalculations'
import { useCalculator } from '../../context/CalculatorContext'
import { formatCurrency, formatPercent, formatPropertyCount } from '../../utils/formatters'
import { calculateExtractableEquity } from '../../utils/calculations'

export default function PortfolioSummary() {
  const { state } = useCalculator()
  const { portfolioTotals, overallLVR, assumptions } = useCalculations()

  if (portfolioTotals.propertyCount === 0) {
    return null
  }

  // Calculate usable equity (extractable for refinancing)
  const usableEquity = state.properties.reduce((sum, p) => {
    return sum + calculateExtractableEquity(p.currentValue, p.loanAmount, assumptions.maxLVR)
  }, 0)

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        label="Portfolio Value"
        value={formatCurrency(portfolioTotals.totalValue, true)}
        subValue={formatPropertyCount(portfolioTotals.propertyCount)}
        color="blue"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        }
      />

      <StatCard
        label="Total Equity"
        value={formatCurrency(portfolioTotals.totalEquity, true)}
        subValue={`${formatPercent(portfolioTotals.totalEquity / portfolioTotals.totalValue)} of portfolio`}
        trend="up"
        color="green"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        }
      />

      <StatCard
        label="Total Debt"
        value={formatCurrency(portfolioTotals.totalDebt, true)}
        subValue={`LVR: ${formatPercent(overallLVR)}`}
        trend={overallLVR > 0.7 ? 'down' : 'neutral'}
        color={overallLVR > 0.8 ? 'red' : overallLVR > 0.7 ? 'orange' : 'purple'}
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
        }
      />

      <StatCard
        label="Usable Equity"
        value={formatCurrency(usableEquity, true)}
        subValue="Available to refinance"
        color="purple"
        icon={
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        }
      />
    </div>
  )
}
