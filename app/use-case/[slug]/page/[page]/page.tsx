import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllUseCases, getPromptsByUseCase, useCases } from '@/lib/prompts';
import Pagination from '@/components/pagination';
import { Navbar } from '@/components/navbar';
import { PromptCard } from '@/components/prompt-card';

const perPage = 20;

type UseCasePageParams = {
  slug: string;
  page: string;
};

type UseCasePageProps = {
  params: Promise<UseCasePageParams>;
};

export async function generateStaticParams() {
  return useCases.flatMap((slug) => {
    const totalPages = Math.max(1, Math.ceil(getPromptsByUseCase(slug).length / perPage));
    if (totalPages <= 1) return [];
    return Array.from({ length: totalPages - 1 }, (_, index) => ({ slug, page: String(index + 2) }));
  });
}

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
  const { slug, page } = await params;
  const pageNum = Number(page);
  const base = process.env.SITE_BASE_URL || 'https://promptly.example.com';
  return {
    title: `${slug.replace(/-/g, ' ')} prompts — Page ${pageNum} — Promptly`,
    description: `Prompts for ${slug.replace(/-/g, ' ')} use cases.`,
    alternates: { canonical: `${base}/use-case/${slug}/page/${pageNum}` }
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug, page } = await params;
  const allPrompts = getPromptsByUseCase(slug);
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
          <h1 className="text-3xl font-semibold text-white">{slug.replace(/-/g, ' ')}</h1>
          <p className="mt-3 text-slate-400">Prompts and templates focused on {slug.replace(/-/g, ' ')}.</p>
        </div>

        <div className="space-y-5">
          {prompts.map((p) => (
            <PromptCard key={p.id} prompt={p} />
          ))}
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'CollectionPage',
              name: `${slug.replace(/-/g, ' ')} prompts — Promptly`,
              description: `Prompts for ${slug.replace(/-/g, ' ')}`,
              url: `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/use-case/${slug}/page/${pageNum}`,
              hasPart: prompts.map((p) => ({ '@type': 'WebPage', name: p.title, url: `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/prompts/${p.slug}` }))
            })
          }}
        />
      </section>
      <div className="mt-8 flex items-center justify-center">
        <Pagination current={pageNum} total={totalPages} basePath={`/use-case/${slug}`} />
      </div>
    </main>
  );
}
