import { DEFAULTS } from './constants'

/**
 * Calculate property value after appreciation
 */
export function calculateFutureValue(currentValue, appreciationRate, years) {
  return currentValue * Math.pow(1 + appreciationRate, years)
}

/**
 * Calculate equity for a property at a given point
 */
export function calculateEquity(propertyValue, loanAmount) {
  return Math.max(0, propertyValue - loanAmount)
}

/**
 * Calculate LVR (Loan to Value Ratio)
 */
export function calculateLVR(loanAmount, propertyValue) {
  if (propertyValue <= 0) return 0
  return loanAmount / propertyValue
}

/**
 * Calculate extractable equity (available for refinancing)
 */
export function calculateExtractableEquity(propertyValue, currentLoan, maxLVR = DEFAULTS.maxInvestmentLVR) {
  const maxLoan = propertyValue * maxLVR
  return Math.max(0, maxLoan - currentLoan)
}

/**
 * Calculate total purchase costs for a new property
 */
export function calculatePurchaseCosts(
  propertyPrice,
  stampDutyRate = DEFAULTS.stampDutyRate,
  otherCosts = DEFAULTS.purchaseCosts,
  buyersAgentFee = DEFAULTS.buyersAgentFee
) {
  const stampDuty = propertyPrice * stampDutyRate
  const fees = propertyPrice * otherCosts
  return stampDuty + fees + buyersAgentFee
}

/**
 * Calculate deposit required to purchase a property
 */
export function calculateDepositRequired(
  propertyPrice,
  maxLVR = DEFAULTS.maxInvestmentLVR,
  stampDutyRate = DEFAULTS.stampDutyRate,
  buyersAgentFee = DEFAULTS.buyersAgentFee
) {
  const deposit = propertyPrice * (1 - maxLVR)
  const costs = calculatePurchaseCosts(propertyPrice, stampDutyRate, DEFAULTS.purchaseCosts, buyersAgentFee)
  return deposit + costs
}

/**
 * Calculate annual rental income for a property
 */
export function calculateAnnualRent(propertyValue, rentalYield = DEFAULTS.rentalYield) {
  return propertyValue * rentalYield
}

/**
 * Calculate annual interest payments (interest-only loan)
 */
export function calculateAnnualInterest(loanAmount, interestRate = DEFAULTS.interestRate) {
  return loanAmount * interestRate
}

/**
 * Calculate annual P&I payment for a loan
 * Returns { annualPayment, principalPortion, interestPortion }
 */
