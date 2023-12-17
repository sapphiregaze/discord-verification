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
        <div className="bg-no-repeat bg-cover bg-center bg-fixed bg-[linear-gradient(to_bottom,rgba(30,31,25,1),rgba(107,143,113,0.85)),url('/forest.jpg')] text-text font-mono">
          <Navbar/>
          {children}
        </div>
      </body>
    </html>
  )
}
