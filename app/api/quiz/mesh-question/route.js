import { NextResponse } from 'next/server'
import { generateMeshQuestion } from '@/utils/quizGroq'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const age = parseInt(searchParams.get('age')) || 25
    const profession = searchParams.get('profession') || ''

    // For now, return a static question until we implement generateMeshQuestion
    const questionData = {
      id: Date.now(),
      question: "Can you identify the lungs in this model?",
      hint: "Look for the two large organs on either side of the chest",
      correctAnswer: "lungs",
      targetPart: "lungs",
      system: "respiratory",
      difficulty: "easy",
    }
    
    return NextResponse.json(questionData)
  } catch (error) {
    console.error('Error in mesh question route:', error)
    return NextResponse.json(
      { error: 'Failed to generate mesh question' },
      { status: 500 }
    )
  }
}