import type { Metadata } from 'next';
import Link from 'next/link';
import { getAllUseCases, getPromptsByUseCase, getAllUseCases as listUseCases, useCases } from '@/lib/prompts';
import Pagination from '@/components/pagination';
import { Navbar } from '@/components/navbar';
import { PromptCard } from '@/components/prompt-card';

export async function generateStaticParams() {
  return useCases.map((slug) => ({ slug }));
}
type UseCasePageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: UseCasePageProps): Promise<Metadata> {
  const { slug } = await params;
  const base = process.env.SITE_BASE_URL || 'https://promptly.example.com';
  const title = `${slug.replace(/-/g, ' ')} prompts — Promptly`;
  return {
    title,
    description: `Prompts for ${slug.replace(/-/g, ' ')} use cases.`,
    alternates: { canonical: `${base}/use-case/${slug}` }
  };
}

export default async function UseCasePage({ params }: UseCasePageProps) {
  const { slug } = await params;
  const allPrompts = getPromptsByUseCase(slug);
  const perPage = 20;
  const totalPages = Math.max(1, Math.ceil(allPrompts.length / perPage));
  const prompts = allPrompts.slice(0, perPage);

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
              'name': `${slug} prompts — Promptly`,
              'description': `Prompts for ${slug.replace(/-/g, ' ')}`,
              'url': `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/use-case/${slug}`,
              'hasPart': prompts.map((p) => ({ '@type': 'WebPage', 'name': p.title, 'url': `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/prompts/${p.slug}` }))
            })
          }}
        />
      </section>
      <div className="mt-8 flex items-center justify-center">
        <Pagination current={1} total={totalPages} basePath={`/use-case/${slug}`} />
      </div>
    </main>
  );
}
