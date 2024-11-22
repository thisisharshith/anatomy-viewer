'use client'

import { Canvas } from '@react-three/fiber' // Import Canvas component from React Three Fiber to render 3D scene
import { OrbitControls, Environment, Html } from '@react-three/drei' // Import helpers for controls, environment, and HTML overlay
import { Suspense } from 'react' // Import Suspense for lazy loading 3D assets
import QuizModelViewer from './QuizModelViewer' // Import QuizModelViewer component for rendering 3D models in the scene

// Room component to create the background and room elements (floor, walls)
function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh 
        receiveShadow 
        rotation-x={-Math.PI / 2} // Rotate floor to lie flat
        position={[0, -4, 0]} // Position the floor beneath the model
      >
        <planeGeometry args={[50, 50]} /> {/* Large plane geometry for the floor */}
        <meshStandardMaterial 
          color="#404040" // Dark gray floor color
          roughness={0.8} // Rough surface for non-reflective material
          metalness={0.2} // Slightly metallic finish
        />
      </mesh>

      {/* Back Wall */}
      <mesh 
        receiveShadow 
        position={[0, 10, -15]} // Position the back wall
      >
        <planeGeometry args={[50, 30]} /> {/* Large vertical plane geometry */}
        <meshStandardMaterial 
          color="#4a4a4a" // Dark gray wall color
          roughness={0.7} // Rough surface finish
          metalness={0.2} // Slight metallic finish
        />
      </mesh>

      {/* Left Wall */}
      <mesh 
        receiveShadow 
        position={[-25, 10, 0]} // Position the left wall
        rotation-y={Math.PI / 2} // Rotate the wall to be vertical
      >
        <planeGeometry args={[40, 30]} /> {/* Wall geometry */}
        <meshStandardMaterial 
          color="#454545" // Slightly lighter gray color
          roughness={0.7} // Rough surface finish
          metalness={0.2} // Slight metallic finish
        />
      </mesh>

      {/* Right Wall */}
      <mesh 
        receiveShadow 
        position={[25, 10, 0]} // Position the right wall
        rotation-y={-Math.PI / 2} // Rotate the wall to face the opposite direction
      >
        <planeGeometry args={[40, 30]} /> {/* Wall geometry */}
        <meshStandardMaterial 
          color="#454545" // Same color as left wall
          roughness={0.7} // Rough surface finish
          metalness={0.2} // Slight metallic finish
        />
      </mesh>
    </group>
  )
}

// Main QuizScene component
export default function QuizScene({ targetPart, selectedSystem, onPartSelect, question, userAnswer, showHint, setShowHint, feedback, score, totalQuestions, checkAnswer, getNewQuestion }) {
  return (
    <div style={{ 
      position: 'fixed', // Fix the quiz scene to the full screen
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#2a2a2a', // Dark background for the scene
      overflow: 'hidden' // Prevent overflow of content
    }}>
      <Canvas
        shadows // Enable shadows for objects
        camera={{ 
          position: [0, 2, 8], // Set the camera position in the 3D scene
          fov: 50, // Set field of view
          near: 0.1, // Set near clipping plane
          far: 1000 // Set far clipping plane
        }}
      >
        <Suspense fallback={null}> {/* Suspense to handle loading of 3D assets */}
          {/* Lighting Setup */}
          <ambientLight intensity={0.4} /> {/* Soft ambient light */}
          <directionalLight
            castShadow
            position={[10, 10, 10]} // Directional light source position
            intensity={1.5} // Light intensity
            shadow-mapSize={[2048, 2048]} // Set shadow map resolution
          >
            <orthographicCamera attach="shadow-camera" args={[-15, 15, -15, 15, 0.1, 50]} /> {/* Camera for shadows */}
          </directionalLight>
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" /> {/* Additional point light */}
          <pointLight position={[5, 5, -5]} intensity={0.5} color="#ffffff" /> {/* Another point light */}

          {/* Room Elements */}
          <Room />

          {/* Quiz Interface */}
          <Html
            position={[-6, 2, 0]} // Position the HTML overlay in 3D space
            transform
            rotation-y={0.3} // Rotate the overlay slightly
            style={{
              width: '400px',
              transition: 'all 0.2s', // Smooth transition effect
              opacity: 0.9
            }}
          >
            <div className="bg-gray-900/90 p-4 rounded-lg backdrop-blur-sm border border-gray-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">3D Anatomy Quiz</h2>
              <div className="space-y-4">
                <p className="text-white">Score: {score}/{totalQuestions}</p>
                <p className="text-lg text-white">{question?.question}</p>
                {showHint ? (
                  <p className="text-sm text-blue-300">{question?.hint}</p> // Show hint if available
                ) : (
                  <button onClick={() => setShowHint(true)} className="text-sm text-blue-400 hover:text-blue-300">
                    Need a hint?
                  </button>
                )}
                <div className="bg-gray-800/50 rounded p-2">
                  <p className="text-white">Selected: {userAnswer || 'None'}</p> {/* Show selected answer */}
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer} // Disable submit if no answer selected
                    className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white disabled:opacity-50"
                  >
                    Submit
                  </button>
                  <button
                    onClick={getNewQuestion}
                    className="flex-1 px-3 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
                  >
                    Next
                  </button>
                </div>
                {feedback && (
                  <div className={`rounded p-2 ${feedback.isCorrect ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
                    <p className="text-white">{feedback.message}</p> {/* Display feedback */}
                  </div>
                )}
              </div>
            </div>
          </Html>

          {/* 3D Model */}
          <group position={[2, -1, 0]} scale={2}>
            <QuizModelViewer
              targetPart={targetPart}
              selectedSystem={selectedSystem}
              onPartSelect={onPartSelect}
            />
          </group>

          {/* Orbit Controls */}
          <OrbitControls 
            target={[0, 0, 0]} // Set the orbit target to the center
            maxPolarAngle={Math.PI * 0.85} // Limit vertical rotation
            minPolarAngle={Math.PI * 0.15} // Set the minimum vertical angle
            minAzimuthAngle={-Math.PI * 0.5} // Limit horizontal rotation
            maxAzimuthAngle={Math.PI * 0.5} // Limit horizontal rotation
            minDistance={2} // Set the closest camera distance
            maxDistance={20} // Set the farthest camera distance
            enablePan={true} // Allow panning
          />
          
          {/* Environment Settings */}
          <Environment preset="studio" intensity={0.5} /> {/* Studio lighting preset */}
          <fog attach="fog" args={['#2a2a2a', 20, 50]} /> {/* Fog effect to enhance depth */}
        </Suspense>
      </Canvas>
    </div>
  )
} 