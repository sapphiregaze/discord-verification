import Image from 'next/image'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <>
      <nav className="flex items-center justify-between relative sticky top-0 w-full h-24 bg-background p-12">
        <Link href="/">
          <Image src="/logo.png" width={300} height={300} alt="discord verification logo"/>
        </Link>
        <div className="flex space-x-12 text-text text-2xl font-mono">
          <Link href="/">
            <div className="hover:text-primary hover:font-bold">Home</div>
          </Link>
          <Link href="/members">
            <div className="hover:text-primary hover:font-bold">Members</div>
          </Link>
          <Link href="/history">
            <div className="hover:text-primary hover:font-bold">History</div>
          </Link>
          <Link href="/logs">
            <div className="hover:text-primary hover:font-bold">Logs</div>
          </Link>
        </div>        
      </nav>
    </>
  );
};