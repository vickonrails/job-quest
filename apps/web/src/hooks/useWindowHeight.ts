import { useLayoutEffect, useState } from 'react'

export const useWindowHeight = () => {
    const [height, setHeight] = useState<number>(0)

    const handleResize = () => {
        setHeight(window.innerHeight ?? 0)
    }

    useLayoutEffect(() => {
        if (typeof window === 'undefined') return
        handleResize();

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        }
    }, [])

    return height
}