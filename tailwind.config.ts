import { type Config } from "tailwindcss";
import defaultTheme from 'tailwindcss/defaultTheme'

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
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
        'primary': '#683DF5'
      }
    },
  },
  plugins: [],
} satisfies Config;
