'use client'

import dynamic from 'next/dynamic'

const Scene3D = dynamic(() => import('./Scene3D'), {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900 text-white">
      Loading 3D Viewer...
    </div>
  )
})

export default function Viewer3D({ selectedSystem }) {
  return <Scene3D selectedSystem={selectedSystem} />
}