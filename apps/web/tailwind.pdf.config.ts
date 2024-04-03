import baseTheme from './tailwind.config'

const config = {
    ...baseTheme,
    content: [
        '../../packages/resume-templates/src/**/*.tsx',
    ],
}

export default config