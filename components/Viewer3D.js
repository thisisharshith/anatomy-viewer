'use client'

import dynamic from 'next/dynamic'

const ModelViewer = dynamic(() => import('./ModelViewer'), {
  ssr: false,
  loading: () => (
    <div style={{ width: '100vw', height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      Loading 3D Viewer...
    </div>
  )
})

export default function Viewer3D() {
  return <ModelViewer />
}