import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Spark Clean – Premium Cleaning Services',
  description: 'Experience the highest standard of cleanliness with our eco-friendly, meticulous residential and commercial cleaning services.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-body bg-[#F0FDF4] text-gray-800">
        {children}
      </body>
    </html>
  )
}
