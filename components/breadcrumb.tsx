import Link from 'next/link';

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="mb-4 text-sm text-slate-400" aria-label="Breadcrumb">
      <ol className="flex items-center gap-2">
        {items.map((it, idx) => (
          <li key={idx} className="inline-flex items-center">
            {it.href ? (
              <Link href={it.href} className="text-slate-400 hover:text-sky-300">
                {it.label}
              </Link>
            ) : (
              <span className="text-slate-500">{it.label}</span>
            )}
            {idx < items.length - 1 && <span className="mx-2 text-slate-600">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export default Breadcrumb;
