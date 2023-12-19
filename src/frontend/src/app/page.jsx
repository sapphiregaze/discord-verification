import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="relative inline-flex text-5xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-tr from-primary to-accent">
          Discord Verification Web Portal
        </div>
        <div className="relative inline-flex m-9 text-xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-bl from-primary to-accent">
          Simplified Web Interface For Managing Discord Member Verification
        </div>
        <Link href="/members">
          <button className="relative inline-flex items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-3xl text-accent font-bold rounded-lg group bg-gradient-to-br from-primary to-accent focus:ring-4 focus:outline-none focus:ring-primary">
            <span className="relative px-20 py-6 transition-all ease-in duration-75 bg-gradient-to-tr from-background to-primary group-hover:bg-gradient-to-br group-hover:from-primary group-hover:to-background rounded-md group-hover:text-secondary group-hover:bg-opacity-0">
                Get Started
            </span>
          </button>
        </Link>
      </main>
    </>
  );
}
