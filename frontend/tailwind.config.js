/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFBF7',
          100: '#FAF7F2',
          200: '#F5F0E6',
          300: '#EFE8D8',
        },
        beige: {
          50: '#F3EFE7',
          100: '#E8E1D5',
          200: '#D9CFBE',
          300: '#C4B8A1',
        },
        charcoal: {
          50: '#52524E',
          100: '#40403D',
          200: '#333330',
          300: '#2A2A28',
          400: '#1E1E1C',
        },
        olive: {
          50: '#E8EDE2',
          100: '#C8D3BB',
          200: '#A3B48E',
          300: '#859973',
          400: '#6B7C5E',
          500: '#56644C',
        },
        terracotta: {
          50: '#F4DED4',
          100: '#E7BFAE',
          200: '#D89A82',
          300: '#C9785C',
          400: '#B4593E',
        },
      },
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Sora', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display': ['clamp(3rem, 8vw, 5.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'h1': ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'h2': ['clamp(1.75rem, 4vw, 2.75rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['clamp(1.25rem, 2.5vw, 1.875rem)', { lineHeight: '1.25', letterSpacing: '-0.005em' }],
        'body-lg': ['1.125rem', { lineHeight: '1.65' }],
        'body': ['1rem', { lineHeight: '1.6' }],
        'caption': ['0.8125rem', { lineHeight: '1.5' }],
        'eyebrow': ['0.75rem', { lineHeight: '1.2', letterSpacing: '0.12em' }],
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(42, 42, 40, 0.04), 0 4px 12px rgba(42, 42, 40, 0.04)',
        'soft-lg': '0 2px 4px rgba(42, 42, 40, 0.04), 0 12px 32px rgba(42, 42, 40, 0.06)',
        'soft-xl': '0 4px 8px rgba(42, 42, 40, 0.04), 0 24px 48px rgba(42, 42, 40, 0.08)',
      },
      spacing: {
        '4.5': '1.125rem',
        '5.5': '1.375rem',
        '6.5': '1.625rem',
        '7.5': '1.875rem',
        '8.5': '2.125rem',
        '13': '3.25rem',
        '15': '3.75rem',
        '17': '4.25rem',
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'stagger-in': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.6s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in': 'fade-in 0.8s ease-out both',
        'stagger-in': 'stagger-in 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'scale-in': 'scale-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
      },
    },
  },
  plugins: [],
}
