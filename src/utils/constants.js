export const DEFAULTS = {
  appreciationRate: 0.04,      // 4% annual property value growth
  rentGrowthRate: 0.025,       // 2.5% annual rent growth (typically slower than property values)
  rentalYield: 0.045,          // 4.5% initial rental yield
  interestRate: 0.065,         // 6.5%
  maxInvestmentLVR: 0.80,      // 80% for investment
  stampDutyRate: 0.055,        // ~5.5% NSW estimate (flat)
  purchaseCosts: 0.02,         // 2% for legals, inspections
  taxBracket: 0.37,            // 37% marginal rate estimate
  incomeMultiplier: 6,         // 6x income for borrowing
  refinanceInterval: 2,        // Years between refinance opportunities
  averagePropertyPrice: 1000000, // $1M average Sydney property
  // Realistic costs
  holdingCostsRate: 0.025,     // 2.5% of property value/year (management, maintenance, insurance, rates)
  vacancyRate: 0.04,           // 4% (~2 weeks vacancy/year)
  buyersAgentFee: 20000,       // $20k per purchase
  sellingCostsRate: 0.025,     // 2.5% of sale price (agent commission, conveyancing, marketing)
  cgtDiscount: 0.50,           // 50% CGT discount if held >12 months
  // Loan structure
  interestOnlyYears: 5,        // Years of interest-only before switching to P&I
}

export const RANGES = {
  appreciationRate: { min: 0, max: 0.10, step: 0.005 },
  rentGrowthRate: { min: 0, max: 0.05, step: 0.005 },
  rentalYield: { min: 0.02, max: 0.08, step: 0.005 },
  interestRate: { min: 0.04, max: 0.10, step: 0.005 },
  maxInvestmentLVR: { min: 0.60, max: 0.85, step: 0.05 },
  stampDutyRate: { min: 0.04, max: 0.07, step: 0.005 },
  taxBracket: { min: 0.19, max: 0.47, step: 0.01 },
  timeline: { min: 5, max: 40, step: 1 },
  monthlyIncome: { min: 2000, max: 50000, step: 500 },
  annualIncome: { min: 24000, max: 600000, step: 6000 },
  // Realistic costs ranges
  holdingCostsRate: { min: 0.01, max: 0.05, step: 0.005 },
  vacancyRate: { min: 0, max: 0.10, step: 0.01 },
  buyersAgentFee: { min: 0, max: 40000, step: 5000 },
  sellingCostsRate: { min: 0.01, max: 0.04, step: 0.005 },
  // Loan structure ranges
  interestOnlyYears: { min: 0, max: 10, step: 1 },
}

export const TOOLTIPS = {
  appreciationRate: "Annual property value growth rate. Sydney historical average is around 4-6%.",
  rentGrowthRate: "Annual rent increase rate. Typically 2-3%, often slower than property value growth.",
  rentalYield: "Annual rental income as a percentage of property value. Sydney typically ranges 3-5%.",
  interestRate: "Current interest rate on investment loans. As of 2024, around 6-7%.",
  maxLVR: "Maximum Loan-to-Value Ratio for investment properties. Banks typically lend up to 80%.",
  stampDuty: "NSW stamp duty on property purchases. Approximately 4-6% of purchase price.",
  equity: "The difference between property value and loan amount - your ownership stake.",
  lvr: "Loan-to-Value Ratio - how much you owe compared to property value.",
  refinance: "Accessing increased equity through a new loan or increasing existing loan.",
  passiveIncome: "Rental income from debt-free properties after selling strategy is complete.",
  // Realistic costs
  holdingCosts: "Annual costs including property management (6-8%), maintenance, insurance, council rates, strata.",
  vacancyRate: "Percentage of time property is vacant between tenants. Typically 2-4 weeks per year.",
  buyersAgentFee: "Fee paid to a buyers agent to source and negotiate property purchases.",
  sellingCosts: "Costs when selling: agent commission (~2%), conveyancing, marketing, staging.",
  // Loan structure
  interestOnlyYears: "Years of interest-only payments before switching to principal & interest. Banks typically allow 5-10 years IO.",
}

export const CURRENCY_FORMAT = new Intl.NumberFormat('en-AU', {
  style: 'currency',
  currency: 'AUD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

export const PERCENT_FORMAT = new Intl.NumberFormat('en-AU', {
  style: 'percent',
  minimumFractionDigits: 1,
  maximumFractionDigits: 1,
})
