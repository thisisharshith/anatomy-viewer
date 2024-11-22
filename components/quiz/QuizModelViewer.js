'use client'

import { useLoader } from '@react-three/fiber' // Importing React Three Fiber hook for loading 3D models
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader' // GLTFLoader for loading GLTF files
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader' // DRACOLoader for compressed GLTF files (optimization)
import { useState, useEffect } from 'react' // Import React hooks for state and effect handling
import { Html } from '@react-three/drei' // Import Html component for displaying HTML content in the 3D canvas

// Main QuizModelViewer component
export default function QuizModelViewer({ targetPart, selectedSystem, onPartSelect }) {
  // State variables
  const [error, setError] = useState(null) // State to track loading errors
  const [systemMeshes, setSystemMeshes] = useState(null) // State to hold system-specific meshes
  const [isClassifying, setIsClassifying] = useState(true) // State to track if classification is in progress

  // Load 3D model using GLTFLoader with DRACOLoader for compression support
  const gltf = useLoader(
    GLTFLoader, 
    '/models/model.glb', // Path to the 3D model file
    (loader) => {
      const dracoLoader = new DRACOLoader() // Initialize DRACOLoader for compressed model support
      dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.6/') // Set path to Draco decoder
      loader.setDRACOLoader(dracoLoader) // Attach Draco loader to the GLTF loader
    }
  )

  // Handle click events on meshes within the 3D model
  const handleClick = (event) => {
    event.stopPropagation() // Prevent event from propagating to parent components
    const clickedMesh = event.object // Get the clicked mesh object
    console.log('Clicked mesh:', {
      name: clickedMesh.name, // Log the name of the clicked mesh
      targetPart: targetPart, // Compare the clicked mesh to the target part
      isMatch: clickedMesh.name === targetPart // Check if the clicked mesh matches the target part
    })
    if (clickedMesh.visible) { // If the mesh is visible, select it
      onPartSelect?.(clickedMesh.name) // Call onPartSelect callback with the selected mesh name
    }
  }

  // Update mesh visibility and material properties based on selected system and highlighted part
  useEffect(() => {
    if (gltf && systemMeshes) { // Ensure model and system meshes are available
      gltf.scene.traverse((object) => { // Traverse all objects in the model
        if (object.isMesh) { // If the object is a mesh
          console.log('Mesh name:', object.name) // Log mesh name for debugging
          
          const isTargetPart = object.name === targetPart // Check if this mesh is the target part
          const belongsToSystem = selectedSystem === 'complete' || // If selected system is 'complete' or matches system
                                  systemMeshes[selectedSystem]?.includes(object.name)
          
          object.visible = belongsToSystem // Set visibility based on system membership
          
          if (object.visible) { // If the mesh is visible, update its material
            const material = object.material.clone() // Clone the existing material to avoid direct mutation
            if (isTargetPart) { // If this mesh is the target part
              material.emissive.setHex(0x666666) // Set the emissive color for highlighting
              material.emissiveIntensity = 0.5 // Increase emissive intensity
              material.opacity = 1 // Set full opacity
            } else { // If this is not the target part
              material.transparent = true // Make the material transparent
              material.opacity = 0.3 // Set low opacity for non-target parts
            }
            object.material = material // Assign the modified material back to the mesh
          }
        }
      })
    }
  }, [gltf, selectedSystem, systemMeshes, targetPart]) // Re-run when any of these dependencies change

  // Return loading or error message if an error occurs
  if (error) {
    return <Html center>{error}</Html> // Display the error message in the center of the screen
  }

  return (
    <primitive 
      object={gltf.scene} // Render the loaded GLTF model's scene
      onClick={handleClick} // Attach the click handler to the model
      castShadow // Enable shadows from this model
      receiveShadow // Enable this model to receive shadows
    />
  )
} 