export function calculateAnnualPIPayment(loanAmount, interestRate, remainingYears) {
  if (loanAmount <= 0 || remainingYears <= 0) {
    return { annualPayment: 0, principalPortion: 0, interestPortion: 0 }
  }

  // Monthly rate and payments
  const monthlyRate = interestRate / 12
  const totalPayments = remainingYears * 12

  // PMT formula: M = P * [r(1+r)^n] / [(1+r)^n - 1]
  const monthlyPayment = loanAmount *
    (monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
    (Math.pow(1 + monthlyRate, totalPayments) - 1)

  const annualPayment = monthlyPayment * 12
  const interestPortion = loanAmount * interestRate
  const principalPortion = Math.min(annualPayment - interestPortion, loanAmount)

  return {
    annualPayment,
    principalPortion: Math.max(0, principalPortion),
    interestPortion
  }
}

/**
 * Calculate annual holding costs (management, maintenance, insurance, rates)
 */
export function calculateAnnualHoldingCosts(propertyValue, holdingCostsRate = DEFAULTS.holdingCostsRate) {
  return propertyValue * holdingCostsRate
}

/**
 * Calculate annual cash flow (rent minus interest minus holding costs, adjusted for vacancy)
 */
export function calculateAnnualCashFlow(
  propertyValue,
  loanAmount,
  rentalYield = DEFAULTS.rentalYield,
  interestRate = DEFAULTS.interestRate,
  vacancyRate = DEFAULTS.vacancyRate,
  holdingCostsRate = DEFAULTS.holdingCostsRate
) {
  const grossRent = calculateAnnualRent(propertyValue, rentalYield)
  const effectiveRent = grossRent * (1 - vacancyRate)
  const interest = calculateAnnualInterest(loanAmount, interestRate)
  const holdingCosts = calculateAnnualHoldingCosts(propertyValue, holdingCostsRate)
  return effectiveRent - interest - holdingCosts
}

/**
 * Calculate Capital Gains Tax on property sale
 */
export function calculateCGT(salePrice, costBase, yearsHeld, taxBracket = DEFAULTS.taxBracket) {
  const capitalGain = salePrice - costBase
  if (capitalGain <= 0) return 0

  // 50% CGT discount if held for more than 12 months
  const taxableGain = yearsHeld >= 1 ? capitalGain * DEFAULTS.cgtDiscount : capitalGain
  return taxableGain * taxBracket
}

/**
 * Calculate number of debt-free properties needed for income goal (monthly input)
 */
export function calculatePropertiesNeededForGoal(
  monthlyIncomeGoal,
  averagePropertyValue,
  rentalYield = DEFAULTS.rentalYield,
  taxBracket = DEFAULTS.taxBracket
) {
  const annualIncomeNeeded = monthlyIncomeGoal * 12
  const grossIncomeNeeded = annualIncomeNeeded / (1 - taxBracket)
  const incomePerProperty = averagePropertyValue * rentalYield
  return Math.ceil(grossIncomeNeeded / incomePerProperty)
}

/**
 * Calculate number of debt-free properties needed for income goal (annual input)
 */
export function calculatePropertiesNeededForGoalAnnual(
  annualIncomeGoal,
  averagePropertyValue,
  rentalYield = DEFAULTS.rentalYield,
  taxBracket = DEFAULTS.taxBracket
) {
  const grossIncomeNeeded = annualIncomeGoal / (1 - taxBracket)
  const incomePerProperty = averagePropertyValue * rentalYield
  return Math.ceil(grossIncomeNeeded / incomePerProperty)
}

/**
 * Calculate portfolio totals
 */
export function calculatePortfolioTotals(properties) {
  return properties.reduce((totals, property) => {
    totals.totalValue += property.currentValue || 0
    totals.totalEquity += property.equity || 0
    totals.totalDebt += property.loanAmount || 0
    totals.totalRent += property.annualRent || 0
    return totals
  }, {
    totalValue: 0,
    totalEquity: 0,
    totalDebt: 0,
    totalRent: 0,
    propertyCount: properties.length
  })
}

/**
 * Project a single property forward in time
 */
export function projectProperty(property, years, assumptions) {
  const {
    appreciationRate = DEFAULTS.appreciationRate,
    rentalYield = DEFAULTS.rentalYield,
    interestRate = DEFAULTS.interestRate
  } = assumptions

  const futureValue = calculateFutureValue(property.currentValue, appreciationRate, years)
  const equity = calculateEquity(futureValue, property.loanAmount)
  const annualRent = calculateAnnualRent(futureValue, rentalYield)
  const annualInterest = calculateAnnualInterest(property.loanAmount, interestRate)

  return {
    ...property,
    projectedValue: futureValue,
    projectedEquity: equity,
    projectedRent: annualRent,
    projectedInterest: annualInterest,
    projectedCashFlow: annualRent - annualInterest
  }
}

/**
 * Generate year-by-year portfolio projection
 */
export function generateProjection(properties, cashAvailable, assumptions, targetYears) {
  const {
    appreciationRate = DEFAULTS.appreciationRate,
    rentGrowthRate = DEFAULTS.rentGrowthRate,
    rentalYield = DEFAULTS.rentalYield,
    interestRate = DEFAULTS.interestRate,
    maxLVR = DEFAULTS.maxInvestmentLVR,
    stampDutyRate = DEFAULTS.stampDutyRate,
    refinanceInterval = DEFAULTS.refinanceInterval,
    averagePropertyPrice = DEFAULTS.averagePropertyPrice,
    vacancyRate = DEFAULTS.vacancyRate,
    holdingCostsRate = DEFAULTS.holdingCostsRate,
    buyersAgentFee = DEFAULTS.buyersAgentFee,
    interestOnlyYears = DEFAULTS.interestOnlyYears
  } = assumptions

  // Standard loan term for P&I calculation (30 years minus IO period)
  const standardLoanTerm = 30

  const projection = []
  let currentProperties = properties.map(p => ({
    ...p,
    yearPurchased: 0,
    // Track the starting rent for explicit rent properties
    baseRentAtPurchase: p.annualRent || 0,
    // Track the starting value for yield-based rent properties
    baseValueAtPurchase: p.currentValue || 0
  }))
  let accumulatedCash = cashAvailable

  for (let year = 0; year <= targetYears; year++) {
    // Calculate current year values for all properties
    const yearProperties = currentProperties.map(property => {
      const yearsHeld = year - (property.yearPurchased || 0)
      const currentValue = calculateFutureValue(property.purchasePrice, appreciationRate, yearsHeld)
      const loanAge = yearsHeld // Years since loan was taken out

      // Determine if we're in IO or P&I phase
      const isInterestOnly = loanAge < interestOnlyYears
      let annualInterest, principalPayment, totalLoanPayment

      if (isInterestOnly || property.loanAmount <= 0) {
        // Interest-only phase
        annualInterest = calculateAnnualInterest(property.loanAmount, interestRate)
        principalPayment = 0
        totalLoanPayment = annualInterest
      } else {
        // P&I phase - calculate remaining loan term
        const yearsInPI = loanAge - interestOnlyYears
        const remainingLoanYears = Math.max(1, standardLoanTerm - interestOnlyYears - yearsInPI)
        const piPayment = calculateAnnualPIPayment(property.loanAmount, interestRate, remainingLoanYears)
        annualInterest = piPayment.interestPortion
        principalPayment = piPayment.principalPortion
        totalLoanPayment = piPayment.annualPayment
      }

      const equity = calculateEquity(currentValue, property.loanAmount)

      // Use explicit rent if provided and > 0, otherwise calculate from yield
      // For future years, grow rent with rentGrowthRate (not property value)
      const baseRent = property.baseRentAtPurchase || 0
      let grossRent
      if (baseRent > 0) {
        // User entered explicit rent - grow it by rent growth rate
        grossRent = baseRent * Math.pow(1 + rentGrowthRate, yearsHeld)
      } else {
        // Calculate from yield on initial value, then grow by rent growth rate
        const initialRent = property.baseValueAtPurchase * rentalYield
        grossRent = initialRent * Math.pow(1 + rentGrowthRate, yearsHeld)
      }

      // Apply vacancy rate to get effective rent
      const annualRent = grossRent * (1 - vacancyRate)
      const holdingCosts = calculateAnnualHoldingCosts(currentValue, holdingCostsRate)

      return {
        ...property,
        currentValue,
        equity,
        grossRent,
        annualRent,
        annualInterest,
        principalPayment,
        totalLoanPayment,
        holdingCosts,
        isInterestOnly,
        loanAge,
        cashFlow: annualRent - totalLoanPayment - holdingCosts,
        lvr: calculateLVR(property.loanAmount, currentValue)
      }
    })

    // Calculate totals for this year
    const totals = calculatePortfolioTotals(yearProperties)

    // Calculate extractable equity
    const extractableEquity = yearProperties.reduce((sum, p) => {
      return sum + calculateExtractableEquity(p.currentValue, p.loanAmount, maxLVR)
    }, 0)

    // Calculate how many new properties could be purchased
    const depositRequired = calculateDepositRequired(averagePropertyPrice, maxLVR, stampDutyRate, buyersAgentFee)
    const availableFunds = extractableEquity + accumulatedCash
    const newPropertiesPossible = Math.floor(availableFunds / depositRequired)

    // Can we buy properties this year?
    // Year 0: Can buy with cash only (no refinancing needed)
    // Other years: Can buy at refinance intervals using cash + extracted equity
    const isRefinanceYear = year > 0 && year % refinanceInterval === 0
    const canPurchaseYear0 = year === 0 && accumulatedCash >= depositRequired
    const canPurchase = canPurchaseYear0 || isRefinanceYear
    let propertiesPurchased = 0
    let refinanceAmount = 0
    let cashUsed = 0

    if (canPurchase && newPropertiesPossible > 0) {
      // Purchase new properties
      propertiesPurchased = Math.min(newPropertiesPossible, 3) // Cap at 3 per interval for realism
      const totalCost = propertiesPurchased * depositRequired

      // Use cash first, then refinance
      if (accumulatedCash >= totalCost) {
        cashUsed = totalCost
        accumulatedCash -= totalCost
      } else {
        cashUsed = accumulatedCash
        refinanceAmount = totalCost - accumulatedCash
        accumulatedCash = 0

        // Update property loans based on refinance
        let remainingRefinance = refinanceAmount
        for (const property of yearProperties) {
          const extractable = calculateExtractableEquity(property.currentValue, property.loanAmount, maxLVR)
          const toExtract = Math.min(extractable, remainingRefinance)
          if (toExtract > 0) {
            property.loanAmount += toExtract
            // Recalculate equity after increasing loan
            property.equity = calculateEquity(property.currentValue, property.loanAmount)
            property.lvr = calculateLVR(property.loanAmount, property.currentValue)
            remainingRefinance -= toExtract
          }
          if (remainingRefinance <= 0) break
        }
      }

      // Add new properties
      const newProperties = []
      for (let i = 0; i < propertiesPurchased; i++) {
        const newLoan = averagePropertyPrice * maxLVR
        newProperties.push({
          id: `new-${year}-${i}`,
          name: `Property ${currentProperties.length + i + 1} (Year ${year})`,
          purchasePrice: averagePropertyPrice,
          currentValue: averagePropertyPrice,
          loanAmount: newLoan,
          equity: averagePropertyPrice - newLoan,
          yearPurchased: year,
          baseValueAtPurchase: averagePropertyPrice,
          baseRentAtPurchase: 0 // Will use yield-based calculation
        })
      }
      // Add new properties to yearProperties for this year's snapshot
      yearProperties.push(...newProperties.map(p => {
        const grossRent = calculateAnnualRent(p.currentValue, rentalYield)
        const effectiveRent = grossRent * (1 - vacancyRate)
        const interest = calculateAnnualInterest(p.loanAmount, interestRate)
        const holding = calculateAnnualHoldingCosts(p.currentValue, holdingCostsRate)
        return {
          ...p,
          grossRent,
          annualRent: effectiveRent,
          annualInterest: interest,
          principalPayment: 0, // New properties start in IO period
          totalLoanPayment: interest,
          holdingCosts: holding,
          isInterestOnly: true,
          loanAge: 0,
          cashFlow: effectiveRent - interest - holding,
          lvr: calculateLVR(p.loanAmount, p.currentValue)
        }
      }))
    }

    // Accumulate cash flow (positive or negative)
    // Negative cash flow from holding properties reduces available funds
    const totalCashFlow = yearProperties.reduce((sum, p) => sum + p.cashFlow, 0)
    accumulatedCash += totalCashFlow
    // Don't let cash go negative - assume investor covers shortfall from income
    if (accumulatedCash < 0) {
      accumulatedCash = 0
    }

    // Recalculate totals to include any new properties
    const finalTotals = calculatePortfolioTotals(yearProperties)

    projection.push({
      year,
      properties: yearProperties,
      totals: {
        ...finalTotals,
        extractableEquity,
        availableFunds,
        accumulatedCash
      },
      events: {
        canRefinance: isRefinanceYear,
        propertiesPurchased,
        refinanceAmount,
        cashUsed,
        newPropertiesPossible
      }
    })

    // Update currentProperties with updated loan amounts AND new properties
    // Apply principal payments to reduce loan amounts for next year
    currentProperties = yearProperties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      // Reduce loan by principal payment made this year
      loanAmount: Math.max(0, p.loanAmount - (p.principalPayment || 0)),
      // Preserve base values for rent calculations
      baseValueAtPurchase: p.baseValueAtPurchase || p.currentValue,
      baseRentAtPurchase: p.baseRentAtPurchase || 0
    }))
  }

  return projection
}

