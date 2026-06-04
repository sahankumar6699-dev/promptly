import Link from 'next/link';

type Props = {
  current: number;
  total: number;
  basePath: string; // e.g. `/industry/restaurants`
};

export function Pagination({ current, total, basePath }: Props) {
  if (total <= 1) return null;
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      {pages.map((p) => (
        <Link key={p} href={p === 1 ? `${basePath}` : `${basePath}/page/${p}`} className={`inline-flex items-center justify-center rounded-md px-3 py-1 text-sm ${p === current ? 'bg-sky-500 text-slate-900' : 'text-slate-300 hover:text-white'}`}>
          {p}
        </Link>
      ))}
    </nav>
  );
}

export default Pagination;
