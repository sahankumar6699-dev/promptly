import Link from 'next/link';
import type { Category } from '@/lib/prompts';

type CategoryCardProps = {
  category: Category;
  variant?: 'default' | 'compact';
};

export function CategoryCard({ category, variant = 'default' }: CategoryCardProps) {
  return (
    <Link href={`/${category.slug}`} className="group block rounded-3xl border border-slate-800 bg-slate-950/90 p-6 transition hover:-translate-y-1 hover:border-slate-700 hover:bg-slate-900/95">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <p className="text-sm uppercase tracking-[0.25em] text-slate-400">{category.title}</p>
          <h3 className="text-xl font-semibold text-white">{category.description}</h3>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-sky-500 to-cyan-500 text-sm font-bold text-slate-950">{category.title.charAt(0)}</div>
      </div>
      {variant === 'default' ? (
        <p className="mt-5 text-sm leading-6 text-slate-400">Explore prompts for {category.title.toLowerCase()} use cases, workflows, and ideas.</p>
      ) : null}
    </Link>
  );
}
