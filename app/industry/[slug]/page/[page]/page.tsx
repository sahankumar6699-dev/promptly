import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getIndustryBySlug, getAllIndustrySlugs, getPromptsByIndustry, getCategoryBySlug, categories } from '@/lib/prompts';
import Pagination from '@/components/pagination';
import { Navbar } from '@/components/navbar';
import { PromptCard } from '@/components/prompt-card';

const perPage = 12;

type IndustryPageParams = {
  slug: string;
  page: string;
};

type IndustryPageProps = {
  params: Promise<IndustryPageParams>;
};

export async function generateStaticParams() {
  return getAllIndustrySlugs().flatMap((slug) => {
    const totalPages = Math.max(1, Math.ceil(getPromptsByIndustry(slug).length / perPage));
    if (totalPages <= 1) return [];
    return Array.from({ length: totalPages - 1 }, (_, index) => ({ slug, page: String(index + 2) }));
  });
}

export async function generateMetadata({ params }: IndustryPageProps): Promise<Metadata> {
  const { slug, page } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return { title: 'Industry — Promptly' };
  const pageNum = Number(page);
  const base = process.env.SITE_BASE_URL || 'https://promptly.example.com';

  return {
    title: `${industry.title} prompts — Page ${pageNum} — Promptly`,
    description: industry.description,
    alternates: { canonical: `${base}/industry/${industry.slug}/page/${pageNum}` }
  };
}

export default async function IndustryPage({ params }: IndustryPageProps) {
  const { slug, page } = await params;
  const industry = getIndustryBySlug(slug);
  if (!industry) return <div />;

  const allPrompts = getPromptsByIndustry(industry.slug);
  const totalPages = Math.max(1, Math.ceil(allPrompts.length / perPage));
  const pageNum = Number(page);
  if (!Number.isInteger(pageNum) || pageNum < 1 || pageNum > totalPages) notFound();

  const offset = (pageNum - 1) * perPage;
  const prompts = allPrompts.slice(offset, offset + perPage);

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
              name: `${industry.title} prompts — Promptly`,
              description: industry.description,
              url: `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/industry/${industry.slug}/page/${pageNum}`,
              hasPart: prompts.map((p) => ({ '@type': 'WebPage', name: p.title, url: `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/prompts/${p.slug}` }))
            })
          }}
        />

        <div className="mt-8 flex items-center justify-center">
          <Pagination current={pageNum} total={totalPages} basePath={`/industry/${industry.slug}`} />
        </div>
      </section>
    </main>
  );
}
