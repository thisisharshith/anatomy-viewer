'use client'

// Import necessary hooks and components.
import { useRouter, useSearchParams } from 'next/navigation' // For managing URL navigation and search parameters.
import { useState, useEffect } from 'react' // For managing component state and lifecycle effects.
import HomePage from '@/components/HomePage' // Component for the home page.
import Viewer3D from '@/components/Viewer3D' // Component for the 3D viewer functionality.

export default function Home() {
  // Access the URL search parameters and extract the 'system' parameter.
  const searchParams = useSearchParams()
  const systemParam = searchParams.get('system') 

  // State to store the currently selected system. Defaults to the 'system' parameter from the URL if present.
  const [selectedSystem, setSelectedSystem] = useState(systemParam || null)

  // Effect to update the selected system whenever the 'system' parameter in the URL changes.
  useEffect(() => {
    if (systemParam) {
      setSelectedSystem(systemParam)
    }
  }, [systemParam])

  // If no system is selected, display the home page to choose a system.
  if (!selectedSystem) {
    return <HomePage onSystemSelect={setSelectedSystem} />
  }

  // If a system is selected, display the 3D viewer with the selected system.
  return (
    <div className="relative w-screen h-screen">
      <Viewer3D selectedSystem={selectedSystem} />
    </div>
  )
}
