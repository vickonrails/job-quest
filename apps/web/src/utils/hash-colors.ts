import { djb2Hash } from '@components/utils'

// TODO: find better variant names
const variants = ['blue', 'purple', 'green', 'gold', 'orange']

const hashColors = (text: string) => {
    const index = djb2Hash(text, variants.length)
    return variants[index]
}

export default hashColors