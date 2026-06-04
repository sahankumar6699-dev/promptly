import Link from 'next/link';
import type { Prompt } from '@/lib/prompts';
import { Badge } from '@/components/ui/badge';
import { getCategoryBySlug } from '@/lib/prompts';

type PromptCardProps = {
  prompt: Prompt;
};

export function PromptCard({ prompt }: PromptCardProps) {
  const category = getCategoryBySlug(prompt.categorySlug);

  return (
    <article className="rounded-3xl border border-slate-800 bg-slate-950/90 p-7 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/95">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-2xl font-semibold text-white">{prompt.title}</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">{prompt.description}</p>
        </div>
        <Badge>{prompt.useCase}</Badge>
      </div>
      <p className="mt-5 text-sm text-slate-500">Category: <Link href={`/${prompt.categorySlug}`} className="text-sky-300">{category?.title ?? prompt.categorySlug}</Link></p>
      <Link href={`/prompts/${prompt.slug}`} className="mt-6 inline-flex text-sm font-semibold text-sky-300 transition hover:text-sky-200">
        View prompt
      </Link>
    </article>
  );
}
