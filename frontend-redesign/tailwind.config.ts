import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#00a854',
          light: '#00e676',
          dark: '#007d3e',
          gradient: 'linear-gradient(45deg, #00a854, #00e676)',
        },
        secondary: {
          DEFAULT: '#1976d2',
          light: '#63a4ff',
          dark: '#004ba0',
          gradient: 'linear-gradient(45deg, #1976d2, #63a4ff)',
        },
        accent: {
          DEFAULT: '#ff4081',
          light: '#ff80ab',
          dark: '#c51162',
        },
        dark: {
          DEFAULT: '#0a1229',
          surface: '#121a35',
          deeper: '#080f1f',
          card: 'rgba(18, 26, 53, 0.9)',
        },
        card: 'rgba(25, 32, 65, 0.8)',
        border: 'rgba(255, 255, 255, 0.08)',
        'border-active': 'rgba(255, 255, 255, 0.15)',
        success: '#00c853',
        warning: '#ffab00',
        error: '#ff1744',
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'SF Pro Display', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'sm': '0 2px 10px rgba(0, 0, 0, 0.15)',
        'DEFAULT': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'lg': '0 8px 30px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(0, 168, 84, 0.4)',
        'glow-blue': '0 0 20px rgba(25, 118, 210, 0.4)',
        'intense': '0 10px 30px -5px rgba(0, 0, 0, 0.3)',
        'inner': 'inset 0 2px 10px rgba(0, 0, 0, 0.15)',
      },
      animation: {
        'pulse': 'pulse 10s ease-in-out infinite',
        'shine': 'shine 15s linear infinite',
        'scroll-down': 'scrollDown 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.2s linear infinite',
        'ping-slow': 'ping 3s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
      keyframes: {
        pulse: {
          '0%, 100%': { opacity: '0.8', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.05)' },
        },
        shine: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        scrollDown: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(10px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'glass-gradient': 'linear-gradient(120deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
        'card-gradient': 'linear-gradient(145deg, rgba(25, 32, 65, 0.8), rgba(18, 26, 53, 0.9))',
      },
    },
  },
  plugins: [],
}

export default config 