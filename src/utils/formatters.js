/**
 * Format number as Australian currency
 */
export function formatCurrency(value, compact = false) {
  if (value === null || value === undefined || isNaN(value)) return '$0'

  if (compact && Math.abs(value) >= 1000000) {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      notation: 'compact',
      compactDisplay: 'short',
      minimumFractionDigits: 1,
      maximumFractionDigits: 1
    }).format(value)
  }

  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value)
}

/**
 * Format number as percentage
 */
export function formatPercent(value, decimals = 1) {
  if (value === null || value === undefined || isNaN(value)) return '0%'

  return new Intl.NumberFormat('en-AU', {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Format number with thousands separator
 */
export function formatNumber(value, decimals = 0) {
  if (value === null || value === undefined || isNaN(value)) return '0'

  return new Intl.NumberFormat('en-AU', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  }).format(value)
}

/**
 * Parse currency string to number
 */
export function parseCurrency(value) {
  if (typeof value === 'number') return value
  if (!value) return 0

  // Remove currency symbols, commas, and spaces
  const cleaned = value.toString().replace(/[$,\s]/g, '')
  const number = parseFloat(cleaned)

  return isNaN(number) ? 0 : number
}

/**
 * Parse percentage string to decimal
 */
export function parsePercent(value) {
  if (typeof value === 'number') return value
  if (!value) return 0

  // Remove % sign and spaces
  const cleaned = value.toString().replace(/[%\s]/g, '')
  const number = parseFloat(cleaned)

  return isNaN(number) ? 0 : number / 100
}

/**
 * Format date for display
 */
export function formatDate(date) {
  if (!date) return ''

  return new Intl.DateTimeFormat('en-AU', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

/**
 * Get ordinal suffix for a number (1st, 2nd, 3rd, etc.)
 */
export function getOrdinal(n) {
  const s = ['th', 'st', 'nd', 'rd']
  const v = n % 100
  return n + (s[(v - 20) % 10] || s[v] || s[0])
}

/**
 * Format years with singular/plural
 */
export function formatYears(years) {
  return years === 1 ? '1 year' : `${years} years`
}

/**
 * Format property count with singular/plural
 */
export function formatPropertyCount(count) {
  return count === 1 ? '1 property' : `${count} properties`
}
