export function handleApiError(error: unknown) {
    if (error instanceof Error) {
        return { success: false, error: error.message }
    } else {
        return { success: false, error: 'An error occurred' }
    }
}