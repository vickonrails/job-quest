import { type BaseEntity } from '@/components/table'
import { useToast } from '@/components/toast/use-toast'
import { useCallback, useState } from 'react'

interface UseDeleteProps {
    onDelete?: (id: string) => Promise<void>
    refresh?: () => Promise<void>
}

export function useDeleteModal<T extends BaseEntity>(initialProps: UseDeleteProps) {
    const { toast } = useToast()
    const [isOpen, setIsOpen] = useState(false)
    const [entity, setEntity] = useState<T | null>(null)
    const [loading, setLoading] = useState(false)

    const handleDelete = useCallback(async () => {
        if (!entity) return

        setLoading(true)
        try {
            await initialProps.onDelete?.(entity?.id).then(async () => {
                await initialProps.refresh?.()
                toast({
                    variant: 'success',
                    title: 'Deleted successfully'
                })
                setIsOpen(false)
            }).catch((error) => {
                throw error;
            }).finally(() => {
                setLoading(false)
            })
        } catch (error) {
            toast({
                variant: 'destructive',
                title: 'An error occurred'
            })
            throw new Error()
        }
    }, [initialProps, toast, entity])

    const showDeleteDialog = useCallback((item: T) => {
        setIsOpen(true)
        setEntity(item)
    }, [])

    const onCancel = useCallback(() => {
        setEntity(null)
        setIsOpen(false)
    }, [])


    return { loading, showDeleteDialog, setIsOpen, onCancel, handleDelete, entity, isOpen }
}