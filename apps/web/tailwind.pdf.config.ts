import baseTheme from './tailwind.config'

const config = {
    ...baseTheme,
    content: [
        '../../packages/resume-templates/src/**/*.tsx',
    ],
    safeList: ['highlights-description']
}

export default config