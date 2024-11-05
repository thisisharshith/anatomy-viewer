'use client'

import { useEffect } from 'react'
import * as THREE from 'three'

// Desk Component
function Desk() {
  return (
    <group position={[0, -2, -6]}>
      {/* Table Top */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[4, 0.1, 2]} />
        <meshStandardMaterial 
          color="#5c4033"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Legs */}
      {[[-1.8, -1, -0.8], [1.8, -1, -0.8], [-1.8, -1, 0.8], [1.8, -1, 0.8]].map((pos, index) => (
        <mesh key={index} position={pos} castShadow>
          <boxGeometry args={[0.1, 2, 0.1]} />
          <meshStandardMaterial 
            color="#3d2b1f"
            roughness={0.3}
            metalness={0.1}
          />
        </mesh>
      ))}

      {/* Back Panel */}
      <mesh position={[0, -0.5, -0.9]} castShadow>
        <boxGeometry args={[3.8, 1, 0.05]} />
        <meshStandardMaterial 
          color="#3d2b1f"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>
    </group>
  )
}

// Chandelier Component
function Chandelier() {
  return (
    <group position={[0, 6, -4]}>
      {/* Main body */}
      <mesh castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.5, 32]} />
        <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Decorative arms and lights */}
      {[0, 1, 2, 3].map((i) => (
        <group key={i} rotation={[0, (i * Math.PI) / 2, 0]}>
          <mesh position={[0.8, -0.2, 0]} castShadow>
            <sphereGeometry args={[0.15, 32, 32]} />
            <meshStandardMaterial 
              color="#FFF" 
              emissive="#FFF"
              emissiveIntensity={0.5}
              transparent
              opacity={0.9}
            />
          </mesh>
          <mesh position={[0.4, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 0.4, 8]} />
            <meshStandardMaterial color="#B8860B" metalness={0.8} roughness={0.2} />
          </mesh>
        </group>
      ))}
      
      {/* Chandelier lights */}
      {[0, 1, 2, 3].map((i) => (
        <pointLight
          key={`light-${i}`}
          position={[
            Math.sin((i * Math.PI) / 2) * 0.8,
            -0.2,
            Math.cos((i * Math.PI) / 2) * 0.8
          ]}
          intensity={0.5}
          distance={5}
          color="#FFF"
          castShadow
        />
      ))}
    </group>
  )
}

// Room Component
export function Room() {
  const marbleMaterial = new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.2,
    roughness: 0.1,
    clearcoat: 1,
    clearcoatRoughness: 0.2,
  })

  return (
    <>
      {/* Marble Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <primitive object={marbleMaterial} attach="material" />
      </mesh>

      {/* Back Wall */}
      <mesh position={[0, 3, -8]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color="#8B7355"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Left Wall */}
      <mesh position={[-10, 3, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial 
          color="#9F8170"
          roughness={0.3}
          metalness={0.1}
        />
      </mesh>

      {/* Ceiling */}
      <mesh position={[0, 8, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial 
          color="#ffffff"
          roughness={0.5}
        />
      </mesh>

      {/* Room Trim */}
      <mesh position={[0, -1.9, -8]} castShadow receiveShadow>
        <boxGeometry args={[20, 0.3, 0.3]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>
      <mesh position={[-10, -1.9, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.3, 0.3, 20]} />
        <meshStandardMaterial color="#5C4033" />
      </mesh>

      <Desk />
      <Chandelier />
    </>
  )
}