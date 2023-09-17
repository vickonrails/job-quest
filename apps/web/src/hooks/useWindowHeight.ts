import { useEffect, useState } from 'react'

export const useWindowHeight = () => {
    const [height, setHeight] = useState<number>(0)

    const handleResize = () => {
        // Is there a more performant way to get the current window height
        setHeight(window.innerHeight ?? 0)
    }

    useEffect(() => {
        if (typeof window === 'undefined') return
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return height
}