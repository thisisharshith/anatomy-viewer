'use client'

import { useLoader } from '@react-three/fiber'
import { Html } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { useState, useEffect } from 'react'
import { classifyMeshesToSystems } from '../utils/meshClassifier'
import { getAnatomyInfo } from '../utils/groq'
import { useRouter } from 'next/navigation'

export default function ModelViewer({ selectedSystem, quizMode = false, highlightedPart = null, setCurrentSystem, onPartSelect }) {
  const router = useRouter()
  const [selectedMesh, setSelectedMesh] = useState(null)
  const [error, setError] = useState(null)
  const [systemMeshes, setSystemMeshes] = useState(null)
  const [isClassifying, setIsClassifying] = useState(true)
  const [partInfo, setPartInfo] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  const gltf = useLoader(
    GLTFLoader, 
    '/models/model.glb', 
    (loader) => {
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/')
      loader.setDRACOLoader(dracoLoader)
    }
  )
  
  useEffect(() => {
    if (gltf && !systemMeshes) {
      const meshNames = []
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          meshNames.push(object.name)
          object.userData.name = object.name
          object.userData.clickable = true
        }
      })

      setIsClassifying(true)
      const classification = classifyMeshesToSystems(meshNames)
      console.log('Classification:', classification)
      setSystemMeshes(classification)
      setIsClassifying(false)
    }
  }, [gltf])

  // Function to reset materials
  const resetMaterials = () => {
    gltf.scene.traverse((object) => {
      if (object.isMesh && object.userData.originalMaterial) {
        object.material = object.userData.originalMaterial.clone()
      }
    })
  }

  // Store original materials on load
  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          object.userData.originalMaterial = object.material.clone()
        }
      })
    }
  }, [gltf])

  const handleClick = async (event) => {
    if (quizMode) {
      event.stopPropagation()
      const clickedMesh = event.object
      onPartSelect?.(clickedMesh.name)
    } else {
      event.stopPropagation()
      const clickedMesh = event.object

      const belongsToCurrentSystem = selectedSystem === 'complete' 
        ? true 
        : systemMeshes[selectedSystem]?.includes(clickedMesh.name)

      if (clickedMesh.userData.clickable && belongsToCurrentSystem) {
        try {
          // Highlight clicked mesh
          const highlightMaterial = clickedMesh.material.clone()
          highlightMaterial.color.setHex(0x00ff00)
          highlightMaterial.emissive.setHex(0x336633)
          highlightMaterial.emissiveIntensity = 0.5
          clickedMesh.material = highlightMaterial

          // Store BOTH system and path
          localStorage.setItem('previousSystem', selectedSystem)
          localStorage.setItem('previousPath', window.location.pathname + window.location.search)

          setTimeout(() => {
            resetMaterials()
            router.push(`/part/${encodeURIComponent(clickedMesh.name)}`)
          }, 300)

        } catch (error) {
          console.error('Error handling click:', error)
          resetMaterials()
        }
      }
    }
  }

  // Reset materials when changing systems
  useEffect(() => {
    resetMaterials()
    setSelectedMesh(null)
  }, [selectedSystem])

  // Reset materials when component unmounts
  useEffect(() => {
    return () => {
      resetMaterials()
    }
  }, [])

  useEffect(() => {
    if (gltf && systemMeshes) {
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          const belongsToSystem = selectedSystem === 'complete' 
            ? true 
            : systemMeshes[selectedSystem]?.includes(object.name)
          
          object.visible = belongsToSystem
          object.raycast = belongsToSystem ? object.constructor.prototype.raycast : () => {}
          
          if (object.material) {
            object.material.transparent = false;
            object.material.opacity = 1.0;
            object.material.depthWrite = true;
            object.material.depthTest = true;
            object.material.needsUpdate = true;
          }
        }
      })
    }
  }, [gltf, selectedSystem, systemMeshes])

  const InfoPanel = ({ mesh }) => {
    if (!mesh) return null;

    return (
      <Html
        position={[mesh.position.x, mesh.position.y + 1, mesh.position.z]}
        transform
        sprite
        style={{
          pointerEvents: 'auto',
          zIndex: 100,
        }}
      >
        <div className="relative speech-bubble" style={{ width: '300px' }}>
          <div className="bg-gray-900/90 text-white p-4 rounded-lg backdrop-blur-sm 
                        border border-gray-700 shadow-xl">
            <h3 className="font-bold mb-2 text-lg">
              {mesh.name.replace(/_/g, ' ')}
            </h3>
            
            {isLoading ? (
              <div className="flex items-center justify-center py-2">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              </div>
            ) : (
              <p className="text-sm text-gray-200 leading-relaxed">
                {partInfo || "Loading information..."}
              </p>
            )}

            <button 
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMesh(null);
                setPartInfo("");
              }}
              className="absolute top-2 right-2 text-gray-400 hover:text-white 
                         w-6 h-6 flex items-center justify-center rounded-full 
                         hover:bg-gray-800 transition-colors duration-200"
            >
              ×
            </button>
          </div>

          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 
                        w-0 h-0 border-solid border-8 
                        border-t-gray-900/90 border-x-transparent border-b-transparent">
          </div>
        </div>
      </Html>
    )
  }

  if (error) {
    return <Html center>{error}</Html>
  }

  if (isClassifying) {
    return <Html center>Classifying anatomical structures...</Html>
  }

  return (
    <group position={[0, 0, 0]} scale={2}>
      {quizMode && (
        <Html
          position={[-2, 1.8, 0]}
          transform
        >
          <div className="bg-gray-900/80 p-4 rounded-lg backdrop-blur-sm border border-gray-700 shadow-xl"
               style={{
                 whiteSpace: 'nowrap',
                 transform: 'scale(0.75)',
                 minWidth: '300px'
               }}>
            {/* Score */}
            <div className="mb-3">
              <p className="text-white text-sm">
                Current Part: {highlightedPart ? highlightedPart.replace(/_/g, ' ') : 'None'}
              </p>
            </div>

            {/* Instructions */}
            <div className="text-gray-300 text-sm mb-3">
              Click on the highlighted part in the model
            </div>

            {/* System Filter */}
            <div className="flex items-center space-x-2">
              <label className="text-white text-sm">View System:</label>
              <select
                value={selectedSystem}
                onChange={(e) => setCurrentSystem(e.target.value)}
                className="bg-gray-800 text-white text-sm rounded px-2 py-1 
                         border border-gray-600 focus:border-blue-500"
              >
                {ANATOMY_SYSTEMS.map(system => (
                  <option key={system.id} value={system.id}>
                    {system.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Html>
      )}

      <primitive 
        object={gltf.scene}
        scale={1}
        position={[0, -2, 0]}
        onClick={handleClick}
      />
      {selectedMesh && <InfoPanel mesh={selectedMesh} />}
    </group>
  )
}