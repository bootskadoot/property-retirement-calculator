import React, { useState } from 'react'
import { CalculatorProvider, useCalculator } from './context/CalculatorContext'
import Header from './components/layout/Header'
import Footer from './components/layout/Footer'
import Card from './components/ui/Card'

// Input Components
import PropertyList from './components/inputs/PropertyList'
import IncomeGoalForm from './components/inputs/IncomeGoalForm'
import AssumptionsForm from './components/inputs/AssumptionsForm'

// Output Components
import PortfolioSummary from './components/outputs/PortfolioSummary'
import Roadmap from './components/outputs/Roadmap'
import TimelineChart from './components/outputs/TimelineChart'
import CashFlowChart from './components/outputs/CashFlowChart'
import SensitivityAnalysis from './components/features/SensitivityAnalysis'

// Feature Components
import ScenarioManager from './components/features/ScenarioManager'
import ExportButton from './components/features/ExportButton'

const SECTIONS = [
  { id: 'goals', label: 'Goals', icon: 'target' },
  { id: 'portfolio', label: 'Portfolio', icon: 'home' },
  { id: 'assumptions', label: 'Assumptions', icon: 'settings' },
  { id: 'roadmap', label: 'Roadmap', icon: 'map' },
]

function SectionIcon({ icon, className = 'w-5 h-5' }) {
  const icons = {
    home: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    target: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    settings: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    map: (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
  }
  return icons[icon] || null
}

function AppContent() {
  const { state } = useCalculator()
  const [activeSection, setActiveSection] = useState('goals')
  const [showAdvanced, setShowAdvanced] = useState(false)

  const hasProperties = state.properties.length > 0

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />

      <main className="flex-1 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Portfolio Summary - always visible when properties exist */}
          {hasProperties && activeSection !== 'roadmap' && (
            <div className="mb-6">
              <PortfolioSummary />
            </div>
          )}

          {/* Navigation Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 mb-6 flex">
            {SECTIONS.map((section) => (
              <button
                key={section.id}
                type="button"
                onClick={() => setActiveSection(section.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  activeSection === section.id
                    ? 'bg-primary-600 text-white shadow-sm'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <SectionIcon icon={section.icon} className="w-5 h-5" />
                <span className="hidden sm:inline">{section.label}</span>
              </button>
            ))}
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Goals Tab - Hero */}
            {activeSection === 'goals' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">Your Retirement Goal</h2>
                  <p className="text-gray-500 text-sm mb-6">
                    How much passive income do you want from your property portfolio?
                  </p>
                  <IncomeGoalForm />
                </Card>

                <div className="space-y-6">
                  <Card className="bg-gradient-to-br from-gray-50 to-gray-100">
                    <h3 className="font-semibold text-gray-900 mb-3">How It Works</h3>
                    <ol className="space-y-3 text-sm text-gray-600">
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                        <span>Set your target passive income and timeline</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                        <span>Add your current investment properties</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                        <span>Adjust assumptions in Settings (cash, rates, etc.)</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="flex-shrink-0 w-6 h-6 bg-primary-100 text-primary-700 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                        <span>View your personalized Roadmap to retirement</span>
                      </li>
                    </ol>
                  </Card>

                  {hasProperties && (
                    <button
                      type="button"
                      onClick={() => setActiveSection('roadmap')}
                      className="w-full btn-primary py-4 text-lg"
                    >
                      View Your Roadmap
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>
                  )}

                  {!hasProperties && (
                    <button
                      type="button"
                      onClick={() => setActiveSection('portfolio')}
                      className="w-full btn-primary py-4 text-lg"
                    >
                      Add Your Properties
                      <svg className="w-5 h-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Portfolio Tab */}
            {activeSection === 'portfolio' && (
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Properties</h2>
                    <p className="text-gray-500 text-sm">
                      Add your current investment properties to model your portfolio growth
                    </p>
                  </div>
                </div>
                <PropertyList />
              </Card>
            )}

            {/* Settings/Assumptions Tab */}
            {activeSection === 'assumptions' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">Strategy Settings</h2>
                    <p className="text-gray-500 text-sm mb-6">
                      Adjust your cash position and market assumptions
                    </p>
                    <AssumptionsForm />
                  </Card>
                </div>

                <div className="space-y-6">
                  <ScenarioManager />
                </div>
              </div>
            )}

            {/* Roadmap Tab */}
            {activeSection === 'roadmap' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Your Path to Retirement</h2>
                    <p className="text-gray-500 text-sm">
                      See how your portfolio grows and when you'll reach your goal
                    </p>
                  </div>
                  <ExportButton />
                </div>

                <Roadmap />

                {/* Advanced Analytics Toggle */}
                {hasProperties && (
                  <div className="pt-4">
                    <button
                      type="button"
                      onClick={() => setShowAdvanced(!showAdvanced)}
                      className="w-full py-3 px-4 text-sm font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg border border-gray-200 flex items-center justify-center gap-2 transition-colors"
                    >
                      <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                      {showAdvanced ? 'Hide' : 'Show'} Detailed Analysis
                      <svg
                        className={`w-4 h-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {showAdvanced && (
                      <div className="space-y-6 mt-6">
                        <TimelineChart />
                        <CashFlowChart />
                        <SensitivityAnalysis />
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <CalculatorProvider>
      <AppContent />
    </CalculatorProvider>
  )
}
