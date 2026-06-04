import { getAllPromptSlugs, getAllCategorySlugs, getAllIndustrySlugs, getAllUseCases, getPromptsByIndustry, getPromptsByUseCase } from '@/lib/prompts';

export async function GET() {
  const baseUrl = process.env.SITE_BASE_URL || 'https://promptly.example.com';
  const prompts = getAllPromptSlugs();
  const categories = getAllCategorySlugs();
  const industries = getAllIndustrySlugs();
  const useCases = getAllUseCases();

  const urls = [
    `${baseUrl}/`,
    ...categories.map((s) => `${baseUrl}/${s}`),
    ...industries.map((s) => `${baseUrl}/industry/${s}`),
    ...useCases.map((s) => `${baseUrl}/use-case/${s}`),
    ...industries.flatMap((slug) => {
      const totalPages = Math.max(1, Math.ceil(getPromptsByIndustry(slug).length / 12));
      return Array.from({ length: totalPages - 1 }, (_, index) => `${baseUrl}/industry/${slug}/page/${index + 2}`);
    }),
    ...useCases.flatMap((slug) => {
      const totalPages = Math.max(1, Math.ceil(getPromptsByUseCase(slug).length / 20));
      return Array.from({ length: totalPages - 1 }, (_, index) => `${baseUrl}/use-case/${slug}/page/${index + 2}`);
    }),
    ...prompts.map((s) => `${baseUrl}/prompts/${s}`)
  ];

  const uniqueUrls = Array.from(new Set(urls));

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    ${uniqueUrls
      .map((url) => `<url><loc>${url}</loc><changefreq>monthly</changefreq><priority>0.6</priority></url>`)
      .join('\n')}
  </urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
