'use client'

import { useState, useEffect } from 'react'
import QuizScene from './QuizScene'

export default function MeshQuiz({ userInfo, onClose }) {
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [currentSystem, setCurrentSystem] = useState('digestive')
  const [userAnswer, setUserAnswer] = useState(null)
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState(null)

  const questions = [
    {
      question: "Can you identify the stomach in this model?",
      targetPart: "Stomach",
      hint: "Look for a J-shaped organ in the upper left part of the abdomen",
      system: "digestive",
      explanation: "The stomach is a J-shaped organ that's part of the digestive system."
    },
    {
      question: "Can you identify the left lung in this model?",
      targetPart: "Left_Lung",
      hint: "Look for the large organ on the left side of the chest cavity",
      system: "respiratory",
      explanation: "The left lung is slightly smaller than the right lung due to the heart's position."
    }
  ]

  const [question, setQuestion] = useState(questions[0])

  useEffect(() => {
    setTotalQuestions(questions.length)
  }, [])

  const handlePartSelect = (partName) => {
    console.log('Selected part:', partName)
    setUserAnswer(partName)
  }

  const checkAnswer = () => {
    console.log('Checking answer:', {
      userAnswer,
      targetPart: question.targetPart,
      isMatch: userAnswer === question.targetPart
    })
    
    const isCorrect = userAnswer === question.targetPart
    setFeedback({
      isCorrect,
      message: isCorrect ? 
        `Correct! ${question.explanation}` : 
        `Incorrect. The correct answer was ${question.targetPart.replace(/_/g, ' ')}. ${question.explanation}`
    })
    if (isCorrect) {
      setScore(prev => prev + 1)
    }
  }

  const getNewQuestion = () => {
    const currentIndex = questions.findIndex(q => q.targetPart === question.targetPart)
    const nextIndex = (currentIndex + 1) % questions.length
    setQuestion(questions[nextIndex])
    setCurrentSystem(questions[nextIndex].system)
    setUserAnswer(null)
    setShowHint(false)
    setFeedback(null)
  }

  return (
    <div className="h-screen flex flex-col">
      <QuizScene
        targetPart={question?.targetPart}
        selectedSystem={currentSystem}
        onPartSelect={handlePartSelect}
        question={question}
        userAnswer={userAnswer}
        showHint={showHint}
        setShowHint={setShowHint}
        feedback={feedback}
        score={score}
        totalQuestions={totalQuestions}
        checkAnswer={checkAnswer}
        getNewQuestion={getNewQuestion}
      />
    </div>
  )
}