/**
 * Calculate strategic sale scenario to maximize debt-free properties
 * Strategy: Sell enough properties to own the remaining ones 100% debt-free
 */
export function calculateStrategicSaleScenario(projection, monthlyIncomeGoal, assumptions, targetYears) {
  const {
    rentalYield = DEFAULTS.rentalYield,
    interestRate = DEFAULTS.interestRate,
    taxBracket = DEFAULTS.taxBracket,
    vacancyRate = DEFAULTS.vacancyRate,
    holdingCostsRate = DEFAULTS.holdingCostsRate,
    sellingCostsRate = DEFAULTS.sellingCostsRate
  } = assumptions

  const finalYear = projection[projection.length - 1]
  const allProperties = [...finalYear.properties]

  // Helper to calculate CGT for a property
  const getCGT = (property) => {
    const costBase = property.purchasePrice || property.currentValue
    const yearsHeld = (targetYears || 15) - (property.yearPurchased || 0)
    return calculateCGT(property.currentValue, costBase, yearsHeld, taxBracket)
  }

  // Helper to calculate selling costs (agent commission, conveyancing, marketing)
  const getSellingCosts = (property) => {
    return property.currentValue * sellingCostsRate
  }

  // Helper to calculate rent components
  const getRentBreakdown = (value) => {
    const grossRent = calculateAnnualRent(value, rentalYield)
    const effectiveRent = grossRent * (1 - vacancyRate)
    const holdingCosts = calculateAnnualHoldingCosts(value, holdingCostsRate)
    const netRent = effectiveRent - holdingCosts
    return { grossRent, netRent, holdingCosts }
  }

  // Sort by value (keep highest value for income generation)
  const propertiesByValue = [...allProperties].sort((a, b) => b.currentValue - a.currentValue)

  // Find maximum number of properties we can keep debt-free
  // Try keeping N properties (highest value), sell the rest
  let bestScenario = null

  for (let keepCount = allProperties.length; keepCount >= 0; keepCount--) {
    const toKeep = propertiesByValue.slice(0, keepCount)
    const toSell = propertiesByValue.slice(keepCount)

    // Calculate debt on properties we want to keep
    const debtToPayOff = toKeep.reduce((sum, p) => sum + p.loanAmount, 0)

    // Calculate net proceeds from selling the rest
    let grossProceeds = 0
    let totalCGT = 0
    let totalSellingCosts = 0
    let debtOnSold = 0

    for (const p of toSell) {
      grossProceeds += p.currentValue
      totalCGT += getCGT(p)
      totalSellingCosts += getSellingCosts(p)
      debtOnSold += p.loanAmount
    }

    // Net proceeds = gross - debt - CGT - selling costs
    const netProceeds = grossProceeds - debtOnSold - totalCGT - totalSellingCosts

    // Can we pay off all debt on kept properties?
    if (netProceeds >= debtToPayOff) {
      // This scenario works! All kept properties will be debt-free
      const surplusCash = netProceeds - debtToPayOff

      const debtFreeProperties = toKeep.map(p => {
        const { grossRent, netRent } = getRentBreakdown(p.currentValue)
        return {
          ...p,
          loanAmount: 0,
          grossRent,
          annualRent: netRent,
          cashFlow: netRent,
          isDebtFree: true
        }
      })

      const propertiesToSell = toSell.map(p => ({
        ...p,
        cgt: getCGT(p),
        sellingCosts: getSellingCosts(p),
        netProceeds: p.currentValue - p.loanAmount - getCGT(p) - getSellingCosts(p)
      }))

      bestScenario = {
        debtFreeProperties,
        propertiesToSell,
        grossSaleProceeds: grossProceeds,
        totalCGT,
        totalSellingCosts,
        netSaleProceeds: netProceeds,
        debtCleared: debtToPayOff,
        surplusCash
      }
      break // Found the best (maximum properties kept)
    }
  }

  // If no scenario works (can't even keep 0 properties debt-free),
  // fall back to selling everything
  if (!bestScenario) {
    let totalSellingCosts = 0
    const allSold = propertiesByValue.map(p => {
      const sellingCosts = getSellingCosts(p)
      totalSellingCosts += sellingCosts
      return {
        ...p,
        cgt: getCGT(p),
        sellingCosts,
        netProceeds: p.currentValue - p.loanAmount - getCGT(p) - sellingCosts
      }
    })

    let grossProceeds = 0
    let totalCGT = 0
    for (const p of allSold) {
      grossProceeds += p.currentValue
      totalCGT += p.cgt
    }

    bestScenario = {
      debtFreeProperties: [],
      propertiesToSell: allSold,
      grossSaleProceeds: grossProceeds,
      totalCGT,
      totalSellingCosts,
      netSaleProceeds: grossProceeds - allProperties.reduce((sum, p) => sum + p.loanAmount, 0) - totalCGT - totalSellingCosts,
      debtCleared: 0,
      surplusCash: 0
    }
  }

  const { debtFreeProperties, propertiesToSell, grossSaleProceeds, totalCGT, totalSellingCosts, netSaleProceeds, surplusCash } = bestScenario

  // Calculate final income - all kept properties are now 100% debt-free
  const totalGrossRent = debtFreeProperties.reduce((sum, p) => sum + (p.grossRent || 0), 0)
  const totalNetRent = debtFreeProperties.reduce((sum, p) => sum + p.annualRent, 0) // After vacancy + holding costs
  const totalNetCashFlow = totalNetRent // No interest since all are debt-free!

  // With new algorithm, all kept properties are truly debt-free
  const trulyDebtFreeCount = debtFreeProperties.length
  const propertiesWithDebtCount = 0
  const remainingDebt = 0

  // After-tax income on rental income
  const afterTaxIncome = totalNetCashFlow * (1 - taxBracket)
  const monthlyIncome = afterTaxIncome / 12

  // Check if goal is achievable
  const goalAchieved = monthlyIncome >= monthlyIncomeGoal
  const shortfall = goalAchieved ? 0 : monthlyIncomeGoal - monthlyIncome
  const surplus = goalAchieved ? monthlyIncome - monthlyIncomeGoal : 0

  return {
    // All kept properties are 100% debt-free
    debtFreeProperties,
    keptProperties: debtFreeProperties,
    trulyDebtFreeCount,
    propertiesWithDebtCount,
    propertiesToSell,
    totalPropertiesAtPeak: allProperties.length,
    totalGrossRent,
    totalNetRent,
    totalNetCashFlow,
    totalAnnualIncome: totalNetCashFlow,
    remainingDebt,
    surplusCash,
    afterTaxIncome,
    monthlyIncome,
    goalAchieved,
    shortfall,
    surplus,
    totalCGT,
    totalSellingCosts,
    summary: {
      propertiesKept: debtFreeProperties.length,
      trulyDebtFree: trulyDebtFreeCount,
      withRemainingDebt: 0,
      propertiesSold: propertiesToSell.length,
      totalPropertiesAtPeak: allProperties.length,
      grossSaleProceeds,
      totalCGT,
      totalSellingCosts,
      netSaleProceeds,
      debtCleared: bestScenario.debtCleared,
      surplusCash
    }
  }
}

