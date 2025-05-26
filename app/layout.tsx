import type { Metadata } from 'next'
import './globals.css'
import { SectionProvider } from '@/contexts/section-context'
import { OverlayProvider } from '@/contexts/overlay-context'
import LoadingScreen from '@/components/loading-screen'

export const metadata: Metadata = {
  title: 'VHALÓR - Pack Less, Save More',
  description: 'The innovative hoodie that lets you carry more without paying for carry-on luggage',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>
        <SectionProvider>
          <OverlayProvider>
            <LoadingScreen />
            {children}
          </OverlayProvider>
        </SectionProvider>
      </body>
    </html>
  )
}
