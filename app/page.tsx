import Link from 'next/link';
import { ArrowRight, Search } from 'lucide-react';
import { categories, searchPrompts } from '@/lib/prompts';
import { CategoryCard } from '@/components/category-card';
import { PromptCard } from '@/components/prompt-card';
import { SearchBar } from '@/components/search-bar';
import { Navbar } from '@/components/navbar';

export const dynamic = 'auto';

export default function HomePage() {
  const featuredPrompts = searchPrompts('');

  return (
    <main className="mx-auto flex min-h-screen max-w-7xl flex-col gap-12 px-6 py-10 sm:px-8 lg:px-12">
      <Navbar />

      <section className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr]">
        <div className="space-y-6">
          <div className="max-w-3xl space-y-4">
            <span className="inline-flex rounded-full bg-sky-900 px-3 py-1 text-sm font-semibold uppercase tracking-[0.28em] text-sky-300">
              Prompt library for business teams
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
              Promptly — AI prompts organized for business, creators, and growth.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-400">
              Discover curated prompts for marketing, development, education, real estate, productivity, and more. Designed to help your team move faster and ship better work.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link href="/marketing" className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-slate-700 hover:bg-slate-900/90">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Featured</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Marketing briefs & launch planning</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Tools to structure campaigns, messaging, and growth experiments.</p>
            </Link>
            <Link href="/productivity" className="rounded-3xl border border-slate-800 bg-slate-950/70 p-6 transition hover:border-slate-700 hover:bg-slate-900/90">
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Featured</p>
              <h2 className="mt-3 text-xl font-semibold text-white">Productivity workflows</h2>
              <p className="mt-2 text-sm leading-6 text-slate-400">Create routines, planning systems, and focus guides for busy teams.</p>
            </Link>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-soft">
          <div className="mb-6 flex items-center justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Search</p>
              <p className="mt-2 text-xl font-semibold text-white">Find prompts by niche or use case.</p>
            </div>
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-900 text-sky-300">
              <Search size={20} />
            </div>
          </div>
          <SearchBar />
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Categories</p>
            <h2 className="text-3xl font-semibold text-white">Browse by niche</h2>
          </div>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-sky-300 transition hover:text-sky-200">
            Explore all categories
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-slate-400">Featured prompts</p>
            <h2 className="text-3xl font-semibold text-white">Prompt cards designed to ship quickly</h2>
          </div>
          <span className="text-sm text-slate-500">Future favorites coming soon.</span>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featuredPrompts.slice(0, 6).map((prompt) => (
            <PromptCard key={prompt.id} prompt={prompt} />
          ))}
        </div>
      </section>
    </main>
  );
}
