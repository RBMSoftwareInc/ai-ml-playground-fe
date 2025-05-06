'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'

export default function VariantPage() {
  const [formData, setFormData] = useState({
    customer_segment: 'premium',
    time_of_day: 'morning',
    device_type: 'mobile',
    gender: 'female',
    browser: 'Chrome',
    platform: 'Android',
    location: 'Mumbai',
    num_clicks: 8,
    session_time_minutes: 6.5
  })

  const [variant, setVariant] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('clicks') || name.includes('minutes') ? parseFloat(value) : value
    }))
  }

  const handleSubmit = async () => {
    const res = await fetch('http://localhost:5000/api/v1/variant/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
    const data = await res.json()
    setVariant(data.predicted_variant)
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 bg-white p-8 rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold text-purple-700 mb-6">🎯 Variant Recommendation</h2>

      <div className="grid grid-cols-1 gap-4">
        {[
          ['customer_segment', ['premium', 'regular', 'business', 'new_user']],
          ['time_of_day', ['morning', 'afternoon', 'evening', 'night']],
          ['device_type', ['mobile', 'desktop', 'tablet']],
          ['gender', ['male', 'female', 'other']],
          ['browser', ['Chrome', 'Firefox', 'Safari', 'Edge']],
          ['platform', ['Android', 'iOS', 'Windows', 'macOS']],
          ['location', ['Delhi', 'Mumbai', 'Bangalore', 'Hyderabad']]
        ].map(([key, options]) => (
          <div key={key as string}>
            <label className="block mb-1 capitalize">{(key as string).replace('_', ' ')}</label>
            <select
              name={key as string}
              value={formData[key as keyof typeof formData]}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 shadow-sm"
            >
              {(options as string[]).map(opt => (
                <option key={opt}>{opt}</option>
              ))}
            </select>
          </div>
        ))}

        <div>
          <label className="block mb-1">Number of Clicks</label>
          <input
            type="number"
            name="num_clicks"
            value={formData.num_clicks}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>

        <div>
          <label className="block mb-1">Session Time (minutes)</label>
          <input
            type="number"
            name="session_time_minutes"
            value={formData.session_time_minutes}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 shadow-sm"
          />
        </div>

        <button
          onClick={handleSubmit}
          className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-2 rounded-lg font-semibold hover:scale-105 transition-transform"
        >
          🎁 Recommend Variant
        </button>

        {variant && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mt-6 bg-indigo-100 border-l-4 border-indigo-500 text-indigo-900 p-4 rounded-lg"
          >
            <p className="text-xl font-bold">
              Recommended Variant: {variant}
            </p>
          </motion.div>
        )}
      </div>
    </div>
  )
}