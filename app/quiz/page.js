'use client'

import { useState } from 'react'
import TextQuiz from '@/components/quiz/TextQuiz'
import MeshQuiz from '@/components/quiz/MeshQuiz'
import QuizTypeSelector from '@/components/quiz/QuizTypeSelector'

export default function QuizPage() {
  const [userInfo, setUserInfo] = useState(null)

  const handleStartQuiz = (info) => {
    setUserInfo(info)
  }

  if (!userInfo) {
    return <QuizTypeSelector onStart={handleStartQuiz} />
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {userInfo.type === 'text' ? (
        <TextQuiz userInfo={userInfo} onClose={() => setUserInfo(null)} />
      ) : (
        <MeshQuiz userInfo={userInfo} onClose={() => setUserInfo(null)} />
      )}
    </div>
  )
}