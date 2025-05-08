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
        },
        secondary: {
          DEFAULT: '#1976d2',
          light: '#63a4ff',
          dark: '#004ba0',
        },
        accent: '#ff4081',
        dark: {
          DEFAULT: '#0a1229',
          surface: '#121a35',
        },
        card: 'rgba(25, 32, 65, 0.7)',
        border: 'rgba(255, 255, 255, 0.08)',
        success: '#00c853',
        warning: '#ffab00',
        error: '#ff1744',
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'SF Pro Display', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        'sm': '0 2px 8px rgba(0, 0, 0, 0.15)',
        'DEFAULT': '0 4px 20px rgba(0, 0, 0, 0.2)',
        'lg': '0 8px 30px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(0, 168, 84, 0.4)',
      },
      animation: {
        'pulse': 'pulse 10s ease-in-out infinite',
        'shine': 'shine 15s linear infinite',
        'scroll-down': 'scrollDown 2s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.8s ease-out forwards',
        'fade-in': 'fadeIn 0.8s ease-out forwards',
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
      },
    },
  },
  plugins: [],
}

export default config 