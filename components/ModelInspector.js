'use client'

import { useEffect } from 'react'

export default function ModelInspector({ scene }) {
  useEffect(() => {
    if (!scene) return

    // Create a detailed report of the model
    const modelReport = {
      meshes: [],
      materials: new Set(),
      totalVertices: 0
    }

    scene.traverse((child) => {
      if (child.isMesh) {
        modelReport.meshes.push({
          name: child.name,
          vertexCount: child.geometry.attributes.position.count,
          material: child.material.name || 'Unnamed Material',
          visible: child.visible
        })
        modelReport.materials.add(child.material.name || 'Unnamed Material')
        modelReport.totalVertices += child.geometry.attributes.position.count
      }
    })

    console.log('Model Report:', {
      ...modelReport,
      materials: Array.from(modelReport.materials),
      totalMeshes: modelReport.meshes.length
    })
  }, [scene])

  return null
}