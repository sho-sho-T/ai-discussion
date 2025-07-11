import type { Metadata } from "next"
import { Inter, Noto_Sans_JP } from "next/font/google"
import "./globals.css"
import Script from "next/script"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
})

const notoSansJP = Noto_Sans_JP({
  variable: "--font-noto-sans-jp",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
})

export const metadata: Metadata = {
  title: "AI Team Chat",
  description: "複数のAIエージェントが協働してあなたの質問に答えます",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body
        className={`${inter.variable} ${notoSansJP.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  )
}
