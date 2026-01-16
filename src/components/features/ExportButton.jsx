import React, { useState } from 'react'
import { useCalculator } from '../../context/CalculatorContext'
import { useCalculations } from '../../hooks/useCalculations'
import { formatCurrency, formatPercent, formatYears } from '../../utils/formatters'

export default function ExportButton() {
  const { state } = useCalculator()
  const { saleScenario, goalProgress, portfolioTotals, targetYears, projection, annualIncomeGoal } = useCalculations()
  const [isExporting, setIsExporting] = useState(false)

  const generateReport = () => {
    if (!saleScenario || !goalProgress) return ''

    const lines = [
      '═══════════════════════════════════════════════════════════════',
      '           PROPERTY PORTFOLIO RETIREMENT CALCULATOR',
      '                    Strategy Report',
      '═══════════════════════════════════════════════════════════════',
      '',
      `Generated: ${new Date().toLocaleDateString('en-AU', { dateStyle: 'full' })}`,
      '',
      '───────────────────────────────────────────────────────────────',
      '                    CURRENT PORTFOLIO',
      '───────────────────────────────────────────────────────────────',
      '',
      `Properties: ${state.properties.length}`,
      `Total Value: ${formatCurrency(portfolioTotals.totalValue)}`,
      `Total Equity: ${formatCurrency(portfolioTotals.totalEquity)}`,
      `Total Debt: ${formatCurrency(portfolioTotals.totalDebt)}`,
      `Overall LVR: ${formatPercent(portfolioTotals.totalDebt / portfolioTotals.totalValue)}`,
      '',
      'Properties:',
      ...state.properties.map((p, i) =>
        `  ${i + 1}. ${p.name || 'Unnamed'}: ${formatCurrency(p.currentValue)} (Equity: ${formatCurrency(p.currentValue - p.loanAmount)})`
      ),
      '',
      '───────────────────────────────────────────────────────────────',
      '                    GOALS & ASSUMPTIONS',
      '───────────────────────────────────────────────────────────────',
      '',
      `Target Annual Income: ${formatCurrency(annualIncomeGoal)}`,
      `Target Monthly Income: ${formatCurrency(annualIncomeGoal / 12)}`,
      `Timeline: ${formatYears(targetYears)}`,
      `Cash Allocated: ${formatCurrency(state.cashAllocated)}`,
      '',
      'Assumptions:',
      `  - Appreciation Rate: ${formatPercent(state.assumptions.appreciationRate)}`,
      `  - Rental Yield: ${formatPercent(state.assumptions.rentalYield)}`,
      `  - Interest Rate: ${formatPercent(state.assumptions.interestRate)}`,
      `  - Max LVR: ${formatPercent(state.assumptions.maxLVR)}`,
      `  - Tax Bracket: ${formatPercent(state.assumptions.taxBracket)}`,
      '',
      '───────────────────────────────────────────────────────────────',
      '                    PROJECTED RESULTS',
      '───────────────────────────────────────────────────────────────',
      '',
      goalProgress.goalAchieved
        ? '*** GOAL ACHIEVABLE ***'
        : '*** ADJUSTMENTS NEEDED ***',
      '',
      `Projected Annual Income: ${formatCurrency(goalProgress.projectedAnnualIncome)}`,
      `Target Annual Income: ${formatCurrency(goalProgress.targetAnnualIncome)}`,
      goalProgress.goalAchieved
        ? `Surplus: ${formatCurrency(goalProgress.surplusAnnual)}/year`
        : `Shortfall: ${formatCurrency(goalProgress.shortfallAnnual)}/year`,
      '',
      `Debt-Free Properties: ${saleScenario.debtFreeProperties.length}`,
      `Properties Sold: ${saleScenario.summary.propertiesSold}`,
      `Annual Rental Income: ${formatCurrency(saleScenario.totalAnnualIncome)}`,
      `After-Tax Annual Income: ${formatCurrency(saleScenario.afterTaxIncome)}`,
      '',
      '───────────────────────────────────────────────────────────────',
      '                    STRATEGIC SALE PLAN',
      '───────────────────────────────────────────────────────────────',
      '',
      'Properties to Sell:',
      ...saleScenario.propertiesToSell.map((p, i) =>
        `  ${i + 1}. ${p.name || 'Unnamed'}: ${formatCurrency(p.currentValue)} (Net: ${formatCurrency(p.currentValue - p.loanAmount)})`
      ),
      '',
      'Debt-Free Portfolio:',
      ...saleScenario.debtFreeProperties.map((p, i) =>
        `  ${i + 1}. ${p.name || 'Unnamed'}: ${formatCurrency(p.currentValue)} (Rent: ${formatCurrency(p.annualRent)}/year)`
      ),
      '',
      '───────────────────────────────────────────────────────────────',
      '                    YEAR-BY-YEAR PROJECTION',
      '───────────────────────────────────────────────────────────────',
      '',
      'Year | Properties | Portfolio Value | Equity | New Purchases',
      '─────┼────────────┼─────────────────┼─────────────────┼──────────────',
      ...projection.map(y =>
        `  ${String(y.year).padStart(2)} |     ${String(y.properties.length).padStart(2)}     | ${formatCurrency(y.totals.totalValue).padStart(14)} | ${formatCurrency(y.totals.totalEquity).padStart(14)} | ${y.events.propertiesPurchased > 0 ? `+${y.events.propertiesPurchased}` : '-'}`
      ),
      '',
      '═══════════════════════════════════════════════════════════════',
      '                        DISCLAIMER',
      '═══════════════════════════════════════════════════════════════',
      '',
      'This report is for illustration and planning purposes only.',
      'Actual results will vary based on market conditions, interest',
      'rates, and personal circumstances. Please consult with qualified',
      'financial advisors and accountants before making investment',
      'decisions. Past property performance does not guarantee future',
      'results.',
      '',
      '═══════════════════════════════════════════════════════════════',
    ]

    return lines.join('\n')
  }

  const handleExportText = () => {
    const report = generateReport()
    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `property-strategy-report-${new Date().toISOString().split('T')[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleExportJSON = () => {
    const data = {
      exportDate: new Date().toISOString(),
      portfolio: state.properties,
      cashPosition: {
        reserves: state.cashReserves,
        allocated: state.cashAllocated
      },
      goals: {
        annualIncome: annualIncomeGoal,
        timelineYears: targetYears
      },
      assumptions: state.assumptions,
      results: {
        goalAchieved: goalProgress?.goalAchieved,
        projectedAnnualIncome: goalProgress?.projectedAnnualIncome,
        debtFreeProperties: saleScenario?.debtFreeProperties.length,
        propertiesToSell: saleScenario?.summary.propertiesSold
      }
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `property-strategy-data-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopyLink = async () => {
    const shareData = {
      p: state.properties.map(p => ({
        n: p.name,
        v: p.currentValue,
        l: p.loanAmount
      })),
      c: state.cashAllocated,
      g: annualIncomeGoal,
      t: targetYears,
      a: {
        ar: state.assumptions.appreciationRate,
        ry: state.assumptions.rentalYield,
        ir: state.assumptions.interestRate
      }
    }

    const encoded = btoa(JSON.stringify(shareData))
    const shareUrl = `${window.location.origin}${window.location.pathname}?share=${encoded}`

    try {
      await navigator.clipboard.writeText(shareUrl)
      alert('Link copied to clipboard!')
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (state.properties.length === 0) {
    return null
  }

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={handleExportText}
        className="btn-secondary text-sm"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Export Report
      </button>

      <button
        type="button"
        onClick={handleExportJSON}
        className="btn-secondary text-sm"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Export Data
      </button>

      <button
        type="button"
        onClick={handleCopyLink}
        className="btn-secondary text-sm"
      >
        <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Share Link
      </button>
    </div>
  )
}
