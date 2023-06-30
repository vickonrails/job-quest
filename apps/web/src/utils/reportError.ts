// TODO: test this function
export function reportError(error: unknown) {
    if (error instanceof Error) {
        console.error(error.message);
        return error.message;
    }
}