'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { getAnatomyInfo } from '@/utils/groq'

export default function PartDetails({ params }) {
  const router = useRouter()
  const [partInfo, setPartInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [age, setAge] = useState("")
  const [hasSubmittedAge, setHasSubmittedAge] = useState(false)

  const handleBackToModel = () => {
    const previousSystem = localStorage.getItem('previousSystem')
    router.push(`/?system=${previousSystem}`)
  }

  const handleBackToHome = () => {
    router.push('/')
  }

  const handleAgeSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const decodedName = decodeURIComponent(params.name)
      const info = await getAnatomyInfo(decodedName, parseInt(age))
      setPartInfo(info)
      setHasSubmittedAge(true)
    } catch (error) {
      console.error('Error fetching part info:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="flex gap-4 mb-8">
        <button
          onClick={handleBackToModel}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg 
                     transition-colors duration-200 flex items-center gap-2
                     border border-gray-700"
        >
          ← Back to Model
        </button>

        <button
          onClick={handleBackToHome}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg 
                     transition-colors duration-200 flex items-center gap-2
                     border border-gray-700"
        >
          ← Back to Systems
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        {decodeURIComponent(params.name).replace(/_/g, ' ')}
      </h1>

      {!hasSubmittedAge ? (
        <form onSubmit={handleAgeSubmit} className="space-y-4">
          <div>
            <label htmlFor="age" className="block text-lg mb-2">
              Please enter your age for age-appropriate information:
            </label>
            <input
              type="number"
              id="age"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="w-full max-w-[200px] px-4 py-2 bg-gray-800 rounded-lg 
                       border border-gray-700 focus:border-blue-500 focus:ring-1 
                       focus:ring-blue-500 outline-none"
              placeholder="Enter age"
              required
            />
          </div>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg
                     transition-colors duration-200"
          >
            Get Information
          </button>
        </form>
      ) : (
        <div className="prose prose-invert max-w-none">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
          ) : (
            <p className="text-lg leading-relaxed">
              {partInfo}
            </p>
          )}
        </div>
      )}
    </div>
  )
}