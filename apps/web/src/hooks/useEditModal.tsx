import { useState } from 'react'


interface RowEditHookProps<T> {
    refresh?: () => Promise<void>
    // onEdit: (item: T) => Promise<void>
}

export function useEditSheet<T>(intitialProps: RowEditHookProps<T>) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedEntity, setSelectedEntity] = useState<T | null>(null)

    const showEditSheet = (item: T) => {
        setIsOpen(true)
        setSelectedEntity(item)
    }

    return { isOpen, showEditSheet, setIsOpen, selectedEntity }
}