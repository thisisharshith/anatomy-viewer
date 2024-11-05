'use client'

import { useState } from 'react'

export default function Controls({ scene }) {
  const [autoRotate, setAutoRotate] = useState(false)
  const [selectedPart, setSelectedPart] = useState(null)

  const handlePartVisibility = (partName) => {
    scene.traverse((child) => {
      if (child.isMesh && child.name === partName) {
        child.visible = !child.visible
      }
    })
  }

  const resetView = () => {
    scene.traverse((child) => {
      if (child.isMesh) {
        child.visible = true
      }
    })
    setSelectedPart(null)
  }

  return (
    <div className="controls-panel">
      <div className="control-group">
        <button 
          onClick={() => setAutoRotate(!autoRotate)}
          className="control-button"
        >
          {autoRotate ? 'Stop Rotation' : 'Start Rotation'}
        </button>
        <button 
          onClick={resetView}
          className="control-button"
        >
          Reset View
        </button>
      </div>

      <div className="part-toggles">
        {/* We'll populate this based on your model structure */}
      </div>

      <style jsx>{`
        .controls-panel {
          position: fixed;
          bottom: 20px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(0, 0, 0, 0.8);
          padding: 15px;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          gap: 10px;
          z-index: 1000;
        }

        .control-group {
          display: flex;
          gap: 10px;
        }

        .control-button {
          padding: 8px 16px;
          background: #4CAF50;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: background 0.3s;
        }

        .control-button:hover {
          background: #45a049;
        }
      `}</style>
    </div>
  )
}