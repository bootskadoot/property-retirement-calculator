import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { DEFAULTS } from '../utils/constants'

const CalculatorContext = createContext(null)

const STORAGE_KEY = 'ba-wealth-calculator'

const initialState = {
  // Properties in portfolio
  properties: [],

  // Cash position (now part of assumptions)
  cashReserves: 0,
  cashAllocated: 0,

  // Income goal - stored as annual, display preference toggleable
  annualIncomeGoal: 120000,  // $120k/year default
  incomePeriod: 'annual',     // 'annual' or 'monthly' for display
  targetYears: 15,

  // Assumptions
  assumptions: {
    appreciationRate: DEFAULTS.appreciationRate,
    rentGrowthRate: DEFAULTS.rentGrowthRate,
    rentalYield: DEFAULTS.rentalYield,
    interestRate: DEFAULTS.interestRate,
    maxLVR: DEFAULTS.maxInvestmentLVR,
    stampDutyRate: DEFAULTS.stampDutyRate,
    taxBracket: DEFAULTS.taxBracket,
    refinanceInterval: DEFAULTS.refinanceInterval,
    averagePropertyPrice: DEFAULTS.averagePropertyPrice,
    // Realistic costs
    holdingCostsRate: DEFAULTS.holdingCostsRate,
    vacancyRate: DEFAULTS.vacancyRate,
    buyersAgentFee: DEFAULTS.buyersAgentFee,
    sellingCostsRate: DEFAULTS.sellingCostsRate,
    // Loan structure
    interestOnlyYears: DEFAULTS.interestOnlyYears,
  },

  // Saved scenarios for comparison
  savedScenarios: [],

  // UI state
  activeSection: 'goals',
  showCalculations: false,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_STATE':
      return { ...initialState, ...action.payload }

    case 'ADD_PROPERTY':
      return {
        ...state,
        properties: [...state.properties, { id: uuidv4(), ...action.payload }]
      }

    case 'UPDATE_PROPERTY':
      return {
        ...state,
        properties: state.properties.map(p =>
          p.id === action.payload.id ? { ...p, ...action.payload } : p
        )
      }

    case 'DELETE_PROPERTY':
      return {
        ...state,
        properties: state.properties.filter(p => p.id !== action.payload)
      }

    case 'SET_CASH_POSITION':
      return {
        ...state,
        cashReserves: action.payload.cashReserves ?? state.cashReserves,
        cashAllocated: action.payload.cashAllocated ?? state.cashAllocated,
      }

    case 'SET_INCOME_GOAL':
      return {
        ...state,
        annualIncomeGoal: action.payload.annualIncomeGoal ?? state.annualIncomeGoal,
        incomePeriod: action.payload.incomePeriod ?? state.incomePeriod,
        targetYears: action.payload.targetYears ?? state.targetYears,
      }

    case 'SET_ASSUMPTIONS':
      return {
        ...state,
        assumptions: { ...state.assumptions, ...action.payload }
      }

    case 'RESET_ASSUMPTIONS':
      return {
        ...state,
        assumptions: initialState.assumptions
      }

    case 'SAVE_SCENARIO':
      const newScenario = {
        id: uuidv4(),
        name: action.payload.name,
        createdAt: new Date().toISOString(),
        state: {
          properties: state.properties,
          cashReserves: state.cashReserves,
          cashAllocated: state.cashAllocated,
          annualIncomeGoal: state.annualIncomeGoal,
          incomePeriod: state.incomePeriod,
          targetYears: state.targetYears,
          assumptions: state.assumptions,
        }
      }
      return {
        ...state,
        savedScenarios: [...state.savedScenarios, newScenario]
      }

    case 'LOAD_SCENARIO':
      const scenario = state.savedScenarios.find(s => s.id === action.payload)
      if (!scenario) return state
      return {
        ...state,
        ...scenario.state
      }

    case 'DELETE_SCENARIO':
      return {
        ...state,
        savedScenarios: state.savedScenarios.filter(s => s.id !== action.payload)
      }

    case 'SET_ACTIVE_SECTION':
      return {
        ...state,
        activeSection: action.payload
      }

    case 'TOGGLE_CALCULATIONS':
      return {
        ...state,
        showCalculations: !state.showCalculations
      }

    case 'RESET_ALL':
      return initialState

    default:
      return state
  }
}

export function CalculatorProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)

  // Load state from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        dispatch({ type: 'LOAD_STATE', payload: parsed })
      }
    } catch (error) {
      console.error('Error loading saved state:', error)
    }
  }, [])

  // Save state to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch (error) {
      console.error('Error saving state:', error)
    }
  }, [state])

  return (
    <CalculatorContext.Provider value={{ state, dispatch }}>
      {children}
    </CalculatorContext.Provider>
  )
}

export function useCalculator() {
  const context = useContext(CalculatorContext)
  if (!context) {
    throw new Error('useCalculator must be used within a CalculatorProvider')
  }
  return context
}

// Action creators
export const actions = {
  addProperty: (property) => ({ type: 'ADD_PROPERTY', payload: property }),
  updateProperty: (property) => ({ type: 'UPDATE_PROPERTY', payload: property }),
  deleteProperty: (id) => ({ type: 'DELETE_PROPERTY', payload: id }),
  setCashPosition: (data) => ({ type: 'SET_CASH_POSITION', payload: data }),
  setIncomeGoal: (data) => ({ type: 'SET_INCOME_GOAL', payload: data }),
  setAssumptions: (assumptions) => ({ type: 'SET_ASSUMPTIONS', payload: assumptions }),
  resetAssumptions: () => ({ type: 'RESET_ASSUMPTIONS' }),
  saveScenario: (name) => ({ type: 'SAVE_SCENARIO', payload: { name } }),
  loadScenario: (id) => ({ type: 'LOAD_SCENARIO', payload: id }),
  deleteScenario: (id) => ({ type: 'DELETE_SCENARIO', payload: id }),
  setActiveSection: (section) => ({ type: 'SET_ACTIVE_SECTION', payload: section }),
  toggleCalculations: () => ({ type: 'TOGGLE_CALCULATIONS' }),
  resetAll: () => ({ type: 'RESET_ALL' }),
}
