import Image from 'next/image'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <>
      <nav className="flex items-center justify-between relative sticky top-0 w-full h-24 bg-background p-12">
        <Link href="/">
          <Image src="/vercel.svg" width={200} height={200} alt="discord verification logo"/>
        </Link>
        <div className="flex space-x-12 text-text text-2xl font-mono">
          <Link href="/">
            <div className="hover:text-accent">Home</div>
          </Link>
          <Link href="/history">
            <div className="hover:text-accent">History</div>
          </Link>
          <Link href="/logs">
            <div className="hover:text-accent">Logs</div>
          </Link>
        </div>        
      </nav>
    </>
  );
};