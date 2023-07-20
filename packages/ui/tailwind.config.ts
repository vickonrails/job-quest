import { type Config } from 'tailwindcss';
import defaultTheme from 'tailwindcss/defaultTheme'
import colors from 'tailwindcss/colors'

export default {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['DM Sans', ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        'crispy': '16px 16px 70px rgba(81, 67, 188, 0.1), -8px -8px 70px rgba(81, 67, 188, 0.1);',
        'light': '0px 1px 2px rgba(16, 24, 40, 0.05)'
      },
      colors: {
        'light-text': '#728292',
        primary: colors.indigo[700],
        'primary-light': colors.indigo[600]
      },
      fontSize: {
        '6xl': '4rem',
        '5xl': '3.1rem',
        '4xl': '2.6rem',
        '3xl': '2.1rem',
        '2xl': '1.5rem',
        'xl': '1.25rem'
      }
    },
  },
  plugins: [],
} satisfies Config;
