'use client'

import { useState, useEffect } from 'react'

export default function TextQuiz({ userInfo, onClose }) {
  const [question, setQuestion] = useState(null)
  const [userAnswer, setUserAnswer] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [feedback, setFeedback] = useState(null)
  const [score, setScore] = useState(0)
  const [totalQuestions, setTotalQuestions] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const getNewQuestion = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(
        `/api/quiz/question?age=${userInfo.age}&profession=${encodeURIComponent(userInfo.profession)}`
      )
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      setQuestion(data)
      setUserAnswer('')
      setFeedback(null)
      setShowHint(false)
    } catch (error) {
      console.error('Error fetching question:', error)
      setQuestion({
        id: Date.now(),
        question: "What organ pumps blood through your body?",
        hint: "You can feel it beating in your chest!",
        correctAnswer: "heart",
        difficulty: "easy",
        funFact: "Your heart beats about 100,000 times every day!"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const checkAnswer = async () => {
    if (!userAnswer.trim()) return

    setIsLoading(true)
    try {
      const response = await fetch('/api/quiz/check', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userAnswer: userAnswer.trim(),
          correctAnswer: question.correctAnswer,
          age: userInfo.age,
          profession: userInfo.profession
        }),
      })
      const data = await response.json()
      setFeedback(data)
      if (data.isCorrect) {
        setScore(score + 1)
      }
      setTotalQuestions(totalQuestions + 1)
    } catch (error) {
      console.error('Error checking answer:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getNewQuestion()
  }, [])

  return (
    <div className="min-h-screen bg-gray-900 p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Anatomy Quiz</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            Close
          </button>
        </div>

        {/* Score */}
        <div className="bg-gray-800 rounded-lg p-4">
          <p className="text-white">
            Score: {score}/{totalQuestions}
          </p>
        </div>

        {/* Question */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading question...</p>
          </div>
        ) : question ? (
          <div className="space-y-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-lg text-white mb-2">{question.question}</p>
              {showHint && (
                <p className="text-sm text-blue-300">{question.hint}</p>
              )}
              {!showHint && (
                <button
                  onClick={() => setShowHint(true)}
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Show Hint
                </button>
              )}
            </div>

            {/* Answer Input */}
            <div className="space-y-4">
              <input
                type="text"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                placeholder="Type your answer..."
                className="w-full px-4 py-2 bg-gray-800 rounded-lg text-white
                         border border-gray-700 focus:border-blue-500"
              />
              <div className="flex space-x-4">
                <button
                  onClick={checkAnswer}
                  disabled={isLoading || !userAnswer.trim()}
                  className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700
                           rounded-lg text-white disabled:opacity-50"
                >
                  Submit Answer
                </button>
                <button
                  onClick={getNewQuestion}
                  disabled={isLoading}
                  className="px-6 py-3 bg-gray-700 hover:bg-gray-600
                           rounded-lg text-white disabled:opacity-50"
                >
                  Next Question
                </button>
              </div>
            </div>

            {/* Feedback */}
            {feedback && (
              <div className={`p-4 rounded-lg ${
                feedback.isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'
              }`}>
                <p className="font-semibold text-white">
                  {feedback.isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                </p>
                <p className="mt-2 text-white">{feedback.explanation}</p>
                {feedback.educationalNote && (
                  <p className="mt-2 text-blue-300">
                    {feedback.educationalNote}
                  </p>
                )}
                {feedback.technicalNote && userInfo.profession && (
                  <p className="mt-2 text-green-300">
                    {feedback.technicalNote}
                  </p>
                )}
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white">Failed to load question. Please try again.</p>
          </div>
        )}
      </div>
    </div>
  )
}