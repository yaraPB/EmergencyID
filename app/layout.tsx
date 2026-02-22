import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'EmergencyID — Your Medical Identity, Instantly Accessible',
  description:
    'Link a QR code to your critical medical information. In an emergency, doctors scan it instantly — no login, no app, no waiting.',
  keywords: 'emergency medical ID, QR code medical profile, emergency health card',
  openGraph: {
    title: 'EmergencyID',
    description: 'Your medical info, one scan away from saving your life.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  )
}
