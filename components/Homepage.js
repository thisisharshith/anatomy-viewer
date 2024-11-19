'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ANATOMY_SYSTEMS } from '@/utils/anatomyConstants'

export default function HomePage() {
  const [showQuiz, setShowQuiz] = useState(false)

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Human Anatomy Explorer</h1>
      
      <div className="flex justify-center mb-8">
        <Link 
          href="/quiz"
          className="px-8 py-4 bg-blue-600 hover:bg-blue-700 rounded-xl
                     transition-all duration-200 transform hover:scale-105
                     font-semibold text-lg shadow-xl"
        >
          Take Anatomy Quiz
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 max-w-[1600px] mx-auto">
        {ANATOMY_SYSTEMS.map((system) => (
          <button
            key={system.id}
            className="group relative overflow-hidden rounded-lg p-4 bg-gray-800 hover:bg-gray-700 
                     transition-all duration-300 transform hover:scale-105"
            style={{ minHeight: '180px' }}
          >
            <div className="relative z-10">
              <h3 className="text-xl font-semibold mb-2" style={{ color: system.color }}>
                {system.name}
              </h3>
              <p className="text-sm text-gray-300">{system.description}</p>
            </div>
            <div 
              className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity"
              style={{ backgroundColor: system.color }}
            />
          </button>
        ))}
      </div>
    </div>
  )
}