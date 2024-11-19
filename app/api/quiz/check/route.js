import { NextResponse } from 'next/server'
import { checkAnswer } from '@/utils/quizGroq'

export async function POST(request) {
  try {
    const body = await request.json()
    if (!body || !body.userAnswer || !body.correctAnswer) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const { userAnswer, correctAnswer, age = 25 } = body
    
    const result = await checkAnswer(userAnswer, correctAnswer, age)
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error in quiz check route:', error)
    return NextResponse.json(
      { error: 'Failed to check answer' },
      { status: 500 }
    )
  }
}