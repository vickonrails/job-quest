/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './contents/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        // TODO: convert these to variables
        linkedIn: '#0a66c2',
        'linkedIn-hover': 'rgba(112,181,249,0.2)',
      },
      boxShadow: {
        'btn-border': 'inset 0 0 0 1px #0a66c2',
        'btn-hover': 'inset 0 0 0 2px #0a66c2',
      }
    },
  },
  plugins: [],
}

