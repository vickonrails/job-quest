import baseConfig from 'ui/tailwind.config'

const config = {
  ...baseConfig,
  darkMode: ["class"],
  content: [
    './contents/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        linkedIn: '#0a66c2',
        'linkedIn-hover': 'rgba(112,181,249,0.2)',
      },
    },
  }
}

export default config