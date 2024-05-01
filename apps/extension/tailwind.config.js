import defaultTheme from 'tailwindcss/defaultTheme'

const config = {
  content: [
    './contents/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './tabs/**/*.{ts,tsx}',
    './popup.tsx',
    '../../packages/ui/src/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        1.5: 'var(--spacing-1_5)',
        2: 'var(--spacing-2)',
        2.5: 'var(--spacing-2_5)',
        3: 'var(--spacing-3)',
        3.5: 'var(--spacing-3_5)',
        4: 'var(--spacing-4)',
        5: 'var(--spacing-5)',
        6: 'var(--spacing-6)',
        10: 'var(--spacing-10)'
      },
      fontSize: {
        // sm: ["var(--text-sm)", "2rem"],
        // base: ["var(--text-base)", "2rem"],
        // lg: ["var(--text-lg)", "1.8rem"]
        xs: 'var(--text-xs)',
        sm: ['var(--text-sm)', '1.25em'],
        base: 'var(--text-base)',
        lg: 'var(--text-lg)',
      },
      maxWidth: {
        sm: 'var(--max-w-sm)',
      },
      boxShadow: {
        outline: 'inset 0 0 0 1px var(--linkedIn)',
        'outline-hover': 'inset 0 0 0 2px var(--linkedIn)'
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        linkedIn: {
          DEFAULT: '#0a66c2',
          hover: 'rgba(112,181,249,0.2)',
        },
        borderRadius: {
          lg: 'var(--radius)',
          md: 'calc(var(--radius) - 2px)',
          sm: 'calc(var(--radius) - 4px)',
        },
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
    }
  }
}

export default config