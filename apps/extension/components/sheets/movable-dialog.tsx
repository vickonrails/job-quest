import type { DialogProps } from '@radix-ui/react-dialog';
import React, { useEffect, useRef } from 'react';
import { Sheet } from './sheet';

/**
 * Hook for moving dialog functionality
 */
export function useMovableDialog() {
    const xOffsetRef = useRef(0);
    const yOffsetRef = useRef(0);
    const isMovingRef = useRef(false);
    const buttonRef = useRef<HTMLButtonElement>()
    const dialogRef = useRef<HTMLDivElement>()

    useEffect(() => {
        const timer = setTimeout(() => {
            window.parent.document.body.style.pointerEvents = 'auto'
        }, 1000)

        return () => {
            clearTimeout(timer)
        }
    }, []);

    useEffect(() => {
        const button = buttonRef.current
        if (!button) return;

        const handleMouseUp = (ev) => {
            if (!isMovingRef.current) return;

            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            isMovingRef.current = false;
        }

        const handleMouseMove = (ev: MouseEvent) => {
            if (!isMovingRef.current) return;

            const dialog = dialogRef.current;
            if (!dialog) return;

            const currentX = ev.clientX - xOffsetRef.current;
            const currentY = ev.clientY - yOffsetRef.current;

            dialog.style.left = `${currentX}px`;
            dialog.style.top = `${currentY}px`;
        }

        const handleMouseDown = (ev: MouseEvent) => {
            const dialog = dialogRef.current;
            if (!dialog) return;

            xOffsetRef.current = ev.clientX - dialog.offsetLeft;
            yOffsetRef.current = ev.clientY - dialog.offsetTop;
            isMovingRef.current = true;

            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        button.addEventListener('mousedown', handleMouseDown)

        return () => {
            button.removeEventListener('mousedown', handleMouseDown)
        }
    }, [buttonRef, dialogRef])

    return { dialogRef, buttonRef }
}

type MovableDialogProps = DialogProps & {
    title?: string | React.ReactNode
}

/**
 * Movable dialog
 */
export const MovableDialog = ({ children, title, onOpenChange, ...rest }: MovableDialogProps) => {
    return (
        <Sheet {...rest}>


            {children}
        </Sheet>
    )
}