/**
 * Calculate sensitivity analysis - how changes affect outcome
 */
export function calculateSensitivity(baseProjection, baseAssumptions, monthlyIncomeGoal, variable, range) {
  const results = []
  const { min, max, step } = range

  for (let value = min; value <= max; value += step) {
    const modifiedAssumptions = {
      ...baseAssumptions,
      [variable]: value
    }

    // For simplicity, we'll just recalculate the final scenario
    // A full implementation would regenerate the entire projection
    const baseScenario = calculateStrategicSaleScenario(baseProjection, monthlyIncomeGoal, modifiedAssumptions)

    results.push({
      value,
      monthlyIncome: baseScenario.monthlyIncome,
      goalAchieved: baseScenario.goalAchieved,
      propertiesKept: baseScenario.debtFreeProperties.length
    })
  }

  return results
}

/**
 * Validate assumptions and return warnings
 */
export function validateAssumptions(assumptions) {
  const warnings = []

  if (assumptions.appreciationRate > 0.06) {
    warnings.push({
      level: 'warning',
      message: `${(assumptions.appreciationRate * 100).toFixed(1)}% annual appreciation is above typical Sydney benchmarks (3-5%). Consider using a more conservative estimate.`
    })
  }

  if (assumptions.appreciationRate > 0.08) {
    warnings.push({
      level: 'error',
      message: `${(assumptions.appreciationRate * 100).toFixed(1)}% annual appreciation is very optimistic. Sustained growth at this rate is historically rare.`
    })
  }

  if (assumptions.rentalYield > 0.06) {
    warnings.push({
      level: 'warning',
      message: `${(assumptions.rentalYield * 100).toFixed(1)}% rental yield is higher than typical Sydney returns (3-5%).`
    })
  }

  if (assumptions.interestRate < 0.05) {
    warnings.push({
      level: 'warning',
      message: `${(assumptions.interestRate * 100).toFixed(1)}% interest rate is below current market rates. Consider using a higher rate for planning.`
    })
  }

  return warnings
}

