import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getCategoryBySlug, getPromptsByCategory, categories, getAllCategorySlugs } from '@/lib/prompts';
import { CategoryCard } from '@/components/category-card';
import { PromptCard } from '@/components/prompt-card';
import { Navbar } from '@/components/navbar';

export async function generateStaticParams() {
  return getAllCategorySlugs().map((slug) => ({ category: slug }));
}
type CategoryPageProps = { params: Promise<{ category: string }> };

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    return {
      title: 'Category not found',
      description: 'This category does not exist.'
    };
  }

  return {
    title: `${categoryData.title} prompts — Promptly`,
    description: categoryData.description
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryData = getCategoryBySlug(category);

  if (!categoryData) {
    notFound();
  }

  const prompts = getPromptsByCategory(categoryData.slug);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
      <Navbar />

      <section className="grid gap-10 lg:grid-cols-[2.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
            <span className="text-sm uppercase tracking-[0.28em] text-slate-400">Category</span>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">{categoryData.title}</h1>
            <p className="mt-4 text-lg leading-8 text-slate-400">{categoryData.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-gradient-to-r from-sky-500 to-cyan-500 p-px">
                <span className="block rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-slate-100">Browse prompts</span>
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {prompts.map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-8 text-slate-400">
            <h2 className="text-xl font-semibold text-white">Scale with Promptly</h2>
            <p className="mt-3 leading-7">This foundation is built for expansion. Add thousands of prompts, search filters, and personal favorites without sacrificing speed or clarity.</p>
          </div>
        </div>

        <aside className="space-y-5">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
            <h2 className="text-lg font-semibold text-white">More categories</h2>
            <div className="mt-4 space-y-4">
              {categories.map((item) => (
                  <CategoryCard key={item.id} category={item} variant="compact" />
                ))}
            </div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-400">
            <h2 className="text-lg font-semibold text-white">Future features</h2>
            <ul className="mt-4 space-y-3 text-sm leading-7">
              <li>• Save favorite prompts</li>
              <li>• Prompt collections</li>
              <li>• Team sharing and notes</li>
              <li>• Performance analytics</li>
            </ul>
          </div>
        </aside>
      </section>
    </main>
  );
}
