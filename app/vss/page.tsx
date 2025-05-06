'use client'

import { useState } from 'react'

export default function VisualSimilarityPage() {
  const [file, setFile] = useState<File | null>(null)
  const [result, setResult] = useState<string[]>([])

  const handleUpload = async () => {
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch('http://localhost:5000/api/v1/vss/upload', {
      method: 'POST',
      body: formData
    })
    const data = await res.json()
    setResult(data.similar_images || [])
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-yellow-600 mb-6">🖼️ Visual Similarity Search</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4"
      />

      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
      >
        🔍 Search Similar
      </button>

      <div className="mt-6 grid grid-cols-2 gap-4">
        {result.map((img, index) => (
          <div key={index} className="border rounded overflow-hidden">
            <img src={`http://localhost:5000/${img}`} alt={`similar-${index}`} className="w-full h-32 object-cover" />
          </div>
        ))}
      </div>
    </div>
  )
}