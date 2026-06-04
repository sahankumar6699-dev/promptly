import Link from 'next/link';

export function Navbar() {
  return (
    <header className="mb-10 flex flex-col gap-6 border-b border-slate-800 pb-6 text-slate-100 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <Link href="/" className="inline-flex items-center gap-3 text-xl font-semibold text-white">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-bold text-slate-950">P</span>
          Promptly
        </Link>
        <p className="mt-2 text-sm text-slate-500">AI prompt library for business and creative teams.</p>
      </div>
      <nav className="flex flex-wrap items-center gap-4 text-sm text-slate-400 sm:justify-end">
        <Link href="/" className="transition hover:text-white">Home</Link>
        <Link href="/marketing" className="transition hover:text-white">Categories</Link>
        <Link href="/productivity" className="transition hover:text-white">Productivity</Link>
      </nav>
    </header>
  );
}
