import React, { useState } from 'react'
import { useCalculations } from '../../hooks/useCalculations'
import { useCalculator } from '../../context/CalculatorContext'
import { formatCurrency, formatPercent, formatYears } from '../../utils/formatters'
import Card from '../ui/Card'
import { WhatToDoNext, GapAnalysisCard, LeversCard } from './ActionableInsights'

function YearRow({ yearData, isFirst, isPurchaseYear }) {
  const [expanded, setExpanded] = useState(false)
  const { year, properties, totals, events } = yearData

  return (
    <div className={`border-l-4 ${isPurchaseYear ? 'border-green-500' : 'border-gray-300'} ${expanded ? 'bg-gray-50 shadow-md rounded-lg mb-4' : 'bg-white mb-1'} transition-all`}>
      {/* Year Header - always visible */}
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className={`w-full p-4 flex items-center justify-between transition-colors ${expanded ? 'bg-white rounded-t-lg border-b border-gray-200' : 'hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
            isPurchaseYear ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {year}
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-gray-900">Year {year}</span>
              {isPurchaseYear && (
                <span className="text-xs px-2 py-0.5 bg-green-100 text-green-700 rounded-full font-medium">
                  +{events.propertiesPurchased} {events.propertiesPurchased > 1 ? 'Properties' : 'Property'}
                </span>
              )}
              {isFirst && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full font-medium">
                  Start
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          {/* Key metrics */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-gray-900">{formatCurrency(totals.totalValue, true)}</p>
            <p className="text-xs text-gray-500">Portfolio Value</p>
          </div>
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-green-600">{formatCurrency(totals.totalEquity, true)}</p>
            <p className="text-xs text-gray-500">Total Equity</p>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-gray-600">{formatPercent(totals.totalDebt / totals.totalValue)}</p>
            <p className="text-xs text-gray-500">LVR</p>
          </div>

          {/* Expand arrow */}
          <svg
            className={`w-5 h-5 text-gray-400 transition-transform ${expanded ? 'rotate-180' : ''}`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Details */}
      {expanded && (
        <div className="pl-8 pr-4 pb-4 ml-4 border-l-2 border-gray-200">
          {/* Year indicator for expanded state - helps with multiple open */}
          <div className={`sticky top-0 z-10 -ml-8 -mr-4 pl-8 pr-4 py-2 mb-3 ${isPurchaseYear ? 'bg-green-100' : 'bg-gray-100'} border-b flex items-center justify-between`}>
            <span className={`text-sm font-bold ${isPurchaseYear ? 'text-green-800' : 'text-gray-700'}`}>
              Year {year} Details
            </span>
            <span className="text-xs text-gray-500">
              {properties.length} {properties.length === 1 ? 'property' : 'properties'}
            </span>
          </div>

          {/* Mobile metrics */}
          <div className="grid grid-cols-3 gap-4 py-3 sm:hidden border-b border-gray-100 mb-3">
            <div>
              <p className="text-sm font-medium text-gray-900">{formatCurrency(totals.totalValue, true)}</p>
              <p className="text-xs text-gray-500">Value</p>
            </div>
            <div>
              <p className="text-sm font-medium text-green-600">{formatCurrency(totals.totalEquity, true)}</p>
              <p className="text-xs text-gray-500">Equity</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">{formatPercent(totals.totalDebt / totals.totalValue)}</p>
              <p className="text-xs text-gray-500">LVR</p>
            </div>
          </div>

          {/* Properties Table */}
          <div className="space-y-2">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide pt-2">Properties</h4>
            {properties.map((property, idx) => {
              const isNewProperty = property.id?.startsWith('new-')
              const justPurchased = isNewProperty && property.yearPurchased === year
              return (
                <div
                  key={property.id || idx}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    justPurchased ? 'bg-green-100 border border-green-200' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      justPurchased ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                    }`}>
                      {idx + 1}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900 text-sm">{property.name || `Property ${idx + 1}`}</p>
                        {justPurchased && (
                          <span className="text-xs px-1.5 py-0.5 bg-green-500 text-white rounded font-medium">
                            NEW
                          </span>
                        )}
                        {isNewProperty && !justPurchased && (
                          <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                            Modeled
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-right">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(property.currentValue, true)}</p>
                      <p className="text-xs text-gray-500">Value</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-600">{formatCurrency(property.equity, true)}</p>
                      <p className="text-xs text-gray-500">Equity</p>
                    </div>
                    <div className="hidden sm:block">
                      <p className="text-sm font-medium text-gray-500">{formatCurrency(property.loanAmount, true)}</p>
                      <p className="text-xs text-gray-500">Loan</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Purchase Event Details */}
          {isPurchaseYear && (
            <div className="mt-3 p-3 bg-green-100 rounded-lg border border-green-200">
              <p className="text-sm font-medium text-green-800">
                Purchased {events.propertiesPurchased} new {events.propertiesPurchased === 1 ? 'property' : 'properties'}
              </p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                {events.cashUsed > 0 && (
                  <div className="bg-white/50 rounded p-2">
                    <p className="text-green-800 font-medium">{formatCurrency(events.cashUsed)}</p>
                    <p className="text-green-600">Cash used</p>
                  </div>
                )}
                {events.refinanceAmount > 0 && (
                  <div className="bg-white/50 rounded p-2">
                    <p className="text-green-800 font-medium">{formatCurrency(events.refinanceAmount)}</p>
                    <p className="text-green-600">From refinancing</p>
                  </div>
                )}
              </div>
              {events.cashUsed === 0 && events.refinanceAmount === 0 && (
                <p className="text-xs text-green-700 mt-1">Funded entirely from accumulated cash flow</p>
              )}
            </div>
          )}

          {/* Available Funds Info */}
          {!isPurchaseYear && events.canRefinance && (
            <div className="mt-3 p-3 bg-amber-50 rounded-lg border border-amber-200">
              <p className="text-sm font-medium text-amber-800">
                Refinance year - but insufficient funds to purchase
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Available: {formatCurrency(totals.availableFunds)} | Need: more equity growth or cash
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function LeadCaptureForm() {
  const [email, setEmail] = useState('')
  const [buyingSoon, setBuyingSoon] = useState(false)
  const [openToContact, setOpenToContact] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)

    try {
      const formData = new FormData()
      formData.append('form-name', 'roadmap-lead')
      formData.append('email', email)
      formData.append('buyingSoon', buyingSoon ? 'Yes' : 'No')
      formData.append('openToContact', openToContact ? 'Yes' : 'No')

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })

      if (response.ok) {
        setIsSubmitted(true)
      }
    } catch (err) {
      // Silently fail - don't disrupt user experience
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <svg className="w-4 h-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span>Thanks. We'll send your roadmap summary shortly.</span>
        </div>
      </div>
    )
  }

  return (
    <div className="mt-8 pt-6 border-t border-gray-200">
      <form onSubmit={handleSubmit} name="roadmap-lead" method="POST" data-netlify="true">
        <input type="hidden" name="form-name" value="roadmap-lead" />

        {/* Honeypot */}
        <p className="hidden">
          <label>Don't fill this out: <input name="bot-field" /></label>
        </p>

        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <div className="flex-1">
            <p className="text-sm text-gray-600 mb-3">
              Want a PDF of this roadmap? We'll email you a summary you can revisit anytime.
            </p>

            <div className="flex gap-2 mb-3">
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-gray-400 focus:border-gray-400 outline-none"
              />
              <button
                type="submit"
                disabled={isSubmitting || !email}
                className="px-4 py-1.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 border border-gray-300 rounded-md transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '...' : 'Send'}
              </button>
            </div>

            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="buyingSoon"
                  checked={buyingSoon}
                  onChange={(e) => setBuyingSoon(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-gray-600 focus:ring-gray-400"
                />
                <span className="text-xs text-gray-500">I'm looking to buy property in the next 12 months</span>
              </label>

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="openToContact"
                  checked={openToContact}
                  onChange={(e) => setOpenToContact(e.target.checked)}
                  className="mt-0.5 rounded border-gray-300 text-gray-600 focus:ring-gray-400"
                />
                <span className="text-xs text-gray-500">I'm open to hearing from buyers agents or brokers who specialise in property investment</span>
              </label>
            </div>

            <p className="text-xs text-gray-400 mt-2">No spam, just your summary.</p>
          </div>
        </div>
      </form>
    </div>
  )
}

function CollapsibleSection({ title, subtitle, children, defaultOpen = false, badge }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <Card>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between text-left"
      >
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {badge && (
              <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && <div className="mt-4">{children}</div>}
    </Card>
  )
}

export default function Roadmap() {
  const { state } = useCalculator()
  const {
    projection,
    saleScenario,
    goalProgress,
    portfolioTotals,
    targetYears,
    annualIncomeGoal,
    assumptions,
    insights,
    gapAnalysis,
    leversAnalysis
  } = useCalculations()

  if (state.properties.length === 0) {
    return (
      <Card>
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Your Journey Awaits</h3>
          <p className="text-gray-500 max-w-md mx-auto">
            Add your current properties in the Portfolio tab to see your personalized roadmap to {formatCurrency(annualIncomeGoal)}/year passive income.
          </p>
        </div>
      </Card>
    )
  }

  // Calculate key stats
  const finalYear = projection[projection.length - 1]
  const propertiesBought = finalYear ? finalYear.properties.length - state.properties.length : 0
  const totalPropertyCount = finalYear?.properties.length || state.properties.length
  const purchaseYears = projection.filter(y => y.events.propertiesPurchased > 0).map(y => y.year)

  return (
    <div className="space-y-6">
      {/* Hero Summary */}
      <Card className={goalProgress?.goalAchieved
        ? 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
        : (goalProgress?.projectedAnnualIncome || 0) < 0
          ? 'bg-gradient-to-br from-red-50 to-rose-50 border-red-200'
          : 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
      }>
        <div className="text-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-3 ${
            goalProgress?.goalAchieved
              ? 'bg-green-100 text-green-800'
              : (goalProgress?.projectedAnnualIncome || 0) < 0
                ? 'bg-red-100 text-red-800'
                : 'bg-amber-100 text-amber-800'
          }`}>
            {goalProgress?.goalAchieved
              ? 'Goal Achievable'
              : (goalProgress?.projectedAnnualIncome || 0) < 0
                ? 'Negative Cash Flow'
                : 'Goal In Progress'}
          </div>

          <h2 className={`text-3xl font-bold ${(goalProgress?.projectedAnnualIncome || 0) < 0 ? 'text-red-600' : 'text-gray-900'}`}>
            {formatCurrency(goalProgress?.projectedAnnualIncome || 0)}
            <span className="text-lg font-normal text-gray-500">/year</span>
          </h2>

          <p className="text-gray-600 mt-1">
            {(goalProgress?.projectedAnnualIncome || 0) < 0
              ? 'More time or properties needed'
              : `Projected passive income in ${formatYears(targetYears)}`}
          </p>

          <div className="flex items-center justify-center gap-6 mt-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalPropertyCount}</p>
              <p className="text-xs text-gray-500">Properties at Peak</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">+{propertiesBought}</p>
              <p className="text-xs text-gray-500">Properties Bought</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary-600">{saleScenario?.trulyDebtFreeCount || 0}</p>
              <p className="text-xs text-gray-500">
                {saleScenario?.propertiesWithDebtCount > 0
                  ? `Debt-Free (${saleScenario.debtFreeProperties.length} kept)`
                  : 'Debt-Free Final'}
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Borrowing Power Disclaimer */}
      <div className="flex items-start gap-2 px-3 py-2 bg-gray-50 rounded-lg border border-gray-200">
        <svg className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs text-gray-500">
          This projection assumes you can secure financing for each purchase. In practice, your borrowing capacity depends on income, existing debts, and lender policies. Consider speaking with a mortgage broker to understand your limits.
        </p>
      </div>

      {/* Actionable Insights */}
      <WhatToDoNext insights={insights} />

      {/* Gap Analysis - only shown when goal not achieved */}
      {gapAnalysis && <GapAnalysisCard gapAnalysis={gapAnalysis} targetYears={targetYears} />}

      {/* Levers Analysis - what has biggest impact */}
      <LeversCard leversAnalysis={leversAnalysis} />

      {/* Year-by-Year Timeline - Collapsible */}
      <CollapsibleSection
        title="Year-by-Year Journey"
        subtitle="Expand to see detailed progression"
        badge={`${targetYears} years`}
        defaultOpen={false}
      >
        <div className="space-y-1">
          {projection.map((yearData, index) => (
            <YearRow
              key={yearData.year}
              yearData={yearData}
              isFirst={index === 0}
              isPurchaseYear={yearData.events.propertiesPurchased > 0}
            />
          ))}
        </div>

        {/* Legend */}
        <div className="mt-4 pt-4 border-t flex flex-wrap items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded"></div>
            <span>Property purchase year</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">Modeled</span>
            <span>Projected future purchase</span>
          </div>
        </div>
      </CollapsibleSection>

      {/* Strategic Sale Plan - Collapsible */}
      {saleScenario && saleScenario.propertiesToSell.length > 0 && (
        <CollapsibleSection
          title="Strategic Sale Plan"
          subtitle={`Year ${targetYears} execution`}
          badge={`${saleScenario.propertiesToSell.length} to sell`}
          defaultOpen={false}
        >
          <div className="space-y-4">
            {/* Properties to Sell */}
            <div>
              <h4 className="text-sm font-medium text-red-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                Sell These Properties
              </h4>
              <div className="space-y-2">
                {saleScenario.propertiesToSell.map((property, index) => {
                  const isNewProperty = property.id?.startsWith('new-')
                  return (
                    <div key={property.id || index} className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{property.name || `Property ${index + 1}`}</p>
                          {isNewProperty && (
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                              Modeled
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Value: {formatCurrency(property.currentValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          +{formatCurrency(property.currentValue - property.loanAmount)}
                        </p>
                        <p className="text-xs text-gray-500">Net proceeds</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Properties to Keep */}
            <div>
              <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                Keep Debt-Free
              </h4>
              <div className="space-y-2">
                {saleScenario.debtFreeProperties.map((property, index) => {
                  const isNewProperty = property.id?.startsWith('new-')
                  return (
                    <div key={property.id || index} className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{property.name || `Property ${index + 1}`}</p>
                          {isNewProperty && (
                            <span className="text-xs px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium">
                              Modeled
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-500">Value: {formatCurrency(property.currentValue)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-green-600">
                          {formatCurrency(property.annualRent)}/year
                        </p>
                        <p className="text-xs text-gray-500">Rental income</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Sale Proceeds Summary with CGT */}
            {saleScenario.grossSaleProceeds > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-700 mb-3">Sale Proceeds Summary</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Gross Sale Proceeds</span>
                    <span className="font-medium text-gray-900">{formatCurrency(saleScenario.grossSaleProceeds)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Less: Outstanding Debt</span>
                    <span className="font-medium text-red-600">
                      -{formatCurrency(saleScenario.propertiesToSell.reduce((sum, p) => sum + p.loanAmount, 0))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Less: Capital Gains Tax</span>
                    <span className="font-medium text-red-600">-{formatCurrency(saleScenario.totalCGT || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm pt-2 border-t border-gray-200">
                    <span className="font-medium text-gray-900">Net Proceeds After Tax</span>
                    <span className="font-bold text-green-600">{formatCurrency(saleScenario.netSaleProceeds || 0)}</span>
                  </div>
                </div>
                {saleScenario.totalCGT > 0 && (
                  <p className="text-xs text-gray-500 mt-2">
                    CGT calculated at {formatPercent(assumptions.taxBracket)} marginal rate with 50% discount for properties held &gt;12 months
                  </p>
                )}
              </div>
            )}
          </div>
        </CollapsibleSection>
      )}

      {/* Final Numbers */}
      <Card title="Final Position" subtitle={`After ${targetYears} years`}>
        {/* Warning if remaining debt */}
        {saleScenario?.remainingDebt > 0 && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm font-medium text-amber-800">
              Remaining debt: {formatCurrency(saleScenario.remainingDebt)}
            </p>
            <p className="text-xs text-amber-700 mt-1">
              Sale proceeds weren't enough to fully pay off all debt. Consider extending timeline or adding more properties.
            </p>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <p className="text-2xl font-bold text-gray-900">
              {saleScenario?.trulyDebtFreeCount || 0}
              {saleScenario?.propertiesWithDebtCount > 0 && (
                <span className="text-sm font-normal text-amber-600"> +{saleScenario.propertiesWithDebtCount}</span>
              )}
            </p>
            <p className="text-xs text-gray-500">
              {saleScenario?.propertiesWithDebtCount > 0
                ? 'Debt-Free + With Debt'
                : 'Debt-Free Properties'}
            </p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(saleScenario?.totalGrossRent || 0, true)}
            </p>
            <p className="text-xs text-gray-500">Gross Rental Income</p>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <p className={`text-2xl font-bold ${(saleScenario?.totalNetCashFlow || 0) >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
              {formatCurrency(saleScenario?.totalNetCashFlow || 0, true)}
            </p>
            <p className="text-xs text-gray-500">Net Cash Flow</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-lg">
            <p className="text-2xl font-bold text-purple-600">
              {formatCurrency(
                (saleScenario?.debtFreeProperties || []).reduce((sum, p) => sum + p.currentValue, 0),
                true
              )}
            </p>
            <p className="text-xs text-gray-500">Portfolio Value</p>
          </div>
        </div>

        {/* Income breakdown */}
        {saleScenario && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg text-sm">
            <p className="font-medium text-gray-700 mb-2">Income Breakdown</p>
            <div className="space-y-1 text-gray-600">
              <div className="flex justify-between">
                <span>Gross Rental Income</span>
                <span>{formatCurrency(saleScenario.totalGrossRent || 0)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Less: Vacancy & Holding Costs</span>
                <span>-{formatCurrency((saleScenario.totalGrossRent || 0) - (saleScenario.totalNetRent || 0))}</span>
              </div>
              {saleScenario.remainingDebt > 0 && (
                <div className="flex justify-between text-gray-500">
                  <span>Less: Interest on Remaining Debt</span>
                  <span>-{formatCurrency((saleScenario.totalNetRent || 0) - (saleScenario.totalNetCashFlow || 0))}</span>
                </div>
              )}
              <div className="flex justify-between font-medium pt-1 border-t border-gray-200">
                <span>Net Cash Flow (pre-tax)</span>
                <span className={saleScenario.totalNetCashFlow >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(saleScenario.totalNetCashFlow || 0)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>After Tax ({formatPercent(assumptions.taxBracket)} bracket)</span>
                <span className={saleScenario.afterTaxIncome >= 0 ? 'text-green-600' : 'text-red-600'}>
                  {formatCurrency(saleScenario.afterTaxIncome || 0)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Comparison to Goal */}
        {goalProgress && (
          <div className="mt-4 pt-4 border-t">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Progress to Goal</span>
              <span className={`text-sm font-medium ${goalProgress.goalAchieved ? 'text-green-600' : 'text-amber-600'}`}>
                {formatPercent(goalProgress.percentAchieved / 100)}
              </span>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  goalProgress.goalAchieved ? 'bg-green-500' : 'bg-amber-500'
                }`}
                style={{ width: `${Math.min(100, goalProgress.percentAchieved)}%` }}
              />
            </div>
            <div className="flex justify-between mt-1 text-xs text-gray-500">
              <span>Current: {formatCurrency(goalProgress.projectedAnnualIncome)}/year</span>
              <span>Target: {formatCurrency(annualIncomeGoal)}/year</span>
            </div>
          </div>
        )}
      </Card>

      {/* Tip about assumptions */}
      {propertiesBought === 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-sm font-medium text-amber-800">No new purchases projected</p>
          <p className="text-xs text-amber-700 mt-1">
            To enable property purchases, try: lowering the <strong>Target Purchase Price</strong> in Assumptions
            (currently {formatCurrency(assumptions.averagePropertyPrice)}), adding more <strong>Cash to Invest</strong>,
            or extending your timeline.
          </p>
        </div>
      )}

      {/* Subtle Lead Capture */}
      <LeadCaptureForm />
    </div>
  )
}
