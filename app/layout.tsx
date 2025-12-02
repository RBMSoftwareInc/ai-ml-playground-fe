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
  description: 'Enterprise AI/ML solutions across industries - E-commerce, Healthcare, Fintech, and more',
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