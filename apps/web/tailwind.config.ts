import defaultTheme from 'tailwindcss/defaultTheme'

const config = {
  presets: [
    require('ui/tailwind.config')
  ],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx,scss}',
    './src/**/*.{ts,tsx,scss}',
    '../../packages/ui/src/**/*.{ts,tsx}',
    '../../packages/resume-templates/src/**/*.{ts,tsx}'
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: 0 },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: 0 },
        },
        'rotate-spinner': {
          '0%': { boxShadow: '0 0 0 0 currentcolor' },
          '100%': { boxShadow: '0.2em 0px 0 0px currentcolor' },
          '12%': { boxShadow: '0.2em 0.2em 0 0 currentcolor' },
          '25%': { boxShadow: '0 0.2em 0 0px currentcolor' },
          '37%': { boxShadow: '-0.2em 0.2em 0 0 currentcolor' },
          '50%': { boxShadow: '-0.2em 0 0 0 currentcolor' },
          '62%': { boxShadow: '-0.2em - 0.2em 0 0 currentcolor' },
          '75%': { boxShadow: '0px - 0.2em 0 0 currentcolor' },
          '87%': { boxShadow: '0.2em - 0.2em 0 0 currentcolor' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'rotate-spinner': 'rotate-spinner 0.5s infinite linear',
      },
    },
  }
}

export default config