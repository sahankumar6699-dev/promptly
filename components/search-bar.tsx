'use client';

import { useMemo, useState } from 'react';
import { searchPrompts } from '@/lib/prompts';
import { PromptCard } from '@/components/prompt-card';
import { Search } from 'lucide-react';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const results = useMemo(() => searchPrompts(query), [query]);

  return (
    <div className="space-y-5">
      <div className="relative rounded-3xl border border-slate-800 bg-slate-900/90 p-4 shadow-sm">
        <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search prompts by category, title, or use case"
          className="w-full rounded-2xl border border-transparent bg-transparent py-4 pl-12 pr-4 text-sm text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-700 focus:ring-2 focus:ring-sky-500/30"
        />
      </div>

      {query ? (
        <div className="space-y-4">
          <p className="text-sm text-slate-400">Showing {results.length} results for “{query}”.</p>
          <div className="grid gap-4">
            {results.slice(0, 4).map((prompt) => (
              <PromptCard key={prompt.id} prompt={prompt} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-sm leading-7 text-slate-400">Search the full prompt collection and preview suggestions instantly.</p>
      )}
    </div>
  );
}
