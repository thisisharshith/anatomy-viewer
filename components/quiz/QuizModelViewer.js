'use client'

import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useState, useEffect } from 'react'
import { Html } from '@react-three/drei'

export default function QuizModelViewer({ targetPart, selectedSystem, onPartSelect }) {
  const [error, setError] = useState(null)
  const [systemMeshes, setSystemMeshes] = useState(null)
  const [isClassifying, setIsClassifying] = useState(true)

  const gltf = useLoader(
    GLTFLoader, 
    '/models/model.glb', 
    (loader) => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
      loader.setDRACOLoader(dracoLoader)
    }
  )

  const handleClick = (event) => {
    event.stopPropagation()
    const clickedMesh = event.object
    console.log('Clicked mesh:', {
      name: clickedMesh.name,
      targetPart: targetPart,
      isMatch: clickedMesh.name === targetPart
    })
    if (clickedMesh.visible) {
      onPartSelect?.(clickedMesh.name)
    }
  }

  // Update visibility and materials based on system and highlighted part
  useEffect(() => {
    if (gltf && systemMeshes) {
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          console.log('Mesh name:', object.name) // Log all mesh names
          const isTargetPart = object.name === targetPart
          const belongsToSystem = selectedSystem === 'complete' || 
                                systemMeshes[selectedSystem]?.includes(object.name)
          
          object.visible = belongsToSystem
          
          if (object.visible) {
            const material = object.material.clone()
            if (isTargetPart) {
              material.emissive.setHex(0x666666)
              material.emissiveIntensity = 0.5
              material.opacity = 1
            } else {
              material.transparent = true
              material.opacity = 0.3
            }
            object.material = material
          }
        }
      })
    }
  }, [gltf, selectedSystem, systemMeshes, targetPart])

  if (error) {
    return <Html center>{error}</Html>
  }

  return (
    <primitive 
      object={gltf.scene}
      onClick={handleClick}
      castShadow
      receiveShadow
    />
  )
} 