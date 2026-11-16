import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B090A',
        truffle: '#161214',
        cocoa: {
          900: '#0B090A',
          800: '#161214',
          700: '#221A18',
          600: '#2E211D',
          500: '#3A2A24',
          400: '#5A3E33',
          300: '#7A5648',
        },
        gold: {
          DEFAULT: '#C59B27',
          light: '#E8C766',
          deep: '#9A7615',
        },
        terracotta: {
          DEFAULT: '#8C4A32',
          light: '#B2674A',
          deep: '#5E2E1F',
        },
        cream: {
          DEFAULT: '#F5F3F0',
          muted: '#C9C3BA',
          dim: '#8C857B',
        },
        latte: { DEFAULT: '#E7D5B8', deep: '#D9C4A3' }, // soft foam neutral for light surfaces
        ember: { DEFAULT: '#D4592A', deep: '#B23E1A' }, // warm slow-burn (Picante / chilli)
      },
      fontFamily: {
        display: ['"Playfair Display"', 'ui-serif', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        floaty: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.55', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.06)' },
        },
        steam: {
          '0%': { opacity: '0', transform: 'translateY(6px) scaleX(1)' },
          '30%': { opacity: '0.7' },
          '100%': { opacity: '0', transform: 'translateY(-46px) scaleX(1.7)' },
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer: 'shimmer 8s ease-in-out infinite',
        floaty: 'floaty 9s ease-in-out infinite',
        marquee: 'marquee 38s linear infinite',
        pulseGlow: 'pulseGlow 5s ease-in-out infinite',
        steam: 'steam 4s ease-out infinite',
        spinSlow: 'spinSlow 36s linear infinite',
      },
    },
  },
  plugins: [],
} satisfies Config
