import React, { useState } from 'react'
import { useCalculator, actions } from '../../context/CalculatorContext'
import { formatDate } from '../../utils/formatters'
import Card from '../ui/Card'
import Modal, { ConfirmModal } from '../ui/Modal'

export default function ScenarioManager() {
  const { state, dispatch } = useCalculator()
  const [showSaveModal, setShowSaveModal] = useState(false)
  const [scenarioName, setScenarioName] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleSave = () => {
    if (!scenarioName.trim()) return
    dispatch(actions.saveScenario(scenarioName.trim()))
    setScenarioName('')
    setShowSaveModal(false)
  }

  const handleLoad = (id) => {
    dispatch(actions.loadScenario(id))
  }

  const handleDelete = (id) => {
    dispatch(actions.deleteScenario(id))
    setDeleteConfirm(null)
  }

  return (
    <Card
      title="Saved Scenarios"
      subtitle="Compare different strategies"
      action={
        <button
          type="button"
          onClick={() => setShowSaveModal(true)}
          className="btn-primary text-sm"
          disabled={state.properties.length === 0}
        >
          <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
          </svg>
          Save Current
        </button>
      }
    >
      {state.savedScenarios.length === 0 ? (
        <div className="text-center py-6 text-gray-500">
          <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          <p>No saved scenarios yet</p>
          <p className="text-sm mt-1">Save your current setup to compare different strategies</p>
        </div>
      ) : (
        <div className="space-y-3">
          {state.savedScenarios.map(scenario => (
            <div
              key={scenario.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div>
                <p className="font-medium text-gray-900">{scenario.name}</p>
                <p className="text-sm text-gray-500">
                  {scenario.state.properties.length} properties | {formatDate(scenario.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleLoad(scenario.id)}
                  className="px-3 py-1.5 text-sm bg-white border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Load
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirm(scenario.id)}
                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  aria-label="Delete scenario"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Save Modal */}
      <Modal
        isOpen={showSaveModal}
        onClose={() => {
          setShowSaveModal(false)
          setScenarioName('')
        }}
        title="Save Scenario"
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="input-label">Scenario Name</label>
            <input
              type="text"
              value={scenarioName}
              onChange={(e) => setScenarioName(e.target.value)}
              placeholder="e.g., Aggressive Growth, Conservative"
              className="input-field"
              autoFocus
            />
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowSaveModal(false)
                setScenarioName('')
              }}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!scenarioName.trim()}
              className="btn-primary"
            >
              Save Scenario
            </button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDelete(deleteConfirm)}
        title="Delete Scenario"
        message="Are you sure you want to delete this saved scenario? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </Card>
  )
}
