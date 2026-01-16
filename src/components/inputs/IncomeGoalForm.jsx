import React from 'react'
import { CurrencySlider, YearSlider } from '../ui/Slider'
import { CurrencyInput } from '../ui/Input'
import { useCalculator, actions } from '../../context/CalculatorContext'
import { useCalculations } from '../../hooks/useCalculations'
import { formatCurrency, formatPropertyCount } from '../../utils/formatters'
import { RANGES } from '../../utils/constants'

export default function IncomeGoalForm() {
  const { state, dispatch } = useCalculator()
  const { propertiesNeeded, assumptions, incomePeriod, annualIncomeGoal } = useCalculations()

  const handleIncomeChange = (value) => {
    // If showing monthly, convert to annual for storage
    const annualValue = incomePeriod === 'monthly' ? value * 12 : value
    dispatch(actions.setIncomeGoal({ annualIncomeGoal: annualValue }))
  }

  const handlePeriodChange = (period) => {
    dispatch(actions.setIncomeGoal({ incomePeriod: period }))
  }

  const handleYearsChange = (value) => {
    dispatch(actions.setIncomeGoal({ targetYears: value }))
  }

  // Display value based on period selection
  const displayValue = incomePeriod === 'monthly'
    ? annualIncomeGoal / 12
    : annualIncomeGoal

  const sliderRange = incomePeriod === 'monthly'
    ? RANGES.monthlyIncome
    : RANGES.annualIncome

  const grossIncomeNeeded = annualIncomeGoal / (1 - assumptions.taxBracket)

  return (
    <div className="space-y-6">
      {/* Period Toggle */}
      <div className="flex items-center justify-between">
        <label className="input-label mb-0">Target Passive Income</label>
        <div className="inline-flex rounded-lg border border-gray-200 p-0.5 bg-gray-50">
          <button
            type="button"
            onClick={() => handlePeriodChange('annual')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              incomePeriod === 'annual'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Annual
          </button>
          <button
            type="button"
            onClick={() => handlePeriodChange('monthly')}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
              incomePeriod === 'monthly'
                ? 'bg-white text-primary-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Monthly
          </button>
        </div>
      </div>

      <div>
        <CurrencyInput
          value={displayValue}
          onChange={handleIncomeChange}
          tooltip="After-tax income you want from debt-free rental properties"
          helpText={incomePeriod === 'annual'
            ? `${formatCurrency(annualIncomeGoal / 12)}/month after tax`
            : `${formatCurrency(annualIncomeGoal)}/year after tax`
          }
        />

        <CurrencySlider
          label=""
          value={displayValue}
          onChange={handleIncomeChange}
          min={sliderRange.min}
          max={sliderRange.max}
          step={sliderRange.step}
          className="mt-3"
        />
      </div>

      <YearSlider
        label="Target Timeline"
        value={state.targetYears}
        onChange={handleYearsChange}
        min={RANGES.timeline.min}
        max={RANGES.timeline.max}
        step={RANGES.timeline.step}
        tooltip="Years until you want to achieve your passive income goal"
      />

      <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-5">
        <h4 className="font-medium text-primary-900 mb-3">What You Need</h4>

        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-primary-700">After-tax income target:</span>
            <span className="font-semibold text-primary-900">{formatCurrency(annualIncomeGoal)}/year</span>
          </div>

          <div className="flex justify-between">
            <span className="text-primary-700">Gross rent needed (pre-tax):</span>
            <span className="font-semibold text-primary-900">{formatCurrency(grossIncomeNeeded)}/year</span>
          </div>

          <div className="pt-3 border-t border-primary-200">
            <div className="flex justify-between items-center">
              <span className="text-primary-700">Debt-free properties needed:</span>
              <span className="text-2xl font-bold text-primary-900">{propertiesNeeded}</span>
            </div>
            <p className="text-sm text-primary-600 mt-1">
              At {formatCurrency(assumptions.averagePropertyPrice, true)} average value, {(assumptions.rentalYield * 100).toFixed(1)}% yield
            </p>
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500">
        Set your income goal and timeline, then add your current properties in the Portfolio tab to see your path to achieving this.
      </p>
    </div>
  )
}
