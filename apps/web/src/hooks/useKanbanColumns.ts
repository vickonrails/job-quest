
import { type InvolvedColumns } from '@components/kanban/core/getInvolvedColumns';
import { type getMovingItemData } from '@components/kanban/core/getMovingItemData';
import { type Database } from '@lib/database.types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { sortByOrder, type KanbanColumn } from '@utils/transform-to-column';
import { useState } from 'react';

export function useKanbanColumns(jobs: KanbanColumn[]) {
    const client = useSupabaseClient<Database>()
    const [columns, setColumns] = useState(jobs);

    const updateMovedItem = async (movingItemData: ReturnType<typeof getMovingItemData>, involvedColumns: NonNullable<InvolvedColumns>) => {
        const { start, finish } = involvedColumns
        const initialColumns = columns
        if (!movingItemData) return

        const { destinationJobs, movingItem: movedItem, sourceJobs } = movingItemData
        const newStartCol = {
            ...start,
            jobs: sourceJobs.sort(sortByOrder)
        }
        if (start.id === finish.id) {
            const newStartColumns = initialColumns.map(col => {
                if (col.id === start.id) return newStartCol
                return col
            })
            setColumns(newStartColumns);
        } else {
            const destinationCol = {
                ...finish,
                jobs: destinationJobs.sort(sortByOrder)
            }
            const newDestinationCols = initialColumns.map(col => {
                if (col.id === start.id) return newStartCol
                if (col.id === finish.id) return destinationCol
                return col
            })

            setColumns(newDestinationCols);
        }

        try {
            await client.from('jobs').update(movedItem).eq('id', movedItem.id);
        } catch (error) {
            // TODO: handle error
        }
    }

    return { columns, setColumns, updateMovedItem }
}