import type { Metadata } from 'next';
import Link from 'next/link';
import { getIndustryBySlug, getAllIndustrySlugs, getPromptsByIndustry, getCategoryBySlug, categories } from '@/lib/prompts';
import Pagination from '@/components/pagination';
import { Navbar } from '@/components/navbar';
import { PromptCard } from '@/components/prompt-card';

export async function generateStaticParams() {
  return getAllIndustrySlugs().map((slug) => ({ slug }));
}
type IndustryPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return { title: 'Industry — Promptly' };
  const base = process.env.SITE_BASE_URL || 'https://promptly.example.com';
  return {
    title: `${industry.title} prompts — Promptly`,
    description: industry.description,
    alternates: { canonical: `${base}/industry/${industry.slug}` }
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return <div />;

  const allPrompts = getPromptsByIndustry(industry.slug);
  const perPage = 12;
  const totalPages = Math.max(1, Math.ceil(allPrompts.length / perPage));
  const prompts = allPrompts.slice(0, perPage);

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-6 py-10 sm:px-8 lg:px-12">
      <Navbar />
      <section className="space-y-6">
        <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-10">
          <h1 className="text-3xl font-semibold text-white">{industry.title}</h1>
          <p className="mt-3 text-slate-400">{industry.description}</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-5">
            <h2 className="text-xl font-semibold text-white">Recommended prompts</h2>
            <div className="grid gap-4">
              {prompts.map((p) => (
                <PromptCard key={p.id} prompt={p} />
              ))}
            </div>
          </div>

          <aside className="space-y-5">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <h3 className="text-lg font-semibold text-white">Categories</h3>
              <div className="mt-3 space-y-2">
                {categories.map((c) => (
                  <Link key={c.slug} href={`/${c.slug}`} className="block text-slate-300 hover:text-sky-300">
                    {c.title}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6">
              <h3 className="text-lg font-semibold text-white">Related industries</h3>
              <div className="mt-3 space-y-2 text-slate-300">
                {(industry.related || []).map((r) => (
                  <Link key={r} href={`/industry/${r}`} className="block hover:text-sky-300">
                    {r}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              'name': `${industry.title} prompts — Promptly`,
              'description': industry.description,
              'url': `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/industry/${industry.slug}`,
              'hasPart': prompts.map((p) => ({ '@type': 'WebPage', 'name': p.title, 'url': `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/prompts/${p.slug}` }))
            })
          }}
        />
        <div className="mt-8 flex items-center justify-center">
          <Pagination current={1} total={totalPages} basePath={`/industry/${industry.slug}`} />
        </div>
      </section>
    </main>
  );
}
