'use client'

import { Canvas, useThree } from '@react-three/fiber'
import { 
  useGLTF, 
  OrbitControls, 
  Environment,
} from '@react-three/drei'
import { EffectComposer, Bloom, Selection, Select, Outline } from '@react-three/postprocessing'
import { Suspense, useEffect, useState, useRef } from 'react'
import * as THREE from 'three'
import { Room } from './RoomElements'

// Info Panel Component
function InfoPanel({ selectedPart }) {
  if (!selectedPart) return null;

  return (
    <div
      style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        color: 'white',
        padding: '20px',
        borderRadius: '8px',
        maxWidth: '300px',
        zIndex: 1000,
        backdropFilter: 'blur(10px)'
      }}
    >
      <h3 style={{ marginBottom: '10px', color: '#4CAF50' }}>
        {selectedPart.name}
      </h3>
      <div style={{ fontFamily: 'monospace', fontSize: '14px' }}>
        {Object.entries(selectedPart.userData).map(([key, value]) => (
          <div key={key} style={{ marginBottom: '5px' }}>
            <strong style={{ color: '#90CAF9' }}>{key}:</strong>{' '}
            {value.toString()}
          </div>
        ))}
      </div>
    </div>
  )
}

// Animated Model Component
function Model({ onSelect }) {
  const { scene } = useGLTF('/models/anatomy.glb')
  const [hoveredPart, setHoveredPart] = useState(null)
  const [selectedPart, setSelectedPart] = useState(null)
  const [displayPart, setDisplayPart] = useState(null)
  const { camera, scene: threeScene } = useThree()
  const controlsRef = useRef()

  useEffect(() => {
    scene.traverse((object) => {
      if (object.isMesh) {
        object.castShadow = true
        object.receiveShadow = true
        if (object.material) {
          object.material.roughness = 0.7
          object.material.metalness = 0.3
        }
      }
    })
  }, [scene])

  const handlePointerOver = (event) => {
    event.stopPropagation()
    const part = event.object
    if (part !== selectedPart && part.material) {
      document.body.style.cursor = 'pointer'
      setHoveredPart(part)
      part.material.emissive = new THREE.Color(0x555555)
    }
  }

  const handlePointerOut = (event) => {
    event.stopPropagation()
    const part = event.object
    if (part !== selectedPart && part.material) {
      document.body.style.cursor = 'default'
      setHoveredPart(null)
      part.material.emissive = new THREE.Color(0x000000)
    }
  }

  const handleClick = (event) => {
    event.stopPropagation()
    const clickedPart = event.object
    console.log('Clicked:', clickedPart.name)

    if (clickedPart === selectedPart) {
      // Reset
      if (displayPart) {
        threeScene.remove(displayPart)
        displayPart.geometry.dispose()
        displayPart.material.dispose()
        setDisplayPart(null)
      }
      if (selectedPart.material) {
        selectedPart.material.transparent = false
        selectedPart.material.opacity = 1
      }
      setSelectedPart(null)
      onSelect(null)
      
      // Reset camera and controls
      camera.position.set(12, 6, 12)
      if (controlsRef.current) {
        controlsRef.current.target.set(0, 0, -4)
        controlsRef.current.update()
      }
    } else {
      // Remove previous display part
      if (displayPart) {
        threeScene.remove(displayPart)
        displayPart.geometry.dispose()
        displayPart.material.dispose()
      }

      // Create new copy with enhanced material
      const newMaterial = clickedPart.material.clone()
      newMaterial.transparent = false
      newMaterial.opacity = 1
      newMaterial.depthTest = true
      newMaterial.depthWrite = true
      newMaterial.side = THREE.DoubleSide
      newMaterial.emissive = new THREE.Color(0x222222)
      newMaterial.emissiveIntensity = 0.5

      const partCopy = new THREE.Mesh(
        clickedPart.geometry.clone(),
        newMaterial
      )
      
      // Get world transform
      clickedPart.updateWorldMatrix(true, false)
      const worldPosition = new THREE.Vector3()
      const worldQuaternion = new THREE.Quaternion()
      const worldScale = new THREE.Vector3()
      clickedPart.matrixWorld.decompose(worldPosition, worldQuaternion, worldScale)
      
      // Set initial transform
      partCopy.position.copy(worldPosition)
      partCopy.quaternion.copy(worldQuaternion)
      partCopy.scale.copy(worldScale)
      
      // Move to presentation position above cube
      const presentationPosition = new THREE.Vector3(-2, -1, -4) // Changed X to -2, Y to 2
      partCopy.position.copy(presentationPosition)
      partCopy.scale.multiplyScalar(2.5)
      partCopy.rotation.set(0, 0, 0) // Face users
      
      // Ensure visibility
      partCopy.renderOrder = 999
      partCopy.frustumCulled = false
      
      threeScene.add(partCopy)
      setDisplayPart(partCopy)
      
      // Update original part
      if (clickedPart.material) {
        clickedPart.material.transparent = true
        clickedPart.material.opacity = 0.5
      }
      
      setSelectedPart(clickedPart)
      onSelect(clickedPart)

      // Move camera to focus on the cloned part
      camera.position.set(2, 5, 4)
      if (controlsRef.current) {
        controlsRef.current.target.copy(presentationPosition)
        controlsRef.current.update()
      }
    }
  }

  const handlePointerMissed = () => {
    if (displayPart) {
      threeScene.remove(displayPart)
      displayPart.geometry.dispose()
      displayPart.material.dispose()
      setDisplayPart(null)
    }
    if (selectedPart && selectedPart.material) {
      selectedPart.material.transparent = false
      selectedPart.material.opacity = 1
    }
    setSelectedPart(null)
    setHoveredPart(null)
    onSelect(null)
    document.body.style.cursor = 'default'

    camera.position.set(12, 6, 12)
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, -4)
      controlsRef.current.update()
    }
  }

  return (
    <group>
      <Select>
        <primitive 
          object={scene} 
          onClick={handleClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
          onPointerMissed={handlePointerMissed}
          scale={[1, 1, 1]}
        />
      </Select>
      <OrbitControls 
        ref={controlsRef}
        makeDefault
        enableDamping
        dampingFactor={0.05}
        minPolarAngle={Math.PI / 4}
        maxPolarAngle={Math.PI / 1.8}
        minDistance={2}
        maxDistance={25}
        target={[0, 0, -4]}
      />
    </group>
  )
}

