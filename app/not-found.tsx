import Link from 'next/link';
import { Navbar } from '@/components/navbar';

export default function NotFound() {
  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 sm:px-8 lg:px-12">
      <Navbar />
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-12 text-center shadow-soft">
          <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Page not found</p>
          <h1 className="mt-6 text-4xl font-semibold text-white">We couldn&apos;t find that prompt.</h1>
          <p className="mt-4 text-slate-400">Try browsing categories or return to the homepage.</p>
          <Link href="/" className="mt-8 inline-flex rounded-2xl bg-sky-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-sky-400">
            Go home
          </Link>
        </div>
      </div>
    </main>
  );
}
