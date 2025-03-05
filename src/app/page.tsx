'use client'

import dynamic from 'next/dynamic'
import Navigation from '@/components/NavigationMenu' // Import the Navigation component

const FileUploader = dynamic(
  () => import('@/components/FileUploader'),
  { ssr: false }
)

export default function Home() {
  return (
    <>     <Navigation />

    <div className="flex flex-col items-center justify-center min-h-screen p-4 w-full max-w-7xl mx-auto">
      {/* Use the Navigation component */}


      {/* Main Content */}
      <h1 className="text-3xl font-bold mb-6 text-center">Technical Communication Conversion Tool</h1>
      <FileUploader />
    </div>
    
    </>
  );
}
