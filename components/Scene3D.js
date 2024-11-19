'use client'

import { Canvas } from '@react-three/fiber'
import { OrbitControls, Environment } from '@react-three/drei'
import { Suspense } from 'react'
import ModelViewer from './ModelViewer'

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

export default function Scene3D({ selectedSystem }) {
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
          <ambientLight intensity={0.4} /> {/* Reduced ambient light */}
          <directionalLight
            castShadow
            position={[10, 10, 10]}
            intensity={1.5}
            shadow-mapSize={[2048, 2048]}
          >
            <orthographicCamera attach="shadow-camera" args={[-15, 15, -15, 15, 0.1, 50]} />
          </directionalLight>

          {/* Add some accent lights for better visibility */}
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" />
          <pointLight position={[5, 5, -5]} intensity={0.5} color="#ffffff" />

          {/* Room */}
          <Room />

          {/* Model */}
          <ModelViewer selectedSystem={selectedSystem} />

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

          {/* Add some fog for depth */}
          <fog attach="fog" args={['#2a2a2a', 20, 50]} />
        </Suspense>
      </Canvas>
    </div>
  )
}