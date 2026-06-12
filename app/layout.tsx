import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'sonner'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: 'IssueFlow',
  description: 'Issue tracking for modern teams',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        <Providers>
          {children}
        </Providers>
        <Toaster position="bottom-right" />
      </body>
    </html>
  )
}
