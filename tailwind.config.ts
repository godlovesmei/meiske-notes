import type { Config } from 'tailwindcss'

export default {
  content: [
    './app/components/**/*.{vue,js,ts}',
    './app/layouts/**/*.vue',
    './app/pages/**/*.vue',
    './app/app.vue',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#000000',
        ink: '#fcfdff',
        body: 'rgba(252, 253, 255, 0.86)',
        charcoal: 'rgba(252, 253, 255, 0.7)',
        mute: '#a1a4a5',
        ash: '#888e90',
        stone: '#464a4d',
        card: '#0a0a0c',
        elevated: '#101012',
        deep: '#06060a',
        hairline: 'rgba(255, 255, 255, 0.06)',
        'hairline-strong': 'rgba(255, 255, 255, 0.14)',
        'divider-soft': 'rgba(255, 255, 255, 0.04)',
        link: '#3b9eff',
        'accent-orange': '#ff801f',
        'accent-blue': '#3b9eff',
        'accent-green': '#11ff99',
        'accent-red': '#ff2047',
        primary: '#fcfdff',
        'primary-on': '#000000',
      },
      fontFamily: {
        display: ['Instrument Serif', 'Georgia', 'serif'],
        favorit: ['Inter Tight', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Geist Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        'display-xl': ['4.8rem', { lineHeight: '1', letterSpacing: '-0.768px' }],
        'display-lg': ['3.5rem', { lineHeight: '1.2', letterSpacing: '-2.8px' }],
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
      },
      maxWidth: {
        content: '1200px',
        prose: '720px',
      },
      spacing: {
        section: '96px',
        band: '128px',
      },
    },
  },
  plugins: [],
} satisfies Config
