
import { type InvolvedColumns } from '@/components/kanban/core/getInvolvedColumns';
import { type getMovingItemData } from '@/components/kanban/core/getMovingItemData';
import { createClient } from '@/utils/supabase/client';
import { sortByOrder, type KanbanColumn } from '@/utils/transform-to-column';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import isEqual from 'fast-deep-equal';
import { type Job } from 'lib/types';
import { useEffect, useRef, useState } from 'react';

export function useKanbanColumns(jobs: KanbanColumn[]) {
    const client = createClient()
    const queryClient = useQueryClient();
    const [columns, setColumns] = useState(jobs);
    const columnRef = useRef(jobs);

    const updateMutation = useMutation({
        mutationFn: async (data: Job) => {
            return await client.from('jobs').update(data).eq('id', data.id)
        },
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ['jobs'] })
    })

    useEffect(() => {
        if (!isEqual(columnRef.current, jobs)) {
            if (updateMutation.isLoading) return
            setColumns(jobs)
            columnRef.current = jobs
        }
    }, [jobs, updateMutation.isLoading])

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
            await updateMutation.mutateAsync(movedItem)
        } catch (error) {
            // TODO: handle error
        } finally {

        }
    }

    return { columns, updateMovedItem, isUpdating: updateMutation.isLoading }
}