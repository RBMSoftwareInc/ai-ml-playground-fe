import '../styles/globals.css'
import { Inter, Roboto } from 'next/font/google'
import MUIProvider from '../components/MUIProvider'

const inter = Inter({ subsets: ['latin'] })
const roboto = Roboto({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
})
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
       <body className={roboto.className}>
        <MUIProvider>
          {children}
        </MUIProvider>
      </body>
    </html>
  )
}