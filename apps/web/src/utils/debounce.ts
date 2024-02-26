export function debounce<F extends (...args: any[]) => Promise<any>>(
    func: F,
    waitMilliseconds: number
): (...args: Parameters<F>) => Promise<void> {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    return async (...args: Parameters<F>) => {
        // Clear the timeout so we don't run the debounced function immediately
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
        }

        // Return a promise that resolves after the debounce wait time
        return new Promise((resolve) => {
            timeoutId = setTimeout(() => {
                resolve(func(...args));
            }, waitMilliseconds);
        });
    };
}
