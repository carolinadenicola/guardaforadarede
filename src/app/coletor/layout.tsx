import './globalsColetor.css'
import type { Metadata } from 'next'
import { Karla, Poiret_One } from 'next/font/google'

const karla = Karla({ 
  subsets: ['latin'],
  variable: '--font-karla',
  display: 'swap',
 })

export const metadata: Metadata = {
  title: 'Guarda de Material - Coletor',
  description: 'Módulo Coletor',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={karla.className}>{children}</body>
    </html>
  )
}
