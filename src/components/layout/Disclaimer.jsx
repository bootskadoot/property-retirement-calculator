import React, { useState } from 'react'

export default function Disclaimer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-amber-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-amber-800">Important Disclaimer</h4>
          <p className="mt-1 text-sm text-amber-700">
            This calculator is for illustration and planning purposes only.
            {!isExpanded && (
              <button
                type="button"
                onClick={() => setIsExpanded(true)}
                className="ml-1 text-amber-800 underline hover:no-underline"
              >
                Read more
              </button>
            )}
          </p>
          {isExpanded && (
            <div className="mt-2 text-sm text-amber-700 space-y-2">
              <p>Actual results will vary based on market conditions, interest rates, and personal circumstances.</p>
              <p>The calculator uses broad assumptions and may not reflect specific suburbs or property types.</p>
              <p>Please consult with qualified financial advisors and accountants before making investment decisions.</p>
              <p>Past property performance does not guarantee future results.</p>
              <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-amber-800 underline hover:no-underline"
              >
                Show less
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export function WarningBanner({ warnings }) {
  if (!warnings || warnings.length === 0) return null

  return (
    <div className="space-y-2 mb-4">
      {warnings.map((warning, index) => (
        <div
          key={index}
          className={`rounded-lg p-3 text-sm ${
            warning.level === 'error'
              ? 'bg-red-50 border border-red-200 text-red-700'
              : 'bg-amber-50 border border-amber-200 text-amber-700'
          }`}
        >
          <div className="flex items-start gap-2">
            <svg className="w-4 h-4 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <span>{warning.message}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
