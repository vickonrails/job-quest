export function copyObject<T extends Record<string, unknown>>(source: T, excludeArr?: Array<keyof T>): T {
    const newObj: T = {} as T;
    Object.keys(source).map(key => {
        if (excludeArr && excludeArr?.includes(key)) return;
        // TODO: take some time to fix this error
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        newObj[key] = source[key]
    });

    return newObj;
}