/**
 * Generate actionable insights based on the projection
 */
export function generateActionableInsights(projection, saleScenario, assumptions, cashAllocated, annualIncomeGoal) {
  const insights = []
  const {
    averagePropertyPrice = DEFAULTS.averagePropertyPrice,
    maxLVR = DEFAULTS.maxInvestmentLVR,
    stampDutyRate = DEFAULTS.stampDutyRate,
    interestRate = DEFAULTS.interestRate,
    refinanceInterval = DEFAULTS.refinanceInterval,
    buyersAgentFee = DEFAULTS.buyersAgentFee
  } = assumptions

  if (!projection || projection.length === 0) return insights

  const currentYear = projection[0]
  const depositNeeded = calculateDepositRequired(averagePropertyPrice, maxLVR, stampDutyRate, buyersAgentFee)

  // Find first purchase year
  const firstPurchaseYear = projection.find(y => y.events.propertiesPurchased > 0)
  const purchaseYears = projection.filter(y => y.events.propertiesPurchased > 0)

  // Calculate current available funds (cash + extractable equity)
  const currentEquity = currentYear.totals.totalEquity
  const currentDebt = currentYear.totals.totalDebt
  const currentValue = currentYear.totals.totalValue
  const maxBorrowable = currentValue * maxLVR
  const extractableEquity = Math.max(0, maxBorrowable - currentDebt)
  const totalAvailable = cashAllocated + extractableEquity

  // Insight 1: Immediate action based on funding situation
  if (totalAvailable >= depositNeeded) {
    if (cashAllocated >= depositNeeded) {
      insights.push({
        type: 'action',
        priority: 'high',
        icon: 'rocket',
        title: 'Ready to Purchase',
        description: `You have enough cash (${formatCurrency(cashAllocated)}) to cover a ${formatCurrency(averagePropertyPrice)} property deposit. Consider engaging a buyers agent to start your search.`,
        action: 'Start property search'
      })
    } else {
      insights.push({
        type: 'action',
        priority: 'high',
        icon: 'bank',
        title: 'Refinance to Purchase',
        description: `Your current equity allows you to extract ${formatCurrency(extractableEquity)}. Combined with your ${formatCurrency(cashAllocated)} cash, you can fund a new purchase.`,
        action: 'Speak to your broker about refinancing'
      })
    }
  } else {
    const shortfall = depositNeeded - totalAvailable
    if (firstPurchaseYear) {
      insights.push({
        type: 'info',
        priority: 'medium',
        icon: 'clock',
        title: `Next Purchase: Year ${firstPurchaseYear.year}`,
        description: `You need ${formatCurrency(shortfall)} more to reach the ${formatCurrency(depositNeeded)} deposit. Based on equity growth, you'll be ready in ${firstPurchaseYear.year === 0 ? 'now' : `${firstPurchaseYear.year} year${firstPurchaseYear.year > 1 ? 's' : ''}`}.`,
        action: 'Accelerate by saving more cash'
      })
    } else {
      insights.push({
        type: 'warning',
        priority: 'high',
        icon: 'alert',
        title: 'No Purchases Projected',
        description: `You need ${formatCurrency(shortfall)} more to afford a ${formatCurrency(averagePropertyPrice)} property. Consider a lower price point or save more cash.`,
        action: 'Adjust target purchase price or save more'
      })
    }
  }

  // Insight 2: Refinance timing
  const nextRefinanceYear = projection.find((y, i) => i > 0 && y.events.canRefinance)
  if (nextRefinanceYear && !firstPurchaseYear) {
    insights.push({
      type: 'info',
      priority: 'medium',
      icon: 'calendar',
      title: `Refinance Opportunity: Year ${nextRefinanceYear.year}`,
      description: `Your next refinance window is in ${nextRefinanceYear.year} year${nextRefinanceYear.year > 1 ? 's' : ''}. This may unlock equity for your next purchase.`,
      action: 'Mark calendar for broker review'
    })
  }

  // Insight 3: Cash flow situation
  const yearOneCashFlow = currentYear.properties.reduce((sum, p) => sum + (p.cashFlow || 0), 0)
  if (yearOneCashFlow < 0) {
    const monthlyCost = Math.abs(yearOneCashFlow) / 12
    insights.push({
      type: 'warning',
      priority: 'medium',
      icon: 'wallet',
      title: 'Negative Cash Flow',
      description: `Your portfolio currently costs ${formatCurrency(monthlyCost)}/month to hold. Ensure you have sufficient income or savings to cover this.`,
      action: 'Budget for holding costs'
    })
  } else if (yearOneCashFlow > 10000) {
    insights.push({
      type: 'info',
      priority: 'low',
      icon: 'trending-up',
      title: 'Positive Cash Flow',
      description: `Your portfolio generates ${formatCurrency(yearOneCashFlow)}/year positive cash flow. This accumulates toward your next deposit.`,
      action: 'Consider reinvesting surplus'
    })
  }

  // Insight 4: Goal achievement status
  if (saleScenario) {
    if (saleScenario.goalAchieved) {
      insights.push({
        type: 'success',
        priority: 'high',
        icon: 'check-circle',
        title: 'Goal Achievable',
        description: `Your current strategy projects ${formatCurrency(saleScenario.afterTaxIncome)}/year passive income, exceeding your ${formatCurrency(annualIncomeGoal)}/year goal.`,
        action: 'Stay the course'
      })
    } else if (saleScenario.afterTaxIncome > 0) {
      const percentAchieved = Math.round((saleScenario.afterTaxIncome / annualIncomeGoal) * 100)
      insights.push({
        type: 'info',
        priority: 'high',
        icon: 'target',
        title: `${percentAchieved}% of Goal`,
        description: `You're projected to achieve ${formatCurrency(saleScenario.afterTaxIncome)}/year, which is ${formatCurrency(annualIncomeGoal - saleScenario.afterTaxIncome)} short of your goal.`,
        action: 'See gap analysis for options'
      })
    }
  }

  return insights
}

