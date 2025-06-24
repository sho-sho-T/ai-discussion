import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Team Chat',
  description: 'Multiple AI agents collaborating to answer your questions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  )
}