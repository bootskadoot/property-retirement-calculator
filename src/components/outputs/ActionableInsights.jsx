import React from 'react'
import Card from '../ui/Card'
import { formatCurrency, formatPercent } from '../../utils/formatters'

// Icon components
const Icons = {
  rocket: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  bank: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  clock: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  alert: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  calendar: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  ),
  wallet: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
    </svg>
  ),
  'trending-up': () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  ),
  'check-circle': () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  target: () => (
    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  )
}

const typeStyles = {
  action: {
    bg: 'bg-green-50',
    border: 'border-green-200',
    icon: 'bg-green-500 text-white',
    title: 'text-green-900',
    text: 'text-green-700'
  },
  success: {
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'bg-emerald-500 text-white',
    title: 'text-emerald-900',
    text: 'text-emerald-700'
  },
  info: {
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    icon: 'bg-blue-500 text-white',
    title: 'text-blue-900',
    text: 'text-blue-700'
  },
  warning: {
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'bg-amber-500 text-white',
    title: 'text-amber-900',
    text: 'text-amber-700'
  }
}

function InsightCard({ insight }) {
  const styles = typeStyles[insight.type] || typeStyles.info
  const IconComponent = Icons[insight.icon] || Icons.target

  return (
    <div className={`${styles.bg} ${styles.border} border rounded-lg p-4`}>
      <div className="flex items-start gap-3">
        <div className={`${styles.icon} p-2 rounded-lg flex-shrink-0`}>
          <IconComponent />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className={`font-semibold ${styles.title}`}>{insight.title}</h4>
          <p className={`text-sm mt-1 ${styles.text}`}>{insight.description}</p>
          {insight.action && (
            <div className="mt-2">
              <span className={`inline-flex items-center text-xs font-medium ${styles.title} bg-white/50 px-2 py-1 rounded`}>
                Next step: {insight.action}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function WhatToDoNext({ insights }) {
  if (!insights || insights.length === 0) return null

  // Get highest priority insights (max 3)
  const sortedInsights = [...insights].sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    return (priorityOrder[a.priority] || 2) - (priorityOrder[b.priority] || 2)
  }).slice(0, 3)

  return (
    <Card title="What To Do Next" subtitle="Your immediate action items">
      <div className="space-y-3 mt-4">
        {sortedInsights.map((insight, index) => (
          <InsightCard key={index} insight={insight} />
        ))}
      </div>
    </Card>
  )
}

export function GapAnalysisCard({ gapAnalysis, targetYears }) {
  if (!gapAnalysis) return null

  const { options, actualOutcome, incomeShortfall } = gapAnalysis

  return (
    <Card
      title="How To Close The Gap"
      subtitle={`You're ${formatCurrency(incomeShortfall)}/year short of your goal`}
    >
      <div className="mt-4 space-y-4">
        {/* Options to close the gap */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Options to reach your goal:</h4>
          <div className="space-y-2">
            {options.additionalProperties.description && (
              <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  +{options.additionalProperties.count}
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">More Properties</p>
                  <p className="text-xs text-blue-700">{options.additionalProperties.description}</p>
                </div>
              </div>
            )}

            {options.additionalCash.description && (
              <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-green-900">More Starting Cash</p>
                  <p className="text-xs text-green-700">{options.additionalCash.description}</p>
                </div>
              </div>
            )}

            {options.additionalTime.description && (
              <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  +{options.additionalTime.years}
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">More Time</p>
                  <p className="text-xs text-purple-700">{options.additionalTime.description}</p>
                </div>
              </div>
            )}

            {options.lowerGoal.description && actualOutcome.annualIncome > 0 && (
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-8 h-8 bg-gray-500 text-white rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Adjust Goal</p>
                  <p className="text-xs text-gray-700">{options.lowerGoal.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* What they'd actually achieve */}
        <div className="pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-3">What you'd actually achieve in {targetYears} years:</h4>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {actualOutcome.trulyDebtFree || 0}
                  {actualOutcome.withRemainingDebt > 0 && (
                    <span className="text-sm font-normal text-amber-600"> +{actualOutcome.withRemainingDebt}</span>
                  )}
                </p>
                <p className="text-xs text-gray-500">
                  {actualOutcome.withRemainingDebt > 0
                    ? 'Debt-free + with debt'
                    : 'Debt-free properties'}
                </p>
              </div>
              <div>
                <p className={`text-2xl font-bold ${actualOutcome.annualIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {formatCurrency(actualOutcome.annualIncome)}
                </p>
                <p className="text-xs text-gray-500">Annual passive income</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(actualOutcome.portfolioValue)}</p>
                <p className="text-xs text-gray-500">Portfolio value</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-blue-600">{actualOutcome.percentOfGoal}%</p>
                <p className="text-xs text-gray-500">Of your goal</p>
              </div>
            </div>
            {actualOutcome.remainingDebt > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-amber-700">
                  Note: {formatCurrency(actualOutcome.remainingDebt)} debt remains, reducing your passive income.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  )
}

export function LeversCard({ leversAnalysis }) {
  if (!leversAnalysis || !leversAnalysis.levers || leversAnalysis.levers.length === 0) return null

  const { levers, controllableLevers } = leversAnalysis

  return (
    <Card title="Biggest Levers" subtitle="What has the most impact on your outcome">
      <div className="mt-4 space-y-3">
        {/* Controllable levers first */}
        {controllableLevers.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              What you can control
            </h4>
            <div className="space-y-2">
              {controllableLevers.map((lever, index) => (
                <div
                  key={lever.id}
                  className={`p-3 rounded-lg border ${
                    index === 0 ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {index === 0 && (
                        <span className="text-xs px-2 py-0.5 bg-green-500 text-white rounded-full font-medium">
                          #1
                        </span>
                      )}
                      <span className="font-medium text-gray-900">{lever.name}</span>
                      <span className="text-sm text-gray-500">({lever.change})</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${lever.impact.annualIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {lever.impact.annualIncome >= 0 ? '+' : ''}{formatCurrency(lever.impact.annualIncome)}/yr
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lever.description}</p>
                  <div className="flex gap-4 mt-2 text-xs text-gray-500">
                    <span>Properties: {lever.impact.propertiesAcquired >= 0 ? '+' : ''}{lever.impact.propertiesAcquired}</span>
                    <span>Debt-free: {lever.impact.debtFreeProperties >= 0 ? '+' : ''}{lever.impact.debtFreeProperties}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Market factors */}
        {levers.filter(l => !l.controllable).length > 0 && (
          <div className="pt-3 border-t border-gray-200">
            <h4 className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
              Market factors (location choice)
            </h4>
            <div className="space-y-2">
              {levers.filter(l => !l.controllable).map((lever) => (
                <div
                  key={lever.id}
                  className="p-3 rounded-lg bg-blue-50 border border-blue-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{lever.name}</span>
                      <span className="text-sm text-gray-500">({lever.change})</span>
                    </div>
                    <div className="text-right">
                      <span className={`font-bold ${lever.impact.annualIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                        {lever.impact.annualIncome >= 0 ? '+' : ''}{formatCurrency(lever.impact.annualIncome)}/yr
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{lever.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-3 p-3 bg-gray-100 rounded-lg">
          <p className="text-xs text-gray-600">
            <strong>Key insight:</strong> {controllableLevers[0]?.name || 'Timeline'} has the biggest controllable impact on your outcome.
            {controllableLevers[0]?.impact.annualIncome > 0 && (
              <span> Adjusting this could add <strong>{formatCurrency(controllableLevers[0].impact.annualIncome)}/year</strong> to your passive income.</span>
            )}
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function ActionableInsights({ insights, gapAnalysis, leversAnalysis, targetYears }) {
  return (
    <div className="space-y-6">
      <WhatToDoNext insights={insights} />
      <GapAnalysisCard gapAnalysis={gapAnalysis} targetYears={targetYears} />
      <LeversCard leversAnalysis={leversAnalysis} />
    </div>
  )
}
