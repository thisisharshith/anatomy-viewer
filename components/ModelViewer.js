'use client' // Indicates this is a client-side component in Next.js.

import { useLoader } from '@react-three/fiber' // Import hook for loading 3D assets in a React environment.
import { Html } from '@react-three/drei' // Import Html component for rendering 2D HTML content in a 3D scene.
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' // Import GLTFLoader to load 3D model files in GLTF format.
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader' // Import DRACOLoader to decode compressed meshes.
import { useState, useEffect } from 'react' // Import React hooks for managing state and side effects.
import { classifyMeshesToSystems } from '../utils/meshClassifier' // Utility function to classify meshes by anatomical systems.
import { getAnatomyInfo } from '../utils/groq' // Function to fetch anatomy-related information from a data source.
import { useRouter } from 'next/navigation' // Import Next.js router for navigation.

export default function ModelViewer({ selectedSystem, quizMode = false, highlightedPart = null, setCurrentSystem, onPartSelect }) {
  const router = useRouter() // Use the Next.js router for programmatic navigation.
  const [selectedMesh, setSelectedMesh] = useState(null) // State for storing the currently selected mesh.
  const [error, setError] = useState(null) // State for managing any errors during loading or interaction.
  const [systemMeshes, setSystemMeshes] = useState(null) // State for storing meshes classified by anatomical system.
  const [isClassifying, setIsClassifying] = useState(true) // State to track whether meshes are being classified.
  const [partInfo, setPartInfo] = useState("") // State to store information about the selected anatomical part.
  const [isLoading, setIsLoading] = useState(false) // State to manage loading state when fetching part info.
  
  const gltf = useLoader(
    GLTFLoader, 
    '/models/model.glb', 
    (loader) => {
      const dracoLoader = new DRACOLoader() // Initialize DRACOLoader for compressed model support.
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/') // Set the path for DRACO decoder.
      loader.setDRACOLoader(dracoLoader) // Set DRACOLoader on the loader.
    }
  )
  
  useEffect(() => {
    if (gltf && !systemMeshes) {
      const meshNames = []
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          meshNames.push(object.name) // Collect the names of mesh objects in the model.
          object.userData.name = object.name
          object.userData.clickable = true // Mark meshes as clickable.
        }
      })

      setIsClassifying(true) // Set classifying state to true while processing meshes.
      const classification = classifyMeshesToSystems(meshNames) // Classify meshes into anatomical systems.
      console.log('Classification:', classification)
      setSystemMeshes(classification) // Store the classification result.
      setIsClassifying(false) // Set classifying state to false once the process is done.
    }
  }, [gltf])

  // Function to reset materials to their original state.
  const resetMaterials = () => {
    gltf.scene.traverse((object) => {
      if (object.isMesh && object.userData.originalMaterial) {
        object.material = object.userData.originalMaterial.clone()
      }
    })
  }

  // Store original materials when the model is loaded.
  useEffect(() => {
    if (gltf) {
      gltf.scene.traverse((object) => {
        if (object.isMesh) {
          object.userData.originalMaterial = object.material.clone() // Store the original material for each mesh.
        }
      })
    }
  }, [gltf])

  const handleClick = async (event) => {
    if (quizMode) {
      event.stopPropagation() // Prevent event bubbling.
      const clickedMesh = event.object
      onPartSelect?.(clickedMesh.name) // Trigger part selection callback if in quiz mode.
    } else {
      event.stopPropagation()
      const clickedMesh = event.object

      // Check if the clicked mesh belongs to the currently selected system.
      const belongsToCurrentSystem = selectedSystem === 'complete' 
        ? true 
        : systemMeshes[selectedSystem]?.includes(clickedMesh.name)

      if (clickedMesh.userData.clickable && belongsToCurrentSystem) {
        try {
          // Highlight clicked mesh with a green color and emissive glow.
          const highlightMaterial = clickedMesh.material.clone()
          highlightMaterial.color.setHex(0x00ff00)
          highlightMaterial.emissive.setHex(0x336633)
          highlightMaterial.emissiveIntensity = 0.5
          clickedMesh.material = highlightMaterial

          // Store system and path in localStorage for navigation.
          localStorage.setItem('previousSystem', selectedSystem)
          localStorage.setItem('previousPath', window.location.pathname + window.location.search)

          // Reset materials after a short delay and navigate to part details page.
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

  // Reset materials and selection when changing systems.
  useEffect(() => {
    resetMaterials()
    setSelectedMesh(null)
  }, [selectedSystem])

  // Cleanup materials when the component unmounts.
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
          
          // Reset material properties for visibility and interaction.
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
                e.stopPropagation(); // Prevent click event from propagating to the 3D scene.
                setSelectedMesh(null); // Reset selected mesh and part info.
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
    return <Html center>{error}</Html> // Display error message in the center if an error occurs.
  }

  if (isClassifying) {
    return <Html center>Classifying anatomical structures...</Html> // Display loading message during classification.
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
            {/* Quiz information panel */}
            <div className="mb-3">
              <p className="text-white text-sm">
                Current Part: {highlightedPart ? highlightedPart.replace(/_/g, ' ') : 'None'}
              </p>
            </div>

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

      {/* 3D model rendering */}
      <primitive 
        object={gltf.scene}
        scale={1}
        position={[0, -2, 0]}
        onClick={handleClick} // Attach the click handler to interact with the model.
      />
      {selectedMesh && <InfoPanel mesh={selectedMesh} />} {/* Show info panel if a mesh is selected. */}
    </group>
  )
}
