import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getPromptBySlug, getCategoryBySlug, getAllPromptSlugs, getRelatedPrompts } from '@/lib/prompts';
import { Navbar } from '@/components/navbar';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/breadcrumb';

export async function generateStaticParams() {
  return getAllPromptSlugs().map((slug) => ({ slug }));
}
type PromptPageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PromptPageProps): Promise<Metadata> {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);
  if (!prompt) {
    return {
      title: 'Prompt not found — Promptly',
      description: 'The prompt you are looking for does not exist.'
    };
  }
  const base = process.env.SITE_BASE_URL || 'https://promptly.example.com';

  return {
    title: `${prompt.title} — Promptly`,
    description: prompt.description,
    openGraph: {
      title: prompt.title,
      description: prompt.description,
      type: 'article'
    },
    alternates: { canonical: `${base}/prompts/${prompt.slug}` }
  };
}

export default async function PromptPage({ params }: PromptPageProps) {
  const { slug } = await params;
  const prompt = getPromptBySlug(slug);

  if (!prompt) {
    notFound();
  }

  const category = getCategoryBySlug(prompt.categorySlug);
  const related = getRelatedPrompts(prompt.slug, 4);

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-6 py-10 sm:px-8 lg:px-12">
      <Navbar />

      <article className="space-y-8">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-10 shadow-soft">
            <Breadcrumb items={[{ label: 'Home', href: '/' }, { label: category?.title ?? 'Category', href: `/${category?.slug}` }, { label: prompt.title }]} />
            <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
              <Link href={`/${category?.slug}`} className="font-medium text-sky-300 hover:text-sky-200">
                {category?.title}
              </Link>
              <span>•</span>
              <span>{prompt.useCase}</span>
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-white">{prompt.title}</h1>
            <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-400">{prompt.description}</p>
            <div className="mt-6 flex flex-wrap gap-2">
              {prompt.tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
              ))}
            </div>
          </div>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.85fr]">
          <div className="space-y-6 rounded-3xl border border-slate-800 bg-slate-950/90 p-8 shadow-soft">
            <div>
              <h2 className="text-xl font-semibold text-white">Prompt</h2>
              <p className="mt-3 text-slate-400">Copy and adapt this prompt for AI tools, workflows, or team templates.</p>
            </div>
            <pre className="rounded-3xl border border-slate-800 bg-slate-900 p-6 text-sm leading-7 text-slate-200">
              {prompt.content}
            </pre>
          </div>

          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-400">
              <h2 className="text-xl font-semibold text-white">Industry</h2>
              <p className="mt-2"><Link href={`/industry/${prompt.industry}`} className="text-sky-300">{prompt.industry}</Link></p>
              <h2 className="mt-4 text-xl font-semibold text-white">Use case</h2>
              <p className="mt-2"><Link href={`/use-case/${encodeURIComponent(prompt.useCase.replace(/\s+/g, '-').toLowerCase())}`} className="text-sky-300">{prompt.useCase}</Link></p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-400">
              <h2 className="text-xl font-semibold text-white">How to use</h2>
              <p className="mt-3 leading-7">Use this prompt as the starting point. Replace bracketed placeholders with your product, audience, and desired outcome. Iterate for tone, length, and channel.</p>
            </div>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/90 p-6 text-slate-400">
              <h2 className="text-xl font-semibold text-white">Next steps</h2>
              <ul className="mt-4 space-y-3 text-sm leading-7">
                <li>• Copy the prompt into your AI workspace.</li>
                <li>• Replace placeholders with your details.</li>
                <li>• Experiment with variations and follow-ups.</li>
              </ul>
            </div>
          </div>
        </section>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Article',
              'headline': prompt.title,
              'description': prompt.description,
              'author': { '@type': 'Organization', 'name': 'Promptly' },
              'mainEntityOfPage': { '@type': 'WebPage', '@id': `${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/prompts/${prompt.slug}` }
            })
          }}
        />
      </article>
    </main>
  );
}
