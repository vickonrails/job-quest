import { type InvolvedColumns } from '@components/kanban/core';
import { type Database } from '@lib/database.types';
import { type Job } from '@lib/types';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { sortByOrder, type KanbanColumn } from '@utils/transform-to-column';
import { useState } from 'react';

// TODO: make this hook more robust
export function useKanbanColumns(jobs: KanbanColumn[]) {
    const client = useSupabaseClient<Database>()
    const [columns, setColumns] = useState(jobs);

    const updateMovedItem = async (movedItem: Job, sourceJobs: Job[], destinationJobs: Job[], involvedColumns: NonNullable<InvolvedColumns>) => {
        const { start, finish } = involvedColumns
        const initialColumns = columns
        const newStartCol = {
            ...start,
            // TODO: clone this array maybe?
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