// Import necessary modules and utilities.
import { NextResponse } from 'next/server' // For handling server responses.
import { generateQuestion } from '@/utils/quizGroq' // Utility function to dynamically generate a quiz question.

export async function GET(request) {
  try {
    // Extract query parameters from the request URL.
    const { searchParams } = new URL(request.url)
    const age = parseInt(searchParams.get('age')) || 25 // Default age to 25 if not provided.
    const profession = searchParams.get('profession') || '' // Default to an empty string if not provided.

    // Dynamically generate a question based on the user's age and profession.
    const questionData = await generateQuestion(age, profession)

    // Return the generated question data as a JSON response, adding a unique ID.
    return NextResponse.json({
      id: Date.now(), // Unique identifier for the question.
      ...questionData // Include all the data from the generated question.
    })
  } catch (error) {
    // Log the error to the server console for debugging.
    console.error('Error in quiz question route:', error)

    // Return an error response if something goes wrong.
    return NextResponse.json(
      { error: 'Failed to generate question' }, // Error message.
      { status: 500 } // HTTP status code for Internal Server Error.
    )
  }
}
