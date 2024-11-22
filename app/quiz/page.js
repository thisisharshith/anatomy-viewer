'use client' // Enables React's experimental server-client rendering mode.

import { useState } from 'react' // React hook for managing component state.
import TextQuiz from '@/components/quiz/TextQuiz' // Component for the text-based quiz.
import MeshQuiz from '@/components/quiz/MeshQuiz' // Component for the 3D model-based quiz.
import QuizTypeSelector from '@/components/quiz/QuizTypeSelector' // Component for selecting the quiz type.

export default function QuizPage() {
  const [userInfo, setUserInfo] = useState(null) // State to store user information and quiz type selection.

  // Function to handle the start of the quiz and update user information.
  const handleStartQuiz = (info) => {
    setUserInfo(info) // Set the user information, including age, profession, and selected quiz type.
  }

  // Render the quiz type selector if userInfo is not yet defined.
  if (!userInfo) {
    return <QuizTypeSelector onStart={handleStartQuiz} />
  }

  // Render the selected quiz type based on userInfo.
  return (
    <div className="min-h-screen bg-gray-900">
      {userInfo.type === 'text' ? (
        <TextQuiz userInfo={userInfo} onClose={() => setUserInfo(null)} /> // Render text-based quiz and reset on close.
      ) : (
        <MeshQuiz userInfo={userInfo} onClose={() => setUserInfo(null)} /> // Render 3D model-based quiz and reset on close.
      )}
    </div>
  )
}
