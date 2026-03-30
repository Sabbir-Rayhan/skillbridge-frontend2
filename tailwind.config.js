/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#fff7ed',
          100: '#ffedd5',
          200: '#fed7aa',
          300: '#fdba74',
          400: '#fb923c',
          500: '#f97316',
          600: '#ea580c',
          700: '#c2410c',
          800: '#9a3412',
          900: '#7c2d12',
        },
        ink: {
          DEFAULT: '#0f0a00',
          soft: '#1c1408',
        },
        cream: {
          DEFAULT: '#fdf8f0',
          dark: '#f5ede0',
        },
        accent: {
          lime:   '#c8f135',
          blue:   '#3b82f6',
          violet: '#7c3aed',
          rose:   '#f43f5e',
        }
      },
      animation: {
        'slide-up':   'slideUp 0.5s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'pop':        'pop 0.3s cubic-bezier(0.175,0.885,0.32,1.275) forwards',
        'shimmer':    'shimmer 1.5s infinite',
        'bounce-slow':'bounce 2s infinite',
      },
      keyframes: {
        slideUp:  { from:{ opacity:'0', transform:'translateY(20px)' }, to:{ opacity:'1', transform:'translateY(0)' } },
        fadeIn:   { from:{ opacity:'0' }, to:{ opacity:'1' } },
        pop:      { from:{ transform:'scale(0.9)', opacity:'0' }, to:{ transform:'scale(1)', opacity:'1' } },
        shimmer:  { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
