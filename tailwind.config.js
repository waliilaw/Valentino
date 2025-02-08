/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      keyframes: {
        falling: {
          '0%': { 
            transform: 'translateY(0) rotate(0deg)',
            opacity: '0.8'
          },
          '50%': {
            opacity: '0.5'
          },
          '100%': { 
            transform: 'translateY(100vh) rotate(360deg)',
            opacity: '0'
          }
        }
      },
      animation: {
        'falling': 'falling 10s linear infinite'
      }
    },
  },
  plugins: [],
} 