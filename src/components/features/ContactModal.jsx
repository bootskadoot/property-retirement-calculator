import React, { useState } from 'react'
import Modal from '../ui/Modal'

export default function ContactModal({ isOpen, onClose }) {
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'General question',
    message: '',
    buyingSoon: false,
    openToContact: false
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormState(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('form-name', 'contact')
      Object.entries(formState).forEach(([key, value]) => {
        // Convert booleans to Yes/No for Netlify Forms
        if (typeof value === 'boolean') {
          formData.append(key, value ? 'Yes' : 'No')
        } else {
          formData.append(key, value)
        }
      })

      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      })

      if (response.ok) {
        setIsSubmitted(true)
        setFormState({
          name: '',
          email: '',
          phone: '',
          inquiryType: 'General question',
          message: '',
          buyingSoon: false,
          openToContact: false
        })
      } else {
        throw new Error('Form submission failed')
      }
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    setIsSubmitted(false)
    setError(null)
    onClose()
  }

  if (isSubmitted) {
    return (
      <Modal isOpen={isOpen} onClose={handleClose} title="Thank you!" size="sm">
        <div className="text-center py-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-600 mb-4">We've received your message and will get back to you soon.</p>
          <button
            type="button"
            onClick={handleClose}
            className="btn-primary"
          >
            Close
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Contact Us" size="md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input type="hidden" name="form-name" value="contact" />

        {/* Honeypot field for spam prevention */}
        <p className="hidden">
          <label>
            Don't fill this out: <input name="bot-field" />
          </label>
        </p>

        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formState.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="Your name"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formState.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="your.email@example.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-gray-400">(optional)</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formState.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="0400 000 000"
          />
        </div>

        <div>
          <label htmlFor="inquiryType" className="block text-sm font-medium text-gray-700 mb-1">
            What can we help with?
          </label>
          <select
            id="inquiryType"
            name="inquiryType"
            value={formState.inquiryType}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option>General question</option>
            <option>I want professional advice</option>
            <option>I'm a professional wanting to partner</option>
          </select>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formState.message}
            onChange={handleChange}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            placeholder="How can we help you?"
          />
        </div>

        {/* Qualifying Questions */}
        <div className="space-y-3 pt-2 border-t border-gray-200">
          <p className="text-sm font-medium text-gray-700">Help us understand your situation <span className="text-gray-400 font-normal">(optional)</span></p>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="buyingSoon"
              checked={formState.buyingSoon}
              onChange={handleChange}
              className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">I'm looking to buy property in the next 12 months</span>
          </label>

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="openToContact"
              checked={formState.openToContact}
              onChange={handleChange}
              className="mt-0.5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-600">I'm open to hearing from buyers agents or brokers who specialise in property investment</span>
          </label>
        </div>

        {error && (
          <p className="text-sm text-red-600">{error}</p>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary disabled:opacity-50"
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
