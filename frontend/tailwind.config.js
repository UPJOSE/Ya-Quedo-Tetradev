/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb',
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 1px 2px 0 rgb(16 24 40 / 0.04), 0 1px 3px 0 rgb(16 24 40 / 0.06)',
        'card': '0 1px 3px 0 rgb(16 24 40 / 0.05), 0 4px 12px -2px rgb(16 24 40 / 0.06)',
        'card-hover': '0 4px 8px -2px rgb(16 24 40 / 0.08), 0 12px 32px -4px rgb(16 24 40 / 0.12)',
        'float': '0 8px 24px -6px rgb(16 24 40 / 0.12), 0 20px 48px -12px rgb(16 24 40 / 0.14)',
        'glow': '0 0 0 4px rgb(37 99 235 / 0.08)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'float-y': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-600px 0' },
          '100%': { backgroundPosition: '600px 0' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.5s ease both',
        'scale-in': 'scale-in 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        'float-y': 'float-y 5s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
      },
    },
  },
  plugins: [],
};
