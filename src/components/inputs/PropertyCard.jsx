import React from 'react'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import { calculateLVR, calculateEquity } from '../../utils/calculations'

export default function PropertyCard({ property, onEdit, onDelete }) {
  const equity = calculateEquity(property.currentValue, property.loanAmount)
  const lvr = calculateLVR(property.loanAmount, property.currentValue)

  const lvrColor = lvr > 0.8 ? 'text-red-600' : lvr > 0.7 ? 'text-amber-600' : 'text-green-600'

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 truncate">
            {property.name || 'Unnamed Property'}
          </h4>
          {property.purchasePrice && (
            <p className="text-sm text-gray-500">
              Purchased for {formatCurrency(property.purchasePrice)}
            </p>
          )}
        </div>
        <div className="flex items-center gap-1 ml-2">
          <button
            type="button"
            onClick={() => onEdit(property)}
            className="p-1.5 text-gray-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
            aria-label="Edit property"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => onDelete(property.id)}
            className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            aria-label="Delete property"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Value</p>
          <p className="text-lg font-semibold text-gray-900">{formatCurrency(property.currentValue)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Equity</p>
          <p className="text-lg font-semibold text-green-600">{formatCurrency(equity)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">Loan</p>
          <p className="text-sm font-medium text-gray-700">{formatCurrency(property.loanAmount)}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide">LVR</p>
          <p className={`text-sm font-medium ${lvrColor}`}>{formatPercent(lvr)}</p>
        </div>
      </div>

      {property.annualRent > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-500">Annual Rent: {formatCurrency(property.annualRent)}</p>
        </div>
      )}
    </div>
  )
}
