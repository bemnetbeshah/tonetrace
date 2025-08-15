/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#6C5CE7',
          soft: '#A78BFA',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#F8FAFC',
        },
        text: {
          DEFAULT: '#0F172A',
          muted: '#64748B',
        },
        border: '#E2E8F0',
        sidebar: {
          bg: '#0B1020',
          hover: '#11172B',
        },
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'card': '0 8px 20px rgba(2,6,23,.06)',
      },
      spacing: {
        '0': '0px',
        '4': '4px',
        '8': '8px',
        '12': '12px',
        '16': '16px',
        '20': '20px',
        '24': '24px',
        '28': '28px',
        '32': '32px',
      },
      fontSize: {
        'h1': ['1.5rem', { lineHeight: '2rem', fontWeight: '600' }],
        'h2': ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'h3': ['1.125rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        'body': ['0.875rem', { lineHeight: '1.25rem', color: '#334155' }],
        'muted': ['0.75rem', { lineHeight: '1rem', color: '#64748B' }],
      },
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      },
    },
  },
  plugins: [],
} 