import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        austral: {
          background: '#0B0F17',
          surface100: '#111827',
          surface200: '#1F2937',
          primary: '#2563EB',
          primaryHover: '#1D4ED8',
          accentCyan: '#06B6D4',
          accentGreen: '#10B981',
          textPrimary: '#F9FAFB',
          textMuted: '#9CA3AF',
        },
      },
    },
  },
  plugins: [],
} satisfies Config
