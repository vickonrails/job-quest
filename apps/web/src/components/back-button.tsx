'use client'
import { ChevronLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type MouseEventHandler } from 'react'
import { Button, type ButtonProps } from 'ui/button'

/**
 *
 */
export default function BackButton({ onClick, children = 'Back', ...rest }: ButtonProps) {
    const router = useRouter()
    const handleOnClick: MouseEventHandler<HTMLButtonElement> = (ev) => {
        if (onClick) {
            onClick(ev)
            return;
        }

        router.back();
    }

    return (
        <Button variant="link" type="button" className="pl-0 p-0 mb-3" onClick={handleOnClick} {...rest}>
            <ChevronLeft />
            {children}
        </Button>
    )
}
