'use client' // This directive enables React's experimental server-client rendering mode.

import { useRouter } from 'next/navigation' // Importing the useRouter hook for programmatic navigation.
import { useState, useEffect } from 'react' // React hooks for state management and side effects.
import { getAnatomyInfo } from '@/utils/groq' // Utility function to fetch anatomy information based on part name and age.

export default function PartDetails({ params }) {
  const router = useRouter() // Initialize Next.js router for navigation.
  const [partInfo, setPartInfo] = useState("") // State to store the fetched information about the selected anatomy part.
  const [isLoading, setIsLoading] = useState(false) // State to track loading status while fetching data.
  const [age, setAge] = useState("") // State to capture the user's age input.
  const [hasSubmittedAge, setHasSubmittedAge] = useState(false) // State to track whether the age has been submitted.

  // Function to navigate back to the 3D model view of the previously selected system.
  const handleBackToModel = () => {
    const previousSystem = localStorage.getItem('previousSystem') // Retrieve the previously viewed system from local storage.
    router.push(`/?system=${previousSystem}`) // Navigate to the model view with the system query parameter.
  }

  // Function to navigate back to the main systems overview page.
  const handleBackToHome = () => {
    router.push('/') // Navigate to the homepage or main systems page.
  }

  // Function to handle the submission of the user's age and fetch age-appropriate information about the selected anatomy part.
  const handleAgeSubmit = async (e) => {
    e.preventDefault() // Prevent the default form submission behavior.
    setIsLoading(true) // Set loading state to true while fetching data.

    try {
      const decodedName = decodeURIComponent(params.name) // Decode the part name from URL parameters.
      const info = await getAnatomyInfo(decodedName, parseInt(age)) // Fetch anatomy information based on the part name and user-provided age.
      setPartInfo(info) // Update the state with the fetched information.
      setHasSubmittedAge(true) // Mark age submission as complete.
    } catch (error) {
      console.error('Error fetching part info:', error) // Log any errors that occur during the fetch.
    } finally {
      setIsLoading(false) // Reset loading state after fetch is complete.
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
        {decodeURIComponent(params.name).replace(/_/g, ' ')} {/* Render the human-readable name of the anatomy part */}
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
              onChange={(e) => setAge(e.target.value)} // Update the age state with user input.
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
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div> {/* Spinner for loading state */}
            </div>
          ) : (
            <p className="text-lg leading-relaxed">
              {partInfo} {/* Render the fetched anatomy information */}
            </p>
          )}
        </div>
      )}
    </div>
  )
}