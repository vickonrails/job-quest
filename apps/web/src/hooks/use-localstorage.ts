import { useEffect, useState } from 'react';

export function useLocalStorageState<T>({ key, defaultValue }: { key: string, defaultValue: T }) {
    const [value, setValue] = useState<T>(defaultValue)

    const updateValue = (newValue: T) => {
        setValue(newValue);
        if (typeof window !== 'undefined') {
            localStorage.setItem(key, JSON.stringify(newValue));
        }
    };

    useEffect(() => {
        const storedItem = localStorage.getItem(key);
        if (storedItem) {
            setValue(JSON.parse(storedItem));
        } else {
            localStorage.setItem(key, JSON.stringify(defaultValue));
        }
    }, [key, defaultValue]);

    return { value, setValue: updateValue }
}