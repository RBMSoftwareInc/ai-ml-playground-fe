'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function FraudDetection() {
  const [formData, setFormData] = useState({
    transaction_amount: 1500,
    user_age: 32,
    device_type: 'mobile',
    location_match: 'yes'
  })

  const [result, setResult] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'transaction_amount' || name === 'user_age' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    const res = await fetch('http://localhost:5000/api/v1/fraud/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    setResult(data.result)
    setLoading(false)
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-red-600 mb-6">🕵️ Fraud Detection</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1">Transaction Amount</label>
          <input type="number" name="transaction_amount" value={formData.transaction_amount} onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 ring-red-400 shadow-sm" />
        </div>

        <div>
          <label className="block mb-1">User Age</label>
          <input type="number" name="user_age" value={formData.user_age} onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 ring-red-400 shadow-sm" />
        </div>

        <div>
          <label className="block mb-1">Device Type</label>
          <select name="device_type" value={formData.device_type} onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 ring-red-400 shadow-sm">
            <option value="mobile">Mobile</option>
            <option value="desktop">Desktop</option>
            <option value="tablet">Tablet</option>
          </select>
        </div>

        <div>
          <label className="block mb-1">Location Match</label>
          <select name="location_match" value={formData.location_match} onChange={handleChange}
            className="w-full px-4 py-2 border rounded focus:ring-2 ring-red-400 shadow-sm">
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="mt-6 w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transition"
      >
        🚨 Detect Fraud
      </button>

      {loading && <p className="mt-4 text-gray-600 animate-pulse">Evaluating risk...</p>}

      {result && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`mt-6 p-4 rounded-lg border-l-4 ${result === 'fraud' ? 'bg-red-100 border-red-600 text-red-800' : 'bg-green-100 border-green-600 text-green-800'}`}
        >
          <p className="text-lg font-bold">Result: {result === 'fraud' ? '⚠️ Fraudulent' : '✅ Genuine'}</p>
        </motion.div>
      )}
    </div>
  )
}