import { ChevronLeft } from 'react-feather'
import React from 'react'
import { Button, type ButtonProps } from 'ui'

/**
 *
 */
export default function BackButton({ onClick, children = 'Back', ...rest }: ButtonProps) {
    return (
        <Button variant="link" type="button" className="pl-0 p-0 mb-3" onClick={onClick} {...rest}>
            <ChevronLeft />
            {children}
        </Button>
    )
}
