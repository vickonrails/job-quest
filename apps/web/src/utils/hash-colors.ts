import { djb2Hash } from 'shared'

// TODO: find better variant names
const defaultVariants = ['blue', 'purple', 'green', 'gold', 'orange']

const hashColors = (text: string, variants: string[] = defaultVariants) => {
    const index = djb2Hash(text, variants.length)
    return variants[index]
}

export default hashColors