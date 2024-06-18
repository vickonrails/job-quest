export function getFilename(filename: string) {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex !== -1) {
        return filename.substring(0, lastDotIndex);
    }
    return filename;
}