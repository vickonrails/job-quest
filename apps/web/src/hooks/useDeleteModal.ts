import { type BaseEntity } from '@components/table'
import { useToast } from '@components/toast/use-toast'
import { useCallback, useState } from 'react'

interface RowDeleteHookProps {
    onDelete?: (id: string) => Promise<void>
    refresh?: () => Promise<void>
}

/** 
 * hook to delete a row in a table
 * TODO: can be modified to fit in deleting any entity at all
 */
export function useRowDelete<T extends BaseEntity>(initialProps: RowDeleteHookProps) {
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [entity, setEntity] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)

    const handleDelete = useCallback(() => {
        if (!entity) return

        setLoading(true)
        initialProps.onDelete?.(entity?.id).then(async () => {
            await initialProps.refresh?.()
            toast({
                variant: 'success',
                title: 'deleted'
            })
            setIsOpen(false)
        }).catch(err => {
            toast({
                variant: 'destructive',
                title: 'Failed to delete'
            })
        }).finally(() => {
            setLoading(false)
        })
    }, [initialProps, toast, entity])

    const showDeleteDialog = useCallback((item: T) => {
        setIsOpen(true);
        setEntity(item)
    }, [])

    const onCancel = useCallback(() => {
        setEntity(null)
        setIsOpen(false)
    }, [])


    return { loading, showDeleteDialog, setIsOpen, onCancel, handleDelete, entity, isOpen }
}