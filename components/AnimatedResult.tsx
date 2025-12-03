'use client'

import { motion } from 'framer-motion'

interface Props {
  label: string
  value: string | number
  unit?: string
}

export default function AnimatedResult({ label, value, unit = '' }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4 text-center shadow">
        <h3 className="text-md font-semibold text-gray-700">{label}</h3>
        <p className="text-2xl font-bold text-green-700 mt-2">
          {value} {unit}
        </p>
      </div>
    </motion.div>
  )
}