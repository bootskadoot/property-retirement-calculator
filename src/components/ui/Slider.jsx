import React from 'react'
import { InfoIcon } from './Tooltip'
import { formatCurrency, formatPercent } from '../../utils/formatters'

export default function Slider({
  label,
  value,
  onChange,
  min,
  max,
  step,
  tooltip,
  formatValue,
  showMinMax = true,
  className = '',
}) {
  const percentage = ((value - min) / (max - min)) * 100

  const displayValue = formatValue ? formatValue(value) : value

  return (
    <div className={className}>
      {label && (
        <div className="flex items-center justify-between mb-1">
          <label className="input-label flex items-center mb-0">
            {label}
            {tooltip && <InfoIcon tooltip={tooltip} />}
          </label>
        </div>
      )}
      {/* Current value - prominent display */}
      <div className="flex items-center gap-3 mb-2">
        <span className="text-lg font-semibold text-gray-900 bg-primary-50 px-3 py-1 rounded-lg border border-primary-200">
          {displayValue}
        </span>
      </div>
      <div className="relative">
        <input
          type="range"
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
          style={{
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`
          }}
        />
      </div>
      {showMinMax && (
        <div className="flex justify-between mt-1">
          <span className="text-xs text-gray-400">{formatValue ? formatValue(min) : min}</span>
          <span className="text-xs text-gray-400">{formatValue ? formatValue(max) : max}</span>
        </div>
      )}
    </div>
  )
}

export function CurrencySlider({ label, value, onChange, min, max, step, tooltip, ...props }) {
  return (
    <Slider
      label={label}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      tooltip={tooltip}
      formatValue={(v) => formatCurrency(v, true)}
      {...props}
    />
  )
}

export function PercentSlider({ label, value, onChange, min, max, step, tooltip, ...props }) {
  return (
    <Slider
      label={label}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      tooltip={tooltip}
      formatValue={(v) => formatPercent(v)}
      {...props}
    />
  )
}

export function YearSlider({ label, value, onChange, min, max, step = 1, tooltip, ...props }) {
  return (
    <Slider
      label={label}
      value={value}
      onChange={onChange}
      min={min}
      max={max}
      step={step}
      tooltip={tooltip}
      formatValue={(v) => `${v} years`}
      {...props}
    />
  )
}
