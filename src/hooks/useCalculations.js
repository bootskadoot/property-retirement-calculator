import { useMemo } from 'react'
import { useCalculator } from '../context/CalculatorContext'
import {
  calculatePortfolioTotals,
  calculateLVR,
  calculateEquity,
  generateProjection,
  calculateStrategicSaleScenario,
  calculatePropertiesNeededForGoalAnnual,
  validateAssumptions,
  generateActionableInsights,
  calculateGapAnalysis,
  calculateLeversAnalysis
} from '../utils/calculations'

export function useCalculations() {
  const { state } = useCalculator()
  const {
    properties,
    cashReserves,
    cashAllocated,
    annualIncomeGoal,
    incomePeriod,
    targetYears,
    assumptions
  } = state

  // Derive monthly from annual for internal calculations
  const monthlyIncomeGoal = annualIncomeGoal / 12

  // Calculate current portfolio totals
  const portfolioTotals = useMemo(() => {
    const propertiesWithCalculations = properties.map(property => ({
      ...property,
      equity: calculateEquity(property.currentValue, property.loanAmount),
      lvr: calculateLVR(property.loanAmount, property.currentValue)
    }))

    return calculatePortfolioTotals(propertiesWithCalculations)
  }, [properties])

  // Calculate overall LVR
  const overallLVR = useMemo(() => {
    if (portfolioTotals.totalValue === 0) return 0
    return portfolioTotals.totalDebt / portfolioTotals.totalValue
  }, [portfolioTotals])

  // Calculate properties needed for income goal
  const propertiesNeeded = useMemo(() => {
    return calculatePropertiesNeededForGoalAnnual(
      annualIncomeGoal,
      assumptions.averagePropertyPrice,
      assumptions.rentalYield,
      assumptions.taxBracket
    )
  }, [annualIncomeGoal, assumptions])

  // Generate year-by-year projection
  const projection = useMemo(() => {
    // Allow projection even with no properties (cash-only start)
    if (properties.length === 0 && cashAllocated === 0) return []

    const propertiesWithDefaults = properties.map(p => ({
      ...p,
      purchasePrice: p.purchasePrice || p.currentValue,
      currentValue: p.currentValue || 0,
      loanAmount: p.loanAmount || 0,
      // Pass explicit rent if user entered one (>0), otherwise it will use yield assumption
      explicitRent: p.annualRent || 0
    }))

    return generateProjection(
      propertiesWithDefaults,
      cashAllocated,
      assumptions,
      targetYears
    )
  }, [properties, cashAllocated, assumptions, targetYears])

  // Calculate final strategic sale scenario
  const saleScenario = useMemo(() => {
    if (projection.length === 0) return null

    return calculateStrategicSaleScenario(
      projection,
      monthlyIncomeGoal,
      assumptions,
      targetYears
    )
  }, [projection, monthlyIncomeGoal, assumptions, targetYears])

  // Validate assumptions and get warnings
  const warnings = useMemo(() => {
    return validateAssumptions(assumptions)
  }, [assumptions])

  // Calculate goal progress
  const goalProgress = useMemo(() => {
    if (!saleScenario) return null

    return {
      targetAnnualIncome: annualIncomeGoal,
      targetMonthlyIncome: monthlyIncomeGoal,
      projectedMonthlyIncome: saleScenario.monthlyIncome,
      projectedAnnualIncome: saleScenario.monthlyIncome * 12,
      percentAchieved: Math.min(100, (saleScenario.monthlyIncome / monthlyIncomeGoal) * 100),
      goalAchieved: saleScenario.goalAchieved,
      shortfall: saleScenario.shortfall,
      shortfallAnnual: saleScenario.shortfall * 12,
      surplus: saleScenario.surplus,
      surplusAnnual: saleScenario.surplus * 12,
      propertiesNeeded,
      propertiesProjected: saleScenario.debtFreeProperties.length
    }
  }, [saleScenario, annualIncomeGoal, monthlyIncomeGoal, propertiesNeeded])

  // Chart data for timeline
  const timelineData = useMemo(() => {
    return projection.map(year => ({
      year: year.year,
      portfolioValue: year.totals.totalValue,
      equity: year.totals.totalEquity,
      debt: year.totals.totalDebt,
      propertyCount: year.properties.length,
      cashFlow: year.properties.reduce((sum, p) => sum + (p.cashFlow || 0), 0)
    }))
  }, [projection])

  // Chart data for cash flow
  const cashFlowData = useMemo(() => {
    return projection.map(year => ({
      year: year.year,
      rentalIncome: year.properties.reduce((sum, p) => sum + (p.annualRent || 0), 0),
      interestPayments: year.properties.reduce((sum, p) => sum + (p.annualInterest || 0), 0),
      netCashFlow: year.properties.reduce((sum, p) => sum + (p.cashFlow || 0), 0)
    }))
  }, [projection])

  // Generate actionable insights
  const insights = useMemo(() => {
    return generateActionableInsights(
      projection,
      saleScenario,
      assumptions,
      cashAllocated,
      annualIncomeGoal
    )
  }, [projection, saleScenario, assumptions, cashAllocated, annualIncomeGoal])

  // Calculate gap analysis when goal not achieved
  const gapAnalysis = useMemo(() => {
    return calculateGapAnalysis(
      projection,
      saleScenario,
      assumptions,
      cashAllocated,
      annualIncomeGoal,
      targetYears
    )
  }, [projection, saleScenario, assumptions, cashAllocated, annualIncomeGoal, targetYears])

  // Calculate levers analysis - what has biggest impact
  const leversAnalysis = useMemo(() => {
    // Allow levers analysis with cash-only (no properties)
    if (properties.length === 0 && cashAllocated === 0) return null
    return calculateLeversAnalysis(
      properties,
      cashAllocated,
      assumptions,
      targetYears,
      annualIncomeGoal
    )
  }, [properties, cashAllocated, assumptions, targetYears, annualIncomeGoal])

  return {
    // Current state calculations
    portfolioTotals,
    overallLVR,
    propertiesNeeded,

    // Projections
    projection,
    saleScenario,
    goalProgress,

    // Chart data
    timelineData,
    cashFlowData,

    // Validation
    warnings,

    // Actionable insights
    insights,
    gapAnalysis,
    leversAnalysis,

    // Raw state for convenience
    assumptions,
    targetYears,
    annualIncomeGoal,
    monthlyIncomeGoal,
    incomePeriod,
    cashAllocated
  }
}
