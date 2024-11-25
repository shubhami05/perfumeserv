import './globals.css'
import { Inter } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Header from '@/components/Header'
import { Toaster } from '@/components/ui/toaster'
import { CartProvider } from '@/hooks/CartContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Perfume Serv',
  description: 'Order best perfume online',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <ClerkProvider>
      <CartProvider>
        <html lang="en">
          <body className={inter.className} cz-shortcut-listen="true">
            <Header />
            <div className="container mx-auto px-4 py-8">
              {children}
            </div>
            <Toaster />
          </body>
        </html>
      </CartProvider>
    </ClerkProvider>
  )
}