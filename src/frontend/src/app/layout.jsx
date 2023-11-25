import './globals.css'
import { Navbar } from './components/navbar.jsx'
import { Inter } from 'next/font/google'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Discord Verification Portal',
  description: 'A web portal for the discord verification application',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="png" href="/favicon.ico" sizes="any"/>
      </head>
      <body className={inter.className}>
        <Navbar/>
        {children}
      </body>
    </html>
  )
}
