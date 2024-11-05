/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    transpilePackages: ['three', '@react-three/fiber', '@react-three/drei'],
    webpack: (config) => {
      config.module.rules.push({
        test: /\.(glb|gltf)$/,
        type: 'asset/resource',
      })
      return config
    },
  }
  
  module.exports = nextConfig