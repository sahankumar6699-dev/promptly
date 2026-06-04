export async function GET() {
  const lines = [`User-agent: *`, `Allow: /`, `Sitemap: ${process.env.SITE_BASE_URL || 'https://promptly.example.com'}/sitemap.xml`];
  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=3600'
    }
  });
}
