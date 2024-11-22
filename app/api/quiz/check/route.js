// Import necessary modules and utilities.
import { NextResponse } from 'next/server' // For handling server responses.
import { checkAnswer } from '@/utils/quizGroq' // Utility function to validate answers.

export async function POST(request) {
  try {
    // Parse the request body to extract the necessary data.
    const body = await request.json()

    // Validate the presence of required fields in the request body.
    if (!body || !body.userAnswer || !body.correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' }, // Return an error if fields are missing.
        { status: 400 } // HTTP status code for Bad Request.
      )
    }

    // Extract relevant data, providing a default age if not specified.
    const { userAnswer, correctAnswer, age = 25 } = body

    // Validate the user's answer using the `checkAnswer` utility.
    const result = await checkAnswer(userAnswer, correctAnswer, age)

    // Return the result as a JSON response.
    return NextResponse.json(result)
  } catch (error) {
    // Log the error to the server console for debugging.
    console.error('Error in quiz check route:', error)

    // Return an error response if something goes wrong.
    return NextResponse.json(
      { error: 'Failed to check answer' }, // Error message.
      { status: 500 } // HTTP status code for Internal Server Error.
    )
  }
}
