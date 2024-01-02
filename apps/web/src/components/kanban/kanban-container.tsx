import { DragDropContext, type OnDragEndResponder } from '@hello-pangea/dnd';
import KanbanCol from './kanban-column';
import { type KanbanColumn } from '@utils/transform-to-column';
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from '@lib/database.types';
import { type Job } from '@lib/types';

function useKanbanColumns(jobs: KanbanColumn[]) {
    const client = useSupabaseClient<Database>()
    const [columns, setColumns] = useState(jobs);

    const updateColumnItem = async (job: Job) => {
        try {
            await client.from('jobs').upsert(job);
        } catch (error) {
            // TODO: handle error
        }
    }

    return { columns, setColumns, updateColumnItem }
}

export default function JobsKanban({ jobColumns }: { jobColumns: KanbanColumn[] }) {
    const { columns, updateColumnItem, setColumns } = useKanbanColumns(jobColumns);

    const onDragEnd: OnDragEndResponder = (result) => {
        const prevCols = [...columns];
        const { destination, source } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) return;

        // start and end columns
        const start = columns.find(col => col.id === source.droppableId);
        const finish = columns.find(col => col.id === destination.droppableId);

        if (!start || !finish) return;

        // moving within the same column
        // just update the order or position by taking the average of the two nearest jobs
        if (start === finish) {
            const clonedJobs = Array.from(start.jobs);
            const [removedJob] = clonedJobs.splice(source.index, 1);
            if (!removedJob) return;

            clonedJobs.splice(destination.index, 0, removedJob);

            const newColumn = {
                ...start,
                jobs: clonedJobs
            }

            const columns = prevCols.map(col => {
                if (col.id === newColumn.id) return newColumn
                return col
            })

            setColumns(columns)
            // await updateColumnItem(removed);
        }

        // const startTasks = Array.from(start!.tasks);
        // const [removed] = startTasks.splice(source.index, 1);
        // const newStart = {
        //     ...start!,
        //     tasks: startTasks
        // }

        // const finishTasks = Array.from(finish!.tasks);
        // finishTasks.splice(destination.index, 0, removed);
        // const newFinish = {
        //     ...finish!,
        //     tasks: finishTasks
        // }

        // // this is also an optimistic update
        // setKanbanColumns(kanbanColumns.map(col => {
        //     if (col.id === newStart.id) return newStart
        //     if (col.id === newFinish.id) return newFinish
        //     return col
        // }))

        // setSyncing(true)
        // const promises = newFinish.tasks.map(task => {
        //     const index = newFinish.tasks.findIndex(x => x.id === task.id)
        //     return supabase
        //         .from('tasks')
        //         .update({ column_order: index, status: finish?.columnStatus })
        //         .eq('id', task.id)
        //         .then(response => {
        //             if (response.error) throw response.error

        //             return response
        //         })
        // })

        // Promise.all(promises)
        //     .then(() => console.log('done'))
        //     .catch((err) => {
        //         alert('An error just occurred')
        //         setKanbanColumns(prevCols)
        //     })
        //     .finally(() => setSyncing(false))
    }

    return (
        <div className="flex w-full h-full gap-2">
            <DragDropContext onDragEnd={onDragEnd}>
                {columns.map((column) => (
                    <KanbanCol key={column.id} column={column} />
                ))}
            </DragDropContext>
        </div>
    )
}
