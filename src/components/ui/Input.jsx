import React, { useState } from 'react'
import { InfoIcon } from './Tooltip'

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  helpText,
  tooltip,
  error,
  prefix,
  suffix,
  min,
  max,
  step,
  disabled = false,
  className = '',
  id,
  name,
  clearZeroOnFocus = false,
}) {
  const inputId = id || name || label?.toLowerCase().replace(/\s+/g, '-')
  const [displayValue, setDisplayValue] = useState(value?.toString() || '')
  const [isFocused, setIsFocused] = useState(false)

  const handleChange = (e) => {
    const rawValue = e.target.value
    setDisplayValue(rawValue)

    if (type === 'number') {
      const parsed = parseFloat(rawValue)
      onChange(isNaN(parsed) ? 0 : parsed)
    } else {
      onChange(rawValue)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
    // Clear the display if value is 0 and clearZeroOnFocus is enabled
    if (clearZeroOnFocus && (value === 0 || value === '0')) {
      setDisplayValue('')
    } else {
      setDisplayValue(value?.toString() || '')
    }
  }

  const handleBlur = () => {
    setIsFocused(false)
    // Reset display to actual value on blur
    setDisplayValue(value?.toString() || '0')
  }

  // Use displayValue when focused, otherwise use the prop value
  const shownValue = isFocused ? displayValue : (value?.toString() || '')

  return (
    <div className={className}>
      {label && (
        <label htmlFor={inputId} className="input-label flex items-center">
          {label}
          {tooltip && <InfoIcon tooltip={tooltip} />}
        </label>
      )}
      <div className="relative">
        {prefix && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{prefix}</span>
          </div>
        )}
        <input
          type={type}
          id={inputId}
          name={name}
          value={shownValue}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className={`input-field ${prefix ? 'pl-7' : ''} ${suffix ? 'pr-12' : ''} ${
            error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''
          }`}
        />
        {suffix && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{suffix}</span>
          </div>
        )}
      </div>
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  )
}

export function CurrencyInput({ label, value, onChange, tooltip, helpText, error, min = 0, ...props }) {
  return (
    <Input
      type="number"
      label={label}
      value={value}
      onChange={onChange}
      prefix="$"
      tooltip={tooltip}
      helpText={helpText}
      error={error}
      min={min}
      step={1000}
      clearZeroOnFocus={true}
      {...props}
    />
  )
}

export function PercentInput({ label, value, onChange, tooltip, helpText, error, min = 0, max = 100, ...props }) {
  // Value is stored as decimal (0.05 = 5%), but displayed as percentage (5)
  const displayValue = (value * 100).toFixed(1)

  const handleChange = (newValue) => {
    onChange(newValue / 100)
  }

  return (
    <Input
      type="number"
      label={label}
      value={displayValue}
      onChange={handleChange}
      suffix="%"
      tooltip={tooltip}
      helpText={helpText}
      error={error}
      min={min}
      max={max}
      step={0.1}
      {...props}
    />
  )
}
