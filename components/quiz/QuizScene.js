'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment, Html } from '@react-three/drei'
import { Suspense } from 'react'
import QuizModelViewer from './QuizModelViewer'

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh 
        receiveShadow 
        rotation-x={-Math.PI / 2} 
        position={[0, -4, 0]}
      >
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial 
          color="#404040" 
          roughness={0.8}
          metalness={0.2}
        />
      </mesh>

      {/* Back Wall */}
      <mesh 
        receiveShadow 
        position={[0, 10, -15]}
      >
        <planeGeometry args={[50, 30]} />
        <meshStandardMaterial 
          color="#4a4a4a"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Left Wall */}
      <mesh 
        receiveShadow 
        position={[-25, 10, 0]} 
        rotation-y={Math.PI / 2}
      >
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial 
          color="#454545"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>

      {/* Right Wall */}
      <mesh 
        receiveShadow 
        position={[25, 10, 0]} 
        rotation-y={-Math.PI / 2}
      >
        <planeGeometry args={[40, 30]} />
        <meshStandardMaterial 
          color="#454545"
          roughness={0.7}
          metalness={0.2}
        />
      </mesh>
    </group>
  )
}

export default function QuizScene({ targetPart, selectedSystem, onPartSelect, question, userAnswer, showHint, setShowHint, feedback, score, totalQuestions, checkAnswer, getNewQuestion }) {
  return (
    <div style={{ 
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#2a2a2a',
      overflow: 'hidden'
    }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 2, 8],
          fov: 50,
          near: 0.1,
          far: 1000
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.4} />
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
          >
            <orthographicCamera attach="shadow-camera" args={[-15, 15, -15, 15, 0.1, 50]} />
          </directionalLight>
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" />
          <pointLight position={[5, 5, -5]} intensity={0.5} color="#ffffff" />

          {/* Room */}
          <Room />

          {/* Quiz Interface */}
          <Html
            position={[-6, 2, 0]}
            transform
            rotation-y={0.3}
            style={{
              width: '400px',
              transition: 'all 0.2s',
              opacity: 0.9
            }}
          >
            <div className="bg-gray-900/90 p-4 rounded-lg backdrop-blur-sm border border-gray-700 shadow-xl">
              <h2 className="text-xl font-bold text-white mb-4">3D Anatomy Quiz</h2>
              <div className="space-y-4">
                <p className="text-white">Score: {score}/{totalQuestions}</p>
                <p className="text-lg text-white">{question?.question}</p>
                {showHint ? (
                  <p className="text-sm text-blue-300">{question?.hint}</p>
                ) : (
                  <button onClick={() => setShowHint(true)} className="text-sm text-blue-400 hover:text-blue-300">
                    Need a hint?
                  </button>
                )}
                <div className="bg-gray-800/50 rounded p-2">
                  <p className="text-white">Selected: {userAnswer || 'None'}</p>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={checkAnswer}
                    disabled={!userAnswer}
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
                    <p className="text-white">{feedback.message}</p>
                  </div>
                )}
              </div>
            </div>
          </Html>

          {/* Model */}
          <group position={[2, -1, 0]} scale={2}>
            <QuizModelViewer
              targetPart={targetPart}
              selectedSystem={selectedSystem}
              onPartSelect={onPartSelect}
            />
          </group>

          <OrbitControls 
            target={[0, 0, 0]}
            maxPolarAngle={Math.PI * 0.85}
            minPolarAngle={Math.PI * 0.15}
            minAzimuthAngle={-Math.PI * 0.5}
            maxAzimuthAngle={Math.PI * 0.5}
            minDistance={2}
            maxDistance={20}
            enablePan={true}
          />
          
          <Environment preset="studio" intensity={0.5} />
          <fog attach="fog" args={['#2a2a2a', 20, 50]} />
        </Suspense>
      </Canvas>
    </div>
  )
} 