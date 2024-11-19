'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import HomePage from '@/components/HomePage'
import Viewer3D from '@/components/Viewer3D'

export default function Home() {
  const searchParams = useSearchParams()
  const systemParam = searchParams.get('system')
  const [selectedSystem, setSelectedSystem] = useState(systemParam || null)

  useEffect(() => {
    if (systemParam) {
      setSelectedSystem(systemParam)
    }
  }, [systemParam])

  if (!selectedSystem) {
    return <HomePage onSystemSelect={setSelectedSystem} />
  }

  return (
    <div className="relative w-screen h-screen">
      <Viewer3D selectedSystem={selectedSystem} />
    </div>
  )
}