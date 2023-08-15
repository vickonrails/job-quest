import { type BaseEntity } from '@components/table'
import { useCallback, useState } from 'react'

interface RowDeleteHookProps<T> {
    onDelete: (id: string) => Promise<void>
    refresh?: () => Promise<void>
}

/** 
 * hook to delete a row in a table
 * TODO: can be modified to fit in deleting any entity at all
 */
export function useRowDelete<T extends BaseEntity>(initialProps: RowDeleteHookProps<T>) {
    const [isOpen, setIsOpen] = useState(false)
    const [entity, setEntity] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)

    const handleDelete = useCallback(() => {
        if (!entity) return

        setLoading(true)
        initialProps.onDelete?.(entity?.id).then(async () => {
            await initialProps.refresh?.()
            setIsOpen(false)
        }).catch(err => {
            // 
        }).finally(() => {
            setLoading(false)
        })
    }, [initialProps, entity])

    const showDeleteDialog = useCallback((item: T) => {
        setIsOpen(true);
        setEntity(item)
    }, [])

    const onCancel = useCallback(() => {
        setEntity(null)
        setIsOpen(false)
    }, [])


    return { loading, showDeleteDialog, onCancel, handleDelete, entity, isOpen }
}