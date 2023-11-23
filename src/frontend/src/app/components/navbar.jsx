import Image from 'next/image'
import Link from 'next/link'

export const Navbar = () => {
  return (
    <>
      <nav className="sticky top-0">
        <Link href="/">
          <Image src="/vercel.svg" width={175} height={75} alt="discord verification logo"/>
        </Link>
      </nav>
    </>
  );
};