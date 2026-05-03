import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'
import { AuthProvider } from '@/lib/auth-context'
import { StudentProvider } from '@/lib/student-context'
import './globals.css'

export const metadata: Metadata = {
  title: 'DISHA AI — Know Your Funding First',
  description: 'Calculate your Education Credit Profile score in 3 minutes. Discover universities within your funding band. AI-powered education finance guidance for Indian students.',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-black">
      <body className="font-sans antialiased bg-black text-white min-h-screen">
        <AuthProvider>
          <StudentProvider>
            {children}
          </StudentProvider>
        </AuthProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
