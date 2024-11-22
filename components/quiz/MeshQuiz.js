'use client'

import { useState, useEffect } from 'react' // Import React hooks for managing state and side effects
import QuizScene from './QuizScene' // Import QuizScene component to display the 3D model and quiz interface

// Main MeshQuiz component
export default function MeshQuiz({ userInfo, onClose }) {
  // State variables to manage quiz state
  const [score, setScore] = useState(0) // Track the user's score
  const [totalQuestions, setTotalQuestions] = useState(0) // Track the total number of questions
  const [currentSystem, setCurrentSystem] = useState('digestive') // Track the current system (e.g., digestive)
  const [userAnswer, setUserAnswer] = useState(null) // Store the user's selected answer
  const [showHint, setShowHint] = useState(false) // Control the visibility of hints
  const [feedback, setFeedback] = useState(null) // Store feedback after the user answers

  // Predefined list of questions with associated anatomy systems and explanations
  const questions = [
    {
      question: "Can you identify the stomach in this model?", // Question text
      targetPart: "Stomach", // The correct anatomical part to be identified
      hint: "Look for a J-shaped organ in the upper left part of the abdomen", // Hint to help with identification
      system: "digestive", // The anatomical system associated with the question
      explanation: "The stomach is a J-shaped organ that's part of the digestive system." // Explanation of the correct answer
    },
    {
      question: "Can you identify the left lung in this model?", // Question text
      targetPart: "Left_Lung", // The correct anatomical part to be identified
      hint: "Look for the large organ on the left side of the chest cavity", // Hint to help with identification
      system: "respiratory", // The anatomical system associated with the question
      explanation: "The left lung is slightly smaller than the right lung due to the heart's position." // Explanation of the correct answer
    }
  ]

  const [question, setQuestion] = useState(questions[0]) // Initialize the first question

  // Effect hook to update the total question count once the questions array is set
  useEffect(() => {
    setTotalQuestions(questions.length) // Set the total number of questions
  }, [])

  // Handle part selection when a user clicks on an anatomical part in the 3D model
  const handlePartSelect = (partName) => {
    console.log('Selected part:', partName) // Log the selected part for debugging
    setUserAnswer(partName) // Set the user's selected answer
  }

  // Function to check if the user's answer matches the correct answer
  const checkAnswer = () => {
    console.log('Checking answer:', {
      userAnswer,
      targetPart: question.targetPart,
      isMatch: userAnswer === question.targetPart // Check if the user's answer matches the target part
    })
    
    // Determine if the user's answer is correct and set feedback accordingly
    const isCorrect = userAnswer === question.targetPart
    setFeedback({
      isCorrect, // Boolean indicating whether the answer was correct
      message: isCorrect ? 
        `Correct! ${question.explanation}` : 
        `Incorrect. The correct answer was ${question.targetPart.replace(/_/g, ' ')}. ${question.explanation}` // Explanation for the user
    })
    if (isCorrect) {
      setScore(prev => prev + 1) // Increase the score if the answer is correct
    }
  }

  // Function to load a new question after the current one is answered
  const getNewQuestion = () => {
    const currentIndex = questions.findIndex(q => q.targetPart === question.targetPart) // Find the current question's index
    const nextIndex = (currentIndex + 1) % questions.length // Get the next question's index (looping back to the first question if needed)
    setQuestion(questions[nextIndex]) // Set the new question
    setCurrentSystem(questions[nextIndex].system) // Set the new system for the question
    setUserAnswer(null) // Reset the user's answer
    setShowHint(false) // Hide the hint
    setFeedback(null) // Reset the feedback
  }

  return (
    <div className="h-screen flex flex-col"> // Container for the quiz interface
      <QuizScene
        targetPart={question?.targetPart} // Pass the current question's target part to the scene
        selectedSystem={currentSystem} // Pass the current system (e.g., digestive) to the scene
        onPartSelect={handlePartSelect} // Pass the function to handle part selection
        question={question} // Pass the current question object to the scene
        userAnswer={userAnswer} // Pass the user's selected answer
        showHint={showHint} // Pass the state for showing hints
        setShowHint={setShowHint} // Pass the function to toggle hint visibility
        feedback={feedback} // Pass the feedback after the user answers
        score={score} // Pass the current score
        totalQuestions={totalQuestions} // Pass the total number of questions
        checkAnswer={checkAnswer} // Pass the function to check the user's answer
        getNewQuestion={getNewQuestion} // Pass the function to load a new question
      />
    </div>
  )
}