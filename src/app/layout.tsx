import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import './globals.css'
import { cn } from '@/lib/utils'
import { ModalProvider } from '@/providers/ModalProvider'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'The Next Shop',
  description: 'An e-commerce shop built with everything new in Next.js',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={cn('min-h-screen w-full', GeistSans.className)}>
        <Toaster />
        <ModalProvider />
        {children}
      </body>
    </html>
  )
}
