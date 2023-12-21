import Link from 'next/link';

export default function Home() {
  return (
    <>
      <main className="flex min-h-screen flex-col items-center p-24">
        <div className="flex items-center text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-primary to-accent">
          Discord Verification.&nbsp;
          <span className="relative h-[1em] w-60 overflow-hidden leading-none text-background">
            <span className="absolute h-full w-full -translate-y-full animate-slide">
              Tech.
            </span>
            <span className="absolute h-full w-full -translate-y-full animate-slide [animation-delay:0.83s]">
              Ideas.
            </span>
            <span className="absolute h-full w-full -translate-y-full animate-slide [animation-delay:1.83s]">
              Future.
            </span>
          </span>
        </div>
        <div className="relative inline-flex mt-9 mb-20 text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-bl from-primary to-accent hover:animate-pulse">
          Simplified Web Interface For Managing Discord Member Email Verification
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
