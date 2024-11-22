// Import necessary modules and utilities.
import { NextResponse } from 'next/server' // For handling server responses.
import { generateMeshQuestion } from '@/utils/quizGroq' // Placeholder for generating mesh questions dynamically.

export async function GET(request) {
  try {
    // Extract query parameters from the request URL.
    const { searchParams } = new URL(request.url)
    const age = parseInt(searchParams.get('age')) || 25 // Default age to 25 if not provided.
    const profession = searchParams.get('profession') || '' // Default to an empty string if not provided.

    // Placeholder: Static question data for now, until `generateMeshQuestion` is implemented.
    const questionData = {
      id: Date.now(), // Unique identifier for the question.
      question: "Can you identify the lungs in this model?", // The question to display.
      hint: "Look for the two large organs on either side of the chest", // A hint to assist the user.
      correctAnswer: "lungs", // Correct answer for validation.
      targetPart: "lungs", // The target anatomical part in the 3D model.
      system: "respiratory", // Associated system of the anatomical part.
      difficulty: "easy", // Difficulty level of the question.
    }

    // Return the static question data as a JSON response.
    return NextResponse.json(questionData)
  } catch (error) {
    // Log the error to the server console for debugging.
    console.error('Error in mesh question route:', error)

    // Return an error response if something goes wrong.
    return NextResponse.json(
      { error: 'Failed to generate mesh question' }, // Error message.
      { status: 500 } // HTTP status code for Internal Server Error.
    )
  }
}
