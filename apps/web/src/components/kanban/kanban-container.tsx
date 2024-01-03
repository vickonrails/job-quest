import { DragDropContext, type OnDragEndResponder } from '@hello-pangea/dnd';
import KanbanCol from './kanban-column';
import { sortByOrder, type KanbanColumn, ApplicationStatus } from '@utils/transform-to-column';
import { useState } from 'react';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import { type Database } from '@lib/database.types';
import { type Job } from '@lib/types';

function useKanbanColumns(jobs: KanbanColumn[]) {
    const client = useSupabaseClient<Database>()
    const [columns, setColumns] = useState(jobs);

    const updateColumnItem = async (job: Job) => {
        try {
            await client.from('jobs').update(job).eq('id', job.id);
        } catch (error) {
            // TODO: handle error
        }
    }

    return { columns, setColumns, updateColumnItem }
}

const ORDER_DISTANCE = 0.5;

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

        const start = columns.find(col => col.id === source.droppableId);
        const finish = columns.find(col => col.id === destination.droppableId);

        if (!start || !finish) return;
        if (start === finish) {
            const clonedJobs = Array.from(start.jobs);
            const downwards = destination.index < source.index;
            const movingItem = clonedJobs[source.index];
            if (!movingItem || !movingItem.order_column) return;

            if (destination.index === 0) {
                movingItem.order_column = clonedJobs[0].order_column - ORDER_DISTANCE;
            } else if (destination.index === clonedJobs.length - 1) {
                movingItem.order_column = clonedJobs[clonedJobs.length - 1].order_column + ORDER_DISTANCE;
            } else {
                const beforeItem = clonedJobs[downwards ? destination.index - 1 : destination.index];
                const afterItem = clonedJobs[downwards ? destination.index : destination.index + 1];
                if (!beforeItem?.order_column || !afterItem?.order_column) return;

                const movingItemOrder = (afterItem?.order_column + beforeItem?.order_column) / 2;
                movingItem.order_column = movingItemOrder;
            }

            const newCols = {
                ...start,
                jobs: clonedJobs.sort(sortByOrder)
            }

            const columns = prevCols.map(col => {
                if (col.id === start.id) return newCols
                return col
            })

            setColumns(columns);
            updateColumnItem(movingItem).then(res => {
                // 
            }).catch(err => {
                // 
            });
        } else {
            // first remove the item from the start list
            const sourceJobs = Array.from(start.jobs);
            const destinationJobs = Array.from(finish.jobs);
            const movingItem = sourceJobs.splice(source.index, 1)[0];
            if (!movingItem || movingItem.order_column === null) return;

            movingItem.status = finish.columnStatus;

            //TODO: if there's nothing in the destination list, just add it to the end

            // find the destination in the next list
            if (destination.index === 0) {
                const newItemOrder = destinationJobs[0]?.order_column || 0;
                movingItem.order_column = newItemOrder - ORDER_DISTANCE;
            } else if (destination.index === destinationJobs.length) {
                movingItem.order_column = destinationJobs[destinationJobs.length - 1].order_column + ORDER_DISTANCE;
            } else {
                const beforeItem = destinationJobs[destination.index - 1];
                const afterItem = destinationJobs[destination.index];
                if (!beforeItem?.order_column || afterItem?.order_column == null) return;
                const movingItemOrder = (afterItem?.order_column + beforeItem?.order_column) / 2;
                movingItem.order_column = movingItemOrder;
            }

            destinationJobs.push(movingItem);
            const sourceCol = {
                ...start,
                jobs: sourceJobs.sort(sortByOrder)
            }

            const destinationCol = {
                ...finish,
                jobs: destinationJobs.sort(sortByOrder)
            }

            const columns = prevCols.map(col => {
                if (col.id === start.id) return sourceCol
                if (col.id === finish.id) return destinationCol
                return col
            })

            setColumns(columns);
            updateColumnItem(movingItem).then(res => {
                // 
            }).catch(err => {
                // 
            });
        }
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
