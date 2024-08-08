import { useEffect, useState } from 'react';

export function useLocalStorageState<T>({ key, defaultValue }: { key: string, defaultValue: T }) {
    const [value, setValue] = useState<T>(() => {
        const item = localStorage.getItem(key)
        try {
            return item ? JSON.parse(item) : defaultValue;
        } catch (error) {
            return defaultValue;
        }
    });

    useEffect(() => {
        if (typeof window === 'undefined') return;
        try {
            localStorage.setItem(key, JSON.stringify(value));
        } catch (error) {
            // console.error(`Error writing to localStorage: ${error}`);
        }
    }, [key, value]);

    return { value, setValue } as const;
}