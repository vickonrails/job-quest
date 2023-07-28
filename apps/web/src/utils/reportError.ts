// TODO: test this function
// TODO: do some kind of report logging here
export function reportError(error: unknown) {
    if (error instanceof Error) {
        // eslint-disable-next-line no-console
        console.error(error.message);
        return error.message;
    }
}