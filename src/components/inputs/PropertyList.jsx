import React, { useState } from 'react'
import PropertyCard from './PropertyCard'
import PropertyForm from './PropertyForm'
import Modal, { ConfirmModal } from '../ui/Modal'
import { useCalculator, actions } from '../../context/CalculatorContext'

export default function PropertyList() {
  const { state, dispatch } = useCalculator()
  const [isAddingProperty, setIsAddingProperty] = useState(false)
  const [editingProperty, setEditingProperty] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const handleAddProperty = (property) => {
    dispatch(actions.addProperty(property))
    setIsAddingProperty(false)
  }

  const handleUpdateProperty = (property) => {
    dispatch(actions.updateProperty(property))
    setEditingProperty(null)
  }

  const handleDeleteProperty = (id) => {
    dispatch(actions.deleteProperty(id))
    setDeleteConfirm(null)
  }

  return (
    <div>
      {state.properties.length === 0 ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No properties yet</h3>
          <p className="text-gray-500 mb-4">Add your first property to get started</p>
          <button
            type="button"
            onClick={() => setIsAddingProperty(true)}
            className="btn-primary"
          >
            <svg className="w-5 h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Property
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {state.properties.map(property => (
              <PropertyCard
                key={property.id}
                property={property}
                onEdit={setEditingProperty}
                onDelete={setDeleteConfirm}
              />
            ))}
          </div>

          <button
            type="button"
            onClick={() => setIsAddingProperty(true)}
            className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-500 hover:border-primary-500 hover:text-primary-600 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Property
          </button>
        </>
      )}

      {/* Add Property Modal */}
      <Modal
        isOpen={isAddingProperty}
        onClose={() => setIsAddingProperty(false)}
        title="Add Property"
        size="lg"
      >
        <PropertyForm
          onSave={handleAddProperty}
          onCancel={() => setIsAddingProperty(false)}
        />
      </Modal>

      {/* Edit Property Modal */}
      <Modal
        isOpen={!!editingProperty}
        onClose={() => setEditingProperty(null)}
        title="Edit Property"
        size="lg"
      >
        {editingProperty && (
          <PropertyForm
            property={editingProperty}
            onSave={handleUpdateProperty}
            onCancel={() => setEditingProperty(null)}
          />
        )}
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => handleDeleteProperty(deleteConfirm)}
        title="Delete Property"
        message="Are you sure you want to remove this property from your portfolio? This action cannot be undone."
        confirmText="Delete"
        danger
      />
    </div>
  )
}
