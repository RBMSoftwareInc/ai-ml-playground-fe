import '../styles/globals.css'
import { Inter } from 'next/font/google'
import MUIProvider from '../components/MUIProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'RBM AI Playground',
  description: 'Explore real-time eCommerce AI demos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <MUIProvider>
          {children}
        </MUIProvider>
      </body>
    </html>
  )
}
