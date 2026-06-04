import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        surface: '#0f172a',
        card: '#111827',
        border: '#1f2937',
        muted: '#94a3b8'
      },
      boxShadow: {
        soft: '0 18px 60px rgba(15, 23, 42, 0.18)'
      }
    }
  },
  plugins: []
};

export default config;
