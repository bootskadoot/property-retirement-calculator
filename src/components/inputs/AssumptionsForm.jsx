import React, { useState } from 'react'
import { PercentSlider, CurrencySlider, YearSlider } from '../ui/Slider'
import { CurrencyInput } from '../ui/Input'
import { useCalculator, actions } from '../../context/CalculatorContext'
import { DEFAULTS, RANGES, TOOLTIPS } from '../../utils/constants'
import { WarningBanner } from '../layout/Disclaimer'
import { useCalculations } from '../../hooks/useCalculations'

export default function AssumptionsForm() {
  const { state, dispatch } = useCalculator()
  const { warnings } = useCalculations()
  const { assumptions } = state
  const [expertMode, setExpertMode] = useState(false)

  const handleChange = (field, value) => {
    dispatch(actions.setAssumptions({ [field]: value }))
  }

  const handleCashChange = (field, value) => {
    dispatch(actions.setCashPosition({ [field]: value }))
  }

  const handleReset = () => {
    dispatch(actions.resetAssumptions())
  }

  const hasCustomAssumptions = JSON.stringify(assumptions) !== JSON.stringify({
    appreciationRate: DEFAULTS.appreciationRate,
    rentGrowthRate: DEFAULTS.rentGrowthRate,
    rentalYield: DEFAULTS.rentalYield,
    interestRate: DEFAULTS.interestRate,
    maxLVR: DEFAULTS.maxInvestmentLVR,
    stampDutyRate: DEFAULTS.stampDutyRate,
    taxBracket: DEFAULTS.taxBracket,
    refinanceInterval: DEFAULTS.refinanceInterval,
    averagePropertyPrice: DEFAULTS.averagePropertyPrice,
    holdingCostsRate: DEFAULTS.holdingCostsRate,
    vacancyRate: DEFAULTS.vacancyRate,
    buyersAgentFee: DEFAULTS.buyersAgentFee,
    sellingCostsRate: DEFAULTS.sellingCostsRate,
    interestOnlyYears: DEFAULTS.interestOnlyYears,
  })

  return (
    <div className="space-y-6">
      <WarningBanner warnings={warnings} />

      {/* Mode Toggle */}
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
        <span className="text-sm text-gray-600">
          {expertMode ? 'Showing all settings' : 'Showing essential settings only'}
        </span>
        <button
          type="button"
          onClick={() => setExpertMode(!expertMode)}
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
            expertMode
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          {expertMode ? 'Expert Mode' : 'Simple Mode'}
        </button>
      </div>

      {/* Cash Position Section */}
      <div>
        <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Cash Available</h4>
        <CurrencyInput
          label="Cash to Invest"
          value={state.cashAllocated}
          onChange={(v) => {
            handleCashChange('cashAllocated', v)
            handleCashChange('cashReserves', v)
          }}
          tooltip="Cash you have available to put towards property deposits and costs"
          helpText="This will be used alongside refinanced equity to purchase new properties"
        />
      </div>

      {/* Property Purchase Assumptions */}
      <div>
        <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">New Property Purchases</h4>
        <div className="space-y-4">
          <CurrencySlider
            label="Target Purchase Price"
            value={assumptions.averagePropertyPrice}
            onChange={(v) => handleChange('averagePropertyPrice', v)}
            min={500000}
            max={3000000}
            step={50000}
            tooltip="Average price for new property purchases in your strategy"
          />

          {expertMode && (
            <>
              <PercentSlider
                label="Maximum LVR"
                value={assumptions.maxLVR}
                onChange={(v) => handleChange('maxLVR', v)}
                min={RANGES.maxInvestmentLVR.min}
                max={RANGES.maxInvestmentLVR.max}
                step={RANGES.maxInvestmentLVR.step}
                tooltip={TOOLTIPS.maxLVR}
              />

              <YearSlider
                label="Refinance Interval"
                value={assumptions.refinanceInterval}
                onChange={(v) => handleChange('refinanceInterval', v)}
                min={1}
                max={5}
                step={1}
                tooltip="How often you can refinance to extract equity for new purchases"
              />

              <YearSlider
                label="Interest Only Period"
                value={assumptions.interestOnlyYears}
                onChange={(v) => handleChange('interestOnlyYears', v)}
                min={RANGES.interestOnlyYears.min}
                max={RANGES.interestOnlyYears.max}
                step={RANGES.interestOnlyYears.step}
                tooltip={TOOLTIPS.interestOnlyYears}
              />
            </>
          )}
        </div>
      </div>

      {/* Market Assumptions */}
      <div>
        <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Market Assumptions</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <PercentSlider
            label="Capital Growth"
            value={assumptions.appreciationRate}
            onChange={(v) => handleChange('appreciationRate', v)}
            min={RANGES.appreciationRate.min}
            max={RANGES.appreciationRate.max}
            step={RANGES.appreciationRate.step}
            tooltip={TOOLTIPS.appreciationRate}
          />

          {expertMode && (
            <PercentSlider
              label="Rent Growth"
              value={assumptions.rentGrowthRate}
              onChange={(v) => handleChange('rentGrowthRate', v)}
              min={RANGES.rentGrowthRate.min}
              max={RANGES.rentGrowthRate.max}
              step={RANGES.rentGrowthRate.step}
              tooltip={TOOLTIPS.rentGrowthRate}
            />
          )}

          <PercentSlider
            label="Rental Yield"
            value={assumptions.rentalYield}
            onChange={(v) => handleChange('rentalYield', v)}
            min={RANGES.rentalYield.min}
            max={RANGES.rentalYield.max}
            step={RANGES.rentalYield.step}
            tooltip={TOOLTIPS.rentalYield}
          />

          <PercentSlider
            label="Interest Rate"
            value={assumptions.interestRate}
            onChange={(v) => handleChange('interestRate', v)}
            min={RANGES.interestRate.min}
            max={RANGES.interestRate.max}
            step={RANGES.interestRate.step}
            tooltip={TOOLTIPS.interestRate}
          />

          {expertMode && (
            <PercentSlider
              label="Stamp Duty Rate"
              value={assumptions.stampDutyRate}
              onChange={(v) => handleChange('stampDutyRate', v)}
              min={RANGES.stampDutyRate.min}
              max={RANGES.stampDutyRate.max}
              step={RANGES.stampDutyRate.step}
              tooltip={TOOLTIPS.stampDuty}
            />
          )}
        </div>
      </div>

      {/* Tax Bracket */}
      <div>
        <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Tax</h4>
        <PercentSlider
          label="Marginal Tax Bracket"
          value={assumptions.taxBracket}
          onChange={(v) => handleChange('taxBracket', v)}
          min={RANGES.taxBracket.min}
          max={RANGES.taxBracket.max}
          step={RANGES.taxBracket.step}
          tooltip="Your marginal tax rate on rental income"
        />
      </div>

      {/* Costs & Fees - Expert Only */}
      {expertMode && (
        <div>
          <h4 className="font-medium text-gray-900 border-b pb-2 mb-4">Costs & Fees</h4>
          <div className="space-y-4">
            <PercentSlider
              label="Holding Costs"
              value={assumptions.holdingCostsRate}
              onChange={(v) => handleChange('holdingCostsRate', v)}
              min={RANGES.holdingCostsRate.min}
              max={RANGES.holdingCostsRate.max}
              step={RANGES.holdingCostsRate.step}
              tooltip={TOOLTIPS.holdingCosts}
            />

            <PercentSlider
              label="Vacancy Rate"
              value={assumptions.vacancyRate}
              onChange={(v) => handleChange('vacancyRate', v)}
              min={RANGES.vacancyRate.min}
              max={RANGES.vacancyRate.max}
              step={RANGES.vacancyRate.step}
              tooltip={TOOLTIPS.vacancyRate}
            />

            <CurrencySlider
              label="Buyers Agent Fee"
              value={assumptions.buyersAgentFee}
              onChange={(v) => handleChange('buyersAgentFee', v)}
              min={RANGES.buyersAgentFee.min}
              max={RANGES.buyersAgentFee.max}
              step={RANGES.buyersAgentFee.step}
              tooltip={TOOLTIPS.buyersAgentFee}
            />

            <PercentSlider
              label="Selling Costs"
              value={assumptions.sellingCostsRate}
              onChange={(v) => handleChange('sellingCostsRate', v)}
              min={RANGES.sellingCostsRate.min}
              max={RANGES.sellingCostsRate.max}
              step={RANGES.sellingCostsRate.step}
              tooltip={TOOLTIPS.sellingCosts}
            />
          </div>
        </div>
      )}

      {hasCustomAssumptions && (
        <div className="flex justify-end pt-4 border-t">
          <button
            type="button"
            onClick={handleReset}
            className="btn-secondary text-sm"
          >
            Reset to Sydney Defaults
          </button>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
        <p className="font-medium text-gray-700 mb-2">Sydney Market Defaults</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <span>Capital growth: 4%</span>
          <span>Rent growth: 2.5%</span>
          <span>Rental yield: 4.5%</span>
          <span>Interest rate: 6.5%</span>
          {expertMode && (
            <>
              <span>Max LVR: 80%</span>
              <span>IO period: 5 years</span>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
