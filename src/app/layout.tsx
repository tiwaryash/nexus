import Providers from '@/components/providers/Providers';
import "./globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import '@/lib/pdfjs-worker';

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Nexus Mind",
  description: "AI-Enhanced Knowledge Management Platform",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}