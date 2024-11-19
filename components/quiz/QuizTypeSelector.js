'use client'

import { useState } from 'react'

export default function QuizTypeSelector({ onStart }) {
    const [age, setAge] = useState('')
    const [profession, setProfession] = useState('')
    const [selectedType, setSelectedType] = useState(null)
  
    const handleSubmit = (e) => {
      e.preventDefault()
      if (!selectedType || !age) return
  
      onStart({
        age: parseInt(age),
        profession,
        type: selectedType
      })
    }
  
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700">
          <h1 className="text-2xl font-bold text-white mb-6">Anatomy Quiz</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-white mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                required
                min="1"
                max="120"
              />
            </div>
  
            <div>
              <label className="block text-white mb-2">Profession (optional)</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)}
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                placeholder="e.g., Doctor, Student"
              />
            </div>
  
            <div className="space-y-4">
              <h3 className="text-white">Select Quiz Type:</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setSelectedType('text')}
                  className={`p-4 rounded-lg border ${
                    selectedType === 'text' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <h4 className="text-white font-bold">Text Quiz</h4>
                  <p className="text-sm text-gray-300">Answer anatomy questions</p>
                </button>
  
                <button
                  type="button"
                  onClick={() => setSelectedType('mesh')}
                  className={`p-4 rounded-lg border ${
                    selectedType === 'mesh' 
                      ? 'border-blue-500 bg-blue-500/20' 
                      : 'border-gray-600 hover:border-blue-400'
                  }`}
                >
                  <h4 className="text-white font-bold">3D Quiz</h4>
                  <p className="text-sm text-gray-300">Identify parts in 3D model</p>
                </button>
              </div>
            </div>
  
            <button
              type="submit"
              disabled={!selectedType || !age}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 
                       rounded-lg text-white disabled:opacity-50"
            >
              Start Quiz
            </button>
          </form>
        </div>
      </div>
    )
  }