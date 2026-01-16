import React from 'react'
import { useCalculations } from '../../hooks/useCalculations'
import { formatCurrency, formatPercent } from '../../utils/formatters'
import Card from '../ui/Card'

export default function PayoffSchedule() {
  const { saleScenario, targetYears } = useCalculations()

  if (!saleScenario) {
    return (
      <Card title="Strategic Sale Plan">
        <div className="py-8 text-center text-gray-500">
          Add properties to see your strategic sale plan
        </div>
      </Card>
    )
  }

  const { propertiesToSell, debtFreeProperties, summary } = saleScenario

  return (
    <Card
      title="Strategic Sale Plan"
      subtitle={`Year ${targetYears} scenario`}
    >
      <div className="space-y-6">
        {/* Properties to Sell */}
        {propertiesToSell.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full"></span>
              Properties to Sell ({propertiesToSell.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 font-medium">Property</th>
                    <th className="pb-2 font-medium text-right">Projected Value</th>
                    <th className="pb-2 font-medium text-right">Loan Balance</th>
                    <th className="pb-2 font-medium text-right">Net Proceeds</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {propertiesToSell.map((property, index) => (
                    <tr key={property.id || index}>
                      <td className="py-2 text-gray-900">{property.name || `Property ${index + 1}`}</td>
                      <td className="py-2 text-right">{formatCurrency(property.currentValue)}</td>
                      <td className="py-2 text-right text-red-600">{formatCurrency(property.loanAmount)}</td>
                      <td className="py-2 text-right font-medium text-green-600">
                        {formatCurrency(property.currentValue - property.loanAmount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-200">
                  <tr className="font-medium">
                    <td className="pt-2">Total</td>
                    <td className="pt-2 text-right">{formatCurrency(summary.totalSaleProceeds)}</td>
                    <td className="pt-2 text-right text-red-600">
                      {formatCurrency(propertiesToSell.reduce((sum, p) => sum + p.loanAmount, 0))}
                    </td>
                    <td className="pt-2 text-right text-green-600">
                      {formatCurrency(summary.totalSaleProceeds - propertiesToSell.reduce((sum, p) => sum + p.loanAmount, 0))}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Debt-Free Properties */}
        {debtFreeProperties.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              Debt-Free Portfolio ({debtFreeProperties.length})
            </h4>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-2 font-medium">Property</th>
                    <th className="pb-2 font-medium text-right">Value</th>
                    <th className="pb-2 font-medium text-right">Annual Rent</th>
                    <th className="pb-2 font-medium text-right">Yield</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {debtFreeProperties.map((property, index) => (
                    <tr key={property.id || index}>
                      <td className="py-2 text-gray-900">{property.name || `Property ${index + 1}`}</td>
                      <td className="py-2 text-right">{formatCurrency(property.currentValue)}</td>
                      <td className="py-2 text-right text-green-600">{formatCurrency(property.annualRent)}</td>
                      <td className="py-2 text-right">{formatPercent(property.annualRent / property.currentValue)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="border-t-2 border-gray-200">
                  <tr className="font-medium">
                    <td className="pt-2">Total</td>
                    <td className="pt-2 text-right">
                      {formatCurrency(debtFreeProperties.reduce((sum, p) => sum + p.currentValue, 0))}
                    </td>
                    <td className="pt-2 text-right text-green-600">
                      {formatCurrency(debtFreeProperties.reduce((sum, p) => sum + p.annualRent, 0))}
                    </td>
                    <td className="pt-2 text-right">-</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 mb-3">Transaction Summary</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-gray-500">Properties Sold</p>
              <p className="font-semibold">{summary.propertiesSold}</p>
            </div>
            <div>
              <p className="text-gray-500">Properties Kept</p>
              <p className="font-semibold">{summary.propertiesKept}</p>
            </div>
            <div>
              <p className="text-gray-500">Total Sale Proceeds</p>
              <p className="font-semibold">{formatCurrency(summary.totalSaleProceeds)}</p>
            </div>
            <div>
              <p className="text-gray-500">Debt Cleared</p>
              <p className="font-semibold text-green-600">{formatCurrency(summary.debtCleared)}</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
