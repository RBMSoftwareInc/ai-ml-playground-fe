import '../styles/globals.css'
import { Inter, Roboto } from 'next/font/google'
import MUIProvider from '../components/MUIProvider'
import PageLayout from '../components/PageLayout'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})
export const metadata = {
  title: 'RBM AI Playground',
  description: 'Enterprise AI/ML solutions across industries - E-commerce, Healthcare, Fintech, and more',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico', sizes: 'any' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { rel: 'android-chrome', url: '/android-chrome-192x192.png', sizes: '192x192' },
      { rel: 'android-chrome', url: '/android-chrome-512x512.png', sizes: '512x512' },
    ],
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
       <body className={roboto.className}>
        <MUIProvider>
          <PageLayout>
            {children}
          </PageLayout>
        </MUIProvider>
      </body>
    </html>
  )
}