/**
 * Calculate what's needed to close the gap to the goal
 */
export function calculateGapAnalysis(projection, saleScenario, assumptions, cashAllocated, annualIncomeGoal, targetYears) {
  if (!saleScenario || saleScenario.goalAchieved) {
    return null
  }

  const {
    rentalYield = DEFAULTS.rentalYield,
    taxBracket = DEFAULTS.taxBracket,
    appreciationRate = DEFAULTS.appreciationRate,
    averagePropertyPrice = DEFAULTS.averagePropertyPrice,
    maxLVR = DEFAULTS.maxInvestmentLVR,
    stampDutyRate = DEFAULTS.stampDutyRate,
    vacancyRate = DEFAULTS.vacancyRate,
    holdingCostsRate = DEFAULTS.holdingCostsRate,
    buyersAgentFee = DEFAULTS.buyersAgentFee
  } = assumptions

  const incomeShortfall = annualIncomeGoal - (saleScenario.afterTaxIncome || 0)
  const monthlyShortfall = incomeShortfall / 12

  // Calculate properties needed to close the gap
  // Each debt-free property generates: (value * yield * (1-vacancy) - value * holdingCosts) * (1-tax)
  const netYieldAfterCosts = (rentalYield * (1 - vacancyRate)) - holdingCostsRate
  const incomePerProperty = averagePropertyPrice * netYieldAfterCosts * (1 - taxBracket)
  const additionalPropertiesNeeded = incomePerProperty > 0 ? Math.ceil(incomeShortfall / incomePerProperty) : null

  // Calculate additional cash needed
  // More cash = can buy more properties = more income at end
  const depositPerProperty = calculateDepositRequired(averagePropertyPrice, maxLVR, stampDutyRate, buyersAgentFee)
  const additionalCashNeeded = additionalPropertiesNeeded ? additionalPropertiesNeeded * depositPerProperty : null

  // Calculate additional years needed (rough estimate)
  // Each year, equity grows by appreciation. How many years until we can afford another property?
  let additionalYearsNeeded = null
  if (projection.length > 0) {
    const finalYear = projection[projection.length - 1]
    const currentValue = finalYear.totals.totalValue
    const annualEquityGrowth = currentValue * appreciationRate

    // Years until equity growth funds another property
    if (annualEquityGrowth > 0 && depositPerProperty > 0) {
      const yearsPerProperty = depositPerProperty / annualEquityGrowth
      additionalYearsNeeded = Math.ceil((additionalPropertiesNeeded || 1) * yearsPerProperty)
    }
  }

  // What would they actually achieve with current setup?
  const actualOutcome = {
    propertiesKept: saleScenario.debtFreeProperties.length,
    trulyDebtFree: saleScenario.trulyDebtFreeCount,
    withRemainingDebt: saleScenario.propertiesWithDebtCount,
    annualIncome: saleScenario.afterTaxIncome,
    monthlyIncome: saleScenario.monthlyIncome,
    percentOfGoal: Math.round((Math.max(0, saleScenario.afterTaxIncome) / annualIncomeGoal) * 100),
    remainingDebt: saleScenario.remainingDebt,
    portfolioValue: saleScenario.debtFreeProperties.reduce((sum, p) => sum + p.currentValue, 0)
  }

  return {
    incomeShortfall,
    monthlyShortfall,
    options: {
      additionalProperties: {
        count: additionalPropertiesNeeded,
        description: additionalPropertiesNeeded
          ? `Buy ${additionalPropertiesNeeded} more ${formatCurrency(averagePropertyPrice)} propert${additionalPropertiesNeeded > 1 ? 'ies' : 'y'}`
          : null
      },
      additionalCash: {
        amount: additionalCashNeeded,
        description: additionalCashNeeded
          ? `Add ${formatCurrency(additionalCashNeeded)} more starting cash`
          : null
      },
      additionalTime: {
        years: additionalYearsNeeded,
        newTotal: targetYears + (additionalYearsNeeded || 0),
        description: additionalYearsNeeded
          ? `Extend timeline by ${additionalYearsNeeded} years (to ${targetYears + additionalYearsNeeded} years total)`
          : null
      },
      lowerGoal: {
        achievableGoal: saleScenario.afterTaxIncome,
        description: saleScenario.afterTaxIncome > 0
          ? `Adjust goal to ${formatCurrency(saleScenario.afterTaxIncome)}/year (what's achievable)`
          : null
      }
    },
    actualOutcome
  }
}