// Main ModelViewer Component
export default function ModelViewer() {
  const [selectedPart, setSelectedPart] = useState(null)

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas
        camera={{ 
          position: [12, 6, 12], 
          fov: 45,
          near: 0.1,
          far: 1000
        }}
        shadows={{
          enabled: true,
          type: THREE.PCFSoftShadowMap
        }}
      >
        <Suspense fallback={null}>
          <Environment preset="apartment" intensity={0.8} />
          <ambientLight intensity={0.4} />
          
          <directionalLight
            position={[5, 10, 5]}
            intensity={1.5}
            castShadow
            shadow-mapSize-width={2048}
            shadow-mapSize-height={2048}
            shadow-camera-far={50}
            shadow-camera-left={-10}
            shadow-camera-right={10}
            shadow-camera-top={10}
            shadow-camera-bottom={-10}
          />
          
          <directionalLight
            position={[-5, 5, -5]}
            intensity={0.5}
            castShadow
          />

          <Room />

          <group position={[0, -1, -4]} rotation={[0, Math.PI / 4, 0]}>
            <Model onSelect={setSelectedPart} />
          </group>

          <EffectComposer>
            <Selection>
              <Outline
                blur
                visibleEdgeColor={0x000000}
                hiddenEdgeColor={0x000000}
                edgeStrength={10}
                edgeThickness={2}
              />
            </Selection>
            <Bloom 
              intensity={0.5}
              luminanceThreshold={0.8}
              luminanceSmoothing={0.9}
            />
          </EffectComposer>
        </Suspense>
      </Canvas>

      <InfoPanel selectedPart={selectedPart} />

      <div
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'rgba(0,0,0,0.8)',
          color: 'white',
          padding: '10px 20px',
          borderRadius: '8px',
          zIndex: 1000,
          backdropFilter: 'blur(10px)'
        }}
      >
        Click on any part to highlight and see information
      </div>
    </div>
  )
}

useGLTF.preload('/models/anatomy.glb')