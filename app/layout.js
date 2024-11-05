import '@/styles/globals.css'

export const metadata = {
  title: '3D Anatomy Viewer',
  description: 'Interactive 3D Anatomy Model Viewer',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}