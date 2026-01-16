import React from 'react'
import { CurrencyInput } from '../ui/Input'
import { CurrencySlider } from '../ui/Slider'
import { useCalculator, actions } from '../../context/CalculatorContext'
import { formatCurrency } from '../../utils/formatters'

export default function CashPositionForm() {
  const { state, dispatch } = useCalculator()

  const handleChange = (field, value) => {
    dispatch(actions.setCashPosition({ [field]: value }))
  }

  // Ensure allocated doesn't exceed reserves
  const handleAllocatedChange = (value) => {
    const capped = Math.min(value, state.cashReserves)
    handleChange('cashAllocated', capped)
  }

  const buffer = state.cashReserves - state.cashAllocated

  return (
    <div className="space-y-6">
      <CurrencyInput
        label="Total Cash Reserves"
        value={state.cashReserves}
        onChange={(v) => handleChange('cashReserves', v)}
        tooltip="Total liquid cash available for investment"
        helpText="Include savings, offset accounts, and accessible funds"
      />

      {state.cashReserves > 0 && (
        <>
          <CurrencySlider
            label="Amount to Allocate to Strategy"
            value={state.cashAllocated}
            onChange={handleAllocatedChange}
            min={0}
            max={state.cashReserves}
            step={10000}
            tooltip="How much cash you want to deploy towards property purchases"
          />

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-gray-600">Cash Buffer (Retained)</p>
                <p className="text-lg font-semibold text-gray-900">{formatCurrency(buffer)}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Allocated to Strategy</p>
                <p className="text-lg font-semibold text-primary-600">{formatCurrency(state.cashAllocated)}</p>
              </div>
            </div>
            {buffer < 50000 && state.cashReserves > 50000 && (
              <p className="mt-3 text-sm text-amber-600">
                Consider keeping at least $50,000 as an emergency buffer.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  )
}
