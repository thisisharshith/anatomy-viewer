'use client'  // This directive ensures the component is client-side only, disabling SSR (Server-Side Rendering) for this file.

import dynamic from 'next/dynamic'  // Import the dynamic function from Next.js to enable dynamic imports.

const Scene3D = dynamic(() => import('./Scene3D'), {  // Dynamically import the Scene3D component without SSR.
  ssr: false, // Disable server-side rendering for this component since it relies on client-side JavaScript.
  loading: () => (  // Display a loading screen while the Scene3D component is being loaded.
    <div className="w-screen h-screen flex justify-center items-center bg-gray-900 text-white">
      Loading 3D Viewer...
    </div>
  )
})

export default function Viewer3D({ selectedSystem }) {
  // Render the dynamically loaded Scene3D component with the selectedSystem prop passed down to it.
  return <Scene3D selectedSystem={selectedSystem} />
}
