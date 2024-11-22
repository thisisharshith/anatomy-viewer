'use client'

import { useState } from 'react' // Import useState hook to manage form state

// Main component to select quiz type and submit form
export default function QuizTypeSelector({ onStart }) {
    const [age, setAge] = useState('') // State to store user's age
    const [profession, setProfession] = useState('') // State to store user's profession
    const [selectedType, setSelectedType] = useState(null) // State to store selected quiz type (text or mesh)

    // Handle form submission
    const handleSubmit = (e) => {
      e.preventDefault() // Prevent default form submission behavior
      if (!selectedType || !age) return // Ensure that type and age are provided

      // Trigger the onStart function with the form data
      onStart({
        age: parseInt(age), // Convert age to an integer
        profession, // Pass profession
        type: selectedType // Pass selected quiz type
      })
    }

    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4"> {/* Full-screen background with centering */}
        <div className="bg-gray-800 rounded-xl p-8 max-w-md w-full border border-gray-700"> {/* Main form container */}
          <h1 className="text-2xl font-bold text-white mb-6">Anatomy Quiz</h1> {/* Heading */}

          <form onSubmit={handleSubmit} className="space-y-6"> {/* Form container with space between sections */}
            {/* Age input field */}
            <div>
              <label className="block text-white mb-2">Age</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)} // Update age state on input change
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                required
                min="1"
                max="120"
              />
            </div>

            {/* Profession input field (optional) */}
            <div>
              <label className="block text-white mb-2">Profession (optional)</label>
              <input
                type="text"
                value={profession}
                onChange={(e) => setProfession(e.target.value)} // Update profession state on input change
                className="w-full px-4 py-2 bg-gray-700 rounded-lg text-white"
                placeholder="e.g., Doctor, Student"
              />
            </div>

            {/* Quiz Type selection */}
            <div className="space-y-4">
              <h3 className="text-white">Select Quiz Type:</h3>
              <div className="grid grid-cols-2 gap-4"> {/* Grid layout for quiz type buttons */}
                {/* Text Quiz selection */}
                <button
                  type="button"
                  onClick={() => setSelectedType('text')} // Set quiz type to 'text'
                  className={`p-4 rounded-lg border ${
                    selectedType === 'text' 
                      ? 'border-blue-500 bg-blue-500/20' // Highlight selected option
                      : 'border-gray-600 hover:border-blue-400' // Default styling for non-selected options
                  }`}
                >
                  <h4 className="text-white font-bold">Text Quiz</h4>
                  <p className="text-sm text-gray-300">Answer anatomy questions</p>
                </button>

                {/* 3D Quiz selection */}
                <button
                  type="button"
                  onClick={() => setSelectedType('mesh')} // Set quiz type to 'mesh'
                  className={`p-4 rounded-lg border ${
                    selectedType === 'mesh' 
                      ? 'border-blue-500 bg-blue-500/20' // Highlight selected option
                      : 'border-gray-600 hover:border-blue-400' // Default styling for non-selected options
                  }`}
                >
                  <h4 className="text-white font-bold">3D Quiz</h4>
                  <p className="text-sm text-gray-300">Identify parts in 3D model</p>
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={!selectedType || !age} // Disable button if type or age is missing
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