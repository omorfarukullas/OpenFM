import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'OpenFM - Open Football Manager',
  description: 'The open-source football manager game engine and platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
