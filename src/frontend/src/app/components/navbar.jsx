import Image from 'next/image'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <>
      <nav className="flex items-center justify-between relative sticky top-0 w-full h-24 p-12">
        <Link href="/">
          <Image src="/logo.png" width={300} height={300} alt="discord verification logo"/>
        </Link>
        <div className="flex space-x-12 text-accent text-2xl">
          <Link href="/">
            <div className="hover:text-primary hover:font-bold hover:animate-bounce">Home</div>
          </Link>
          <Link href="/members">
            <div className="hover:text-primary hover:font-bold hover:animate-bounce">Members</div>
          </Link>
          <Link href="/logs">
            <div className="hover:text-primary hover:font-bold hover:animate-bounce">Logs</div>
          </Link>
        </div>        
      </nav>
    </>
  );
};