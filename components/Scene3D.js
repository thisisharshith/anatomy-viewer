'use client' // Indicates this is a client-side component in Next.js.

import { Canvas } from '@react-three/fiber' // Import Canvas component for setting up the 3D scene.
import { OrbitControls, Environment } from '@react-three/drei' // Import OrbitControls for scene interaction and Environment for lighting effects.
import { Suspense } from 'react' // Import Suspense for handling async operations in React.
import ModelViewer from './ModelViewer' // Import the ModelViewer component for rendering the 3D model.

function Room() {
  return (
    <group>
      {/* Floor */}
      <mesh 
        receiveShadow 
        rotation-x={-Math.PI / 2} // Rotate the floor to align with the scene.
        position={[0, -4, 0]} // Position of the floor in 3D space.
      >
        <planeGeometry args={[50, 50]} /> {/* Define a large plane for the floor. */}
        <meshStandardMaterial 
          color="#404040" // Dark gray color for the floor.
          roughness={0.8} // Roughness to make it less shiny.
          metalness={0.2} // Metalness to make it slightly metallic.
        />
      </mesh>

      {/* Back Wall */}
      <mesh 
        receiveShadow 
        position={[0, 10, -15]} // Position of the back wall.
      >
        <planeGeometry args={[50, 30]} /> {/* Define a large plane for the back wall. */}
        <meshStandardMaterial 
          color="#4a4a4a" // Darker gray for the back wall.
          roughness={0.7} // Slightly less rough than the floor.
          metalness={0.2} // Metalness for a non-metallic look.
        />
      </mesh>

      {/* Left Wall */}
      <mesh 
        receiveShadow 
        position={[-25, 10, 0]} // Position of the left wall.
        rotation-y={Math.PI / 2} // Rotate the wall to face the correct direction.
      >
        <planeGeometry args={[40, 30]} /> {/* Define the left wall geometry. */}
        <meshStandardMaterial 
          color="#454545" // Medium gray color for the left wall.
          roughness={0.7} // Roughness for a matte finish.
          metalness={0.2} // Metalness for a non-reflective surface.
        />
      </mesh>

      {/* Right Wall */}
      <mesh 
        receiveShadow 
        position={[25, 10, 0]} // Position of the right wall.
        rotation-y={-Math.PI / 2} // Rotate the wall to face the opposite direction.
      >
        <planeGeometry args={[40, 30]} /> {/* Define the right wall geometry. */}
        <meshStandardMaterial 
          color="#454545" // Same color as the left wall.
          roughness={0.7} // Roughness to match the left wall.
          metalness={0.2} // Metalness to keep the surface matte.
        />
      </mesh>
    </group>
  )
}

export default function Scene3D({ selectedSystem }) {
  return (
    <div style={{ 
      position: 'fixed', // Ensure the scene takes up the entire window.
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#2a2a2a', // Dark background color for the scene.
      overflow: 'hidden' // Prevent overflow to keep the 3D canvas within the viewport.
    }}>
      <Canvas
        shadows
        camera={{ 
          position: [0, 2, 8], // Initial camera position.
          fov: 50, // Field of view for the camera.
          near: 0.1, // Near plane distance.
          far: 1000 // Far plane distance.
        }}
      >
        <Suspense fallback={null}> {/* Suspense for loading async components. */}
          {/* Lighting */}
          <ambientLight intensity={0.4} /> {/* Reduced ambient light for subtle illumination. */}
          <directionalLight
            castShadow
            position={[10, 10, 10]} // Position of the main directional light.
            intensity={1.5} // Higher intensity for better lighting.
            shadow-mapSize={[2048, 2048]} // Increase shadow map size for better quality shadows.
          >
            <orthographicCamera attach="shadow-camera" args={[-15, 15, -15, 15, 0.1, 50]} /> {/* Set up shadow camera. */}
          </directionalLight>

          {/* Accent lights */}
          <pointLight position={[-5, 5, 5]} intensity={0.5} color="#ffffff" /> {/* Light from the left. */}
          <pointLight position={[5, 5, -5]} intensity={0.5} color="#ffffff" /> {/* Light from the right. */}

          {/* Room */}
          <Room /> {/* Add the room structure to the scene. */}

          {/* 3D Model Viewer */}
          <ModelViewer selectedSystem={selectedSystem} />

          {/* OrbitControls */}
          <OrbitControls 
            target={[0, 0, 0]} // Set the target for orbit controls (center of the scene).
            maxPolarAngle={Math.PI * 0.85} // Limit vertical rotation.
            minPolarAngle={Math.PI * 0.15} // Limit vertical rotation.
            minAzimuthAngle={-Math.PI * 0.5} // Limit horizontal rotation.
            maxAzimuthAngle={Math.PI * 0.5} // Limit horizontal rotation.
            minDistance={2} // Minimum zoom distance.
            maxDistance={20} // Maximum zoom distance.
            enablePan={true} // Enable panning of the camera.
          />
          
          {/* Environment Lighting */}
          <Environment preset="studio" intensity={0.5} /> {/* Studio lighting for the scene. */}

          {/* Fog for depth */}
          <fog attach="fog" args={['#2a2a2a', 20, 50]} /> {/* Add fog for better depth perception. */}
        </Suspense>
      </Canvas>
    </div>
  )
}