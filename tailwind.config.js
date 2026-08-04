/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe1e3',
          200: '#ffc7ca',
          300: '#ff9da2',
          400: '#ff5c6a',
          500: '#e10a1a', // Exact Innovateria Logo Primary Red
          600: '#c20815',
          700: '#a20611',
          800: '#860812',
          900: '#700c14',
          glow: '#ff3b4c',
        },
        dark: {
          bg: '#0B0F17',
          card: '#131A29',
          border: 'rgba(255, 255, 255, 0.08)',
          hover: '#1B2438',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
