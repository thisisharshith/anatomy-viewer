import { NextResponse } from 'next/server'
import { generateQuestion } from '@/utils/quizGroq'

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const age = parseInt(searchParams.get('age')) || 25
    const profession = searchParams.get('profession') || ''

    const questionData = await generateQuestion(age, profession)
    
    return NextResponse.json({
      id: Date.now(),
      ...questionData
    })
  } catch (error) {
    console.error('Error in quiz question route:', error)
    return NextResponse.json(
      { error: 'Failed to generate question' },
      { status: 500 }
    )
  }
}