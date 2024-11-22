// Import global CSS styles for the application.
import '@/styles/globals.css'

// Metadata for the application, defining the title and description.
export const metadata = {
  title: '3D Anatomy Viewer', // Title of the application displayed in the browser tab.
  description: 'Interactive 3D Anatomy Model Viewer', // Description for SEO and sharing purposes.
}

// Root layout component to define the structure of the application.
export default function RootLayout({ children }) {
  return (
    <html lang="en"> {/* Sets the language of the document to English for accessibility and SEO. */}
      <body>{children}</body> {/* Renders the child components passed into the layout. */}
    </html>
  )
}