// Helper for formatting in insights (avoid circular dependency)
function formatCurrency(value) {
  return new Intl.NumberFormat('en-AU', {
    style: 'currency',
    currency: 'AUD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

/**
 * Calculate which levers have the biggest impact on outcomes
 * Tests controllable variables that clients can influence
 */
export function calculateLeversAnalysis(properties, cashAllocated, assumptions, targetYears, annualIncomeGoal) {
  const baseProjection = generateProjection(
    properties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      currentValue: p.currentValue || 0,
      loanAmount: p.loanAmount || 0
    })),
    cashAllocated,
    assumptions,
    targetYears
  )

  if (baseProjection.length === 0) return null

  const baseSaleScenario = calculateStrategicSaleScenario(
    baseProjection,
    annualIncomeGoal / 12,
    assumptions,
    targetYears
  )

  const baseResult = {
    propertiesAcquired: baseProjection[baseProjection.length - 1]?.properties.length || properties.length,
    debtFreeProperties: baseSaleScenario.trulyDebtFreeCount,
    annualIncome: baseSaleScenario.afterTaxIncome
  }

  const levers = []

  // 1. Starting Cash - test +$100k
  const cashIncrease = 100000
  const cashProjection = generateProjection(
    properties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      currentValue: p.currentValue || 0,
      loanAmount: p.loanAmount || 0
    })),
    cashAllocated + cashIncrease,
    assumptions,
    targetYears
  )
  if (cashProjection.length > 0) {
    const cashSaleScenario = calculateStrategicSaleScenario(
      cashProjection,
      annualIncomeGoal / 12,
      assumptions,
      targetYears
    )
    const propertiesDiff = (cashProjection[cashProjection.length - 1]?.properties.length || 0) - baseResult.propertiesAcquired
    const debtFreeDiff = cashSaleScenario.trulyDebtFreeCount - baseResult.debtFreeProperties
    const incomeDiff = cashSaleScenario.afterTaxIncome - baseResult.annualIncome

    levers.push({
      id: 'cash',
      name: 'Starting Cash',
      change: `+${formatCurrency(cashIncrease)}`,
      controllable: true,
      impact: {
        propertiesAcquired: propertiesDiff,
        debtFreeProperties: debtFreeDiff,
        annualIncome: incomeDiff
      },
      description: propertiesDiff > 0
        ? `Enables ${propertiesDiff} more purchase${propertiesDiff > 1 ? 's' : ''}, ${debtFreeDiff > 0 ? `+${debtFreeDiff} debt-free` : 'same debt-free count'}`
        : debtFreeDiff > 0
          ? `Same purchases but +${debtFreeDiff} debt-free properties`
          : 'Minimal impact at this level'
    })
  }

  // 2. Target Purchase Price - test -$100k (cheaper properties = more can be bought)
  const priceDecrease = 100000
  const lowerPriceAssumptions = { ...assumptions, averagePropertyPrice: assumptions.averagePropertyPrice - priceDecrease }
  const priceProjection = generateProjection(
    properties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      currentValue: p.currentValue || 0,
      loanAmount: p.loanAmount || 0
    })),
    cashAllocated,
    lowerPriceAssumptions,
    targetYears
  )
  if (priceProjection.length > 0) {
    const priceSaleScenario = calculateStrategicSaleScenario(
      priceProjection,
      annualIncomeGoal / 12,
      lowerPriceAssumptions,
      targetYears
    )
    const propertiesDiff = (priceProjection[priceProjection.length - 1]?.properties.length || 0) - baseResult.propertiesAcquired
    const debtFreeDiff = priceSaleScenario.trulyDebtFreeCount - baseResult.debtFreeProperties
    const incomeDiff = priceSaleScenario.afterTaxIncome - baseResult.annualIncome

    levers.push({
      id: 'purchasePrice',
      name: 'Target Purchase Price',
      change: `-${formatCurrency(priceDecrease)}`,
      controllable: true,
      impact: {
        propertiesAcquired: propertiesDiff,
        debtFreeProperties: debtFreeDiff,
        annualIncome: incomeDiff
      },
      description: propertiesDiff > 0
        ? `Cheaper properties = ${propertiesDiff} more purchases possible`
        : 'Similar acquisition pace'
    })
  }

  // 3. Timeline - test +5 years
  const yearsIncrease = 5
  const longerProjection = generateProjection(
    properties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      currentValue: p.currentValue || 0,
      loanAmount: p.loanAmount || 0
    })),
    cashAllocated,
    assumptions,
    targetYears + yearsIncrease
  )
  if (longerProjection.length > 0) {
    const longerSaleScenario = calculateStrategicSaleScenario(
      longerProjection,
      annualIncomeGoal / 12,
      assumptions,
      targetYears + yearsIncrease
    )
    const propertiesDiff = (longerProjection[longerProjection.length - 1]?.properties.length || 0) - baseResult.propertiesAcquired
    const debtFreeDiff = longerSaleScenario.trulyDebtFreeCount - baseResult.debtFreeProperties
    const incomeDiff = longerSaleScenario.afterTaxIncome - baseResult.annualIncome

    levers.push({
      id: 'timeline',
      name: 'Investment Timeline',
      change: `+${yearsIncrease} years`,
      controllable: true,
      impact: {
        propertiesAcquired: propertiesDiff,
        debtFreeProperties: debtFreeDiff,
        annualIncome: incomeDiff
      },
      description: `More time for compounding: +${propertiesDiff} properties, +${formatCurrency(incomeDiff)}/year income`
    })
  }

  // 4. Appreciation Rate (less controllable, but location choice matters)
  const appreciationIncrease = 0.01 // +1%
  const higherGrowthAssumptions = { ...assumptions, appreciationRate: assumptions.appreciationRate + appreciationIncrease }
  const growthProjection = generateProjection(
    properties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      currentValue: p.currentValue || 0,
      loanAmount: p.loanAmount || 0
    })),
    cashAllocated,
    higherGrowthAssumptions,
    targetYears
  )
  if (growthProjection.length > 0) {
    const growthSaleScenario = calculateStrategicSaleScenario(
      growthProjection,
      annualIncomeGoal / 12,
      higherGrowthAssumptions,
      targetYears
    )
    const propertiesDiff = (growthProjection[growthProjection.length - 1]?.properties.length || 0) - baseResult.propertiesAcquired
    const debtFreeDiff = growthSaleScenario.trulyDebtFreeCount - baseResult.debtFreeProperties
    const incomeDiff = growthSaleScenario.afterTaxIncome - baseResult.annualIncome

    levers.push({
      id: 'appreciation',
      name: 'Capital Growth Rate',
      change: '+1%',
      controllable: false,
      impact: {
        propertiesAcquired: propertiesDiff,
        debtFreeProperties: debtFreeDiff,
        annualIncome: incomeDiff
      },
      description: `Higher growth locations: +${propertiesDiff} properties, +${formatCurrency(incomeDiff)}/year`
    })
  }

  // 5. Rental Yield (location/property type choice)
  const yieldIncrease = 0.005 // +0.5%
  const higherYieldAssumptions = { ...assumptions, rentalYield: assumptions.rentalYield + yieldIncrease }
  const yieldProjection = generateProjection(
    properties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      currentValue: p.currentValue || 0,
      loanAmount: p.loanAmount || 0
    })),
    cashAllocated,
    higherYieldAssumptions,
    targetYears
  )
  if (yieldProjection.length > 0) {
    const yieldSaleScenario = calculateStrategicSaleScenario(
      yieldProjection,
      annualIncomeGoal / 12,
      higherYieldAssumptions,
      targetYears
    )
    const propertiesDiff = (yieldProjection[yieldProjection.length - 1]?.properties.length || 0) - baseResult.propertiesAcquired
    const debtFreeDiff = yieldSaleScenario.trulyDebtFreeCount - baseResult.debtFreeProperties
    const incomeDiff = yieldSaleScenario.afterTaxIncome - baseResult.annualIncome

    levers.push({
      id: 'yield',
      name: 'Rental Yield',
      change: '+0.5%',
      controllable: false,
      impact: {
        propertiesAcquired: propertiesDiff,
        debtFreeProperties: debtFreeDiff,
        annualIncome: incomeDiff
      },
      description: `Higher yield properties: +${formatCurrency(incomeDiff)}/year passive income`
    })
  }

  // Sort by income impact (most impactful first)
  levers.sort((a, b) => Math.abs(b.impact.annualIncome) - Math.abs(a.impact.annualIncome))

  return {
    baseResult,
    levers,
    mostImpactful: levers[0],
    controllableLevers: levers.filter(l => l.controllable),
    summary: {
      biggestLever: levers[0]?.name || 'None',
      bestControllable: levers.filter(l => l.controllable)[0]?.name || 'None'
    }
  }
}
