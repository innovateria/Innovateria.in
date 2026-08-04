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
          50: '#fff5f3',
          100: '#ffe8e4',
          200: '#ffd5cd',
          300: '#ffb5a6',
          400: '#ff846c',
          500: '#ff4e2e', // Innovateria primary red/orange
          600: '#ea3110',
          700: '#c52408',
          800: '#a2210d',
          900: '#862112',
          glow: '#ff6b4a',
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
