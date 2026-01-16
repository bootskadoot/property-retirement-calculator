import React from 'react'
import { useCalculations } from '../../hooks/useCalculations'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import Card from '../ui/Card'

export default function ScenarioComparison() {
  const { goalProgress, saleScenario, targetYears } = useCalculations()

  if (!goalProgress || !saleScenario) {
    return null
  }

  const {
    targetMonthlyIncome,
    projectedMonthlyIncome,
    percentAchieved,
    goalAchieved,
    shortfall,
    surplus,
    propertiesNeeded,
    propertiesProjected
  } = goalProgress

  return (
    <Card
      title="Goal Progress"
      subtitle={`${targetYears} year projection`}
    >
      <div className="space-y-6">
        {/* Progress Bar */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Progress to Goal</span>
            <span className={`font-medium ${goalAchieved ? 'text-green-600' : 'text-amber-600'}`}>
              {formatPercent(percentAchieved / 100)}
            </span>
          </div>
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                goalAchieved ? 'bg-green-500' : percentAchieved >= 80 ? 'bg-amber-500' : 'bg-red-500'
              }`}
              style={{ width: `${Math.min(100, percentAchieved)}%` }}
            />
          </div>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-2 gap-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-500 mb-1">Target Income</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(targetMonthlyIncome)}
            </p>
            <p className="text-xs text-gray-400">per month</p>
          </div>

          <div className={`text-center p-4 rounded-lg ${
            goalAchieved ? 'bg-green-50' : 'bg-amber-50'
          }`}>
            <p className={`text-sm mb-1 ${goalAchieved ? 'text-green-600' : 'text-amber-600'}`}>
              Projected Income
            </p>
            <p className={`text-2xl font-bold ${goalAchieved ? 'text-green-700' : 'text-amber-700'}`}>
              {formatCurrency(projectedMonthlyIncome)}
            </p>
            <p className={`text-xs ${goalAchieved ? 'text-green-500' : 'text-amber-500'}`}>
              per month
            </p>
          </div>
        </div>

        {/* Status Message */}
        {goalAchieved ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-green-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-green-800">Goal Achievable!</h4>
                <p className="text-sm text-green-700 mt-1">
                  Your strategy projects a surplus of {formatCurrency(surplus)}/month above your target.
                  You'll have {propertiesProjected} debt-free properties generating passive income.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h4 className="font-medium text-amber-800">Goal Not Yet Achievable</h4>
                <p className="text-sm text-amber-700 mt-1">
                  You're projected to be {formatCurrency(shortfall)}/month short of your goal.
                  You need {propertiesNeeded} debt-free properties but will only have {propertiesProjected}.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions if not achievable */}
        {!goalAchieved && (
          <div className="border-t pt-4">
            <h4 className="font-medium text-gray-900 mb-3">How to Close the Gap</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Extend your timeline to allow more equity growth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Add more properties to your starting portfolio</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Allocate more cash towards the strategy</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary-500">•</span>
                <span>Reduce your target monthly income</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </Card>
  )
}
