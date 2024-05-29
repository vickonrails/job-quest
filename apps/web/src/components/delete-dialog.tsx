import { type ReactNode } from 'react'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from 'ui/alert-dialog'

type DeleteDialogProps = React.ComponentProps<typeof AlertDialog> & {
    title: string | ReactNode
    description?: string | ReactNode
    onOk?: () => void
    onCancel?: () => void
    isProcessing?: boolean
}

export function DeleteDialog({ open, description, title, onOk, onCancel, isProcessing, ...rest }: DeleteDialogProps) {
    return (
        <AlertDialog open={open} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction disabled={isProcessing} onClick={onOk}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}



