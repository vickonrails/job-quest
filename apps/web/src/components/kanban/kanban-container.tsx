import { DragDropContext, type OnDragEndResponder } from '@hello-pangea/dnd';
import { type KanbanColumn } from '@utils/transform-to-column';
import { useKanbanColumns } from 'src/hooks/useKanbanColumns';
import { getInvolvedColumns, getMovingItem } from './core';
import KanbanCol from './kanban-column';

export default function JobsKanban({ jobColumns }: { jobColumns: KanbanColumn[] }) {
    const { columns, updateMovedItem } = useKanbanColumns(jobColumns);

    const onDragEnd: OnDragEndResponder = (result) => {
        const involvedColumns = getInvolvedColumns(columns, result);
        if (!involvedColumns) return;

        const movingItem = getMovingItem(result, involvedColumns);
        if (!movingItem) return;

        updateMovedItem(movingItem.movingItem, movingItem.sourceJobs, movingItem.destinationJobs, involvedColumns).then(res => {
            // handle success state
        }).catch(err => {
            // handle error state
            // reload back to previous state
        });
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