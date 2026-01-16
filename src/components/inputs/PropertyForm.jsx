import React, { useState, useEffect } from 'react'
import { CurrencyInput } from '../ui/Input'
import { TOOLTIPS } from '../../utils/constants'

const emptyProperty = {
  name: '',
  purchasePrice: 0,
  currentValue: 0,
  loanAmount: 0,
  equity: 0,
  annualRent: 0,
}

export default function PropertyForm({ property, onSave, onCancel }) {
  const [formData, setFormData] = useState(emptyProperty)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (property) {
      setFormData({
        ...emptyProperty,
        ...property,
      })
    } else {
      setFormData(emptyProperty)
    }
  }, [property])

  const handleChange = (field, value) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value }

      // Auto-calculate equity
      if (field === 'currentValue' || field === 'loanAmount') {
        updated.equity = Math.max(0, (field === 'currentValue' ? value : prev.currentValue) -
                                       (field === 'loanAmount' ? value : prev.loanAmount))
      }

      // Set currentValue to purchasePrice if not set
      if (field === 'purchasePrice' && !prev.currentValue) {
        updated.currentValue = value
        updated.equity = Math.max(0, value - prev.loanAmount)
      }

      return updated
    })

    // Clear error when field is modified
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.currentValue || formData.currentValue <= 0) {
      newErrors.currentValue = 'Current value is required'
    }

    if (formData.loanAmount < 0) {
      newErrors.loanAmount = 'Loan amount cannot be negative'
    }

    if (formData.loanAmount > formData.currentValue) {
      newErrors.loanAmount = 'Loan cannot exceed property value'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    onSave({
      ...formData,
      name: formData.name || `Property ${Date.now()}`,
      purchasePrice: formData.purchasePrice || formData.currentValue,
    })

    setFormData(emptyProperty)
  }

  const isEditing = !!property?.id

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="input-label">Property Name (Optional)</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., 123 Main St, Sydney"
          className="input-field"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CurrencyInput
          label="Purchase Price"
          value={formData.purchasePrice}
          onChange={(v) => handleChange('purchasePrice', v)}
          tooltip="Original purchase price of the property"
          error={errors.purchasePrice}
        />

        <CurrencyInput
          label="Current Value"
          value={formData.currentValue}
          onChange={(v) => handleChange('currentValue', v)}
          tooltip="Estimated current market value"
          error={errors.currentValue}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CurrencyInput
          label="Loan Amount"
          value={formData.loanAmount}
          onChange={(v) => handleChange('loanAmount', v)}
          tooltip={TOOLTIPS.equity}
          error={errors.loanAmount}
        />

        <CurrencyInput
          label="Current Equity"
          value={formData.equity}
          onChange={(v) => handleChange('equity', v)}
          tooltip={TOOLTIPS.equity}
          disabled
        />
      </div>

      <CurrencyInput
        label="Annual Rental Income (Optional)"
        value={formData.annualRent}
        onChange={(v) => handleChange('annualRent', v)}
        tooltip="Gross annual rental income. If not provided, will be estimated using assumptions."
        helpText="Leave at 0 to use default rental yield assumptions"
      />

      <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
        {onCancel && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
        <button type="submit" className="btn-primary">
          {isEditing ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </form>
  )
}
