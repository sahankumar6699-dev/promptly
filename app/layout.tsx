import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Promptly — Searchable AI prompt library',
  description: 'Promptly is a modern catalog of high-quality AI prompts organized by business niche, use case, and category.',
  metadataBase: new URL('https://promptly.example.com'),
  openGraph: {
    title: 'Promptly',
    description: 'A fast, modern prompt library for businesses, creators, and teams.',
    type: 'website'
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
