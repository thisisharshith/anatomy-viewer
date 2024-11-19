// 'use client'

// import { Canvas } from '@react-three/fiber'
// import { Environment, OrbitControls } from '@react-three/drei'
// import { Suspense } from 'react'
// import dynamic from 'next/dynamic'

// // Dynamically import ModelViewer
// const ModelViewer = dynamic(() => import('./ModelViewer'), { ssr: false })

// function Room() {
//   return (
//     <group>
//       {/* Floor */}
//       <mesh receiveShadow rotation-x={-Math.PI / 2} position={[0, -5, 0]}>
//         <planeGeometry args={[20, 20]} />
//         <meshStandardMaterial color="#333333" />
//       </mesh>

//       {/* Back Wall */}
//       <mesh receiveShadow position={[0, 0, -10]}>
//         <planeGeometry args={[20, 20]} />
//         <meshStandardMaterial color="#2a2a2a" />
//       </mesh>

//       {/* Left Wall */}
//       <mesh receiveShadow position={[-10, 0, 0]} rotation-y={Math.PI / 2}>
//         <planeGeometry args={[20, 20]} />
//         <meshStandardMaterial color="#2a2a2a" />
//       </mesh>

//       {/* Right Wall */}
//       <mesh receiveShadow position={[10, 0, 0]} rotation-y={-Math.PI / 2}>
//         <planeGeometry args={[20, 20]} />
//         <meshStandardMaterial color="#2a2a2a" />
//       </mesh>
//     </group>
//   )
// }

// export default function Scene({ selectedSystem }) {
//   return (
//     <div style={{ width: '100vw', height: '100vh' }}>
//       <Canvas
//         shadows
//         camera={{ position: [0, 0, 15], fov: 45 }}
//         style={{ background: '#1a1a1a' }}
//       >
//         <Suspense fallback={null}>
//           {/* Lighting */}
//           <ambientLight intensity={0.7} />
//           <directionalLight
//             castShadow
//             position={[5, 5, 5]}
//             intensity={1}
//             shadow-mapSize={[1024, 1024]}
//           >
//             <orthographicCamera attach="shadow-camera" args={[-10, 10, -10, 10, 0.1, 50]} />
//           </directionalLight>

//           {/* Room */}
//           <Room />

//           {/* Centered Model */}
//           <group position={[0, -2, 0]} scale={3}>
//             <ModelViewer selectedSystem={selectedSystem} />
//           </group>

//           {/* Controls and Environment */}
//           <OrbitControls 
//             target={[0, 0, 0]}
//             maxPolarAngle={Math.PI * 0.85}
//             minPolarAngle={Math.PI * 0.15}
//             minAzimuthAngle={-Math.PI * 0.5}
//             maxAzimuthAngle={Math.PI * 0.5}
//             minDistance={5}
//             maxDistance={15}
//             enablePan={false}
//           />
//           <Environment preset="studio" />
//         </Suspense>
//       </Canvas>
//     </div>
//   )
// }  