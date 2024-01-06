import { DragDropContext, type OnDragEndResponder } from '@hello-pangea/dnd';
import { type KanbanColumn } from '@utils/transform-to-column';
import { useKanbanColumns } from 'src/hooks/useKanbanColumns';
import KanbanCol from './kanban-column';
import { getInvolvedColumns } from './core/getInvolvedColumns';
import { getMovingItemData } from './core/getMovingItemData';

export default function JobsKanban({ jobColumns, onUpdateStart, onUpdateEnd }: { jobColumns: KanbanColumn[], onUpdateStart: () => void, onUpdateEnd: () => void }) {
    const { columns, updateMovedItem } = useKanbanColumns(jobColumns);

    const onDragEnd: OnDragEndResponder = (result) => {
        const involvedColumns = getInvolvedColumns(columns, result);
        if (!involvedColumns) return;
        const movingItemData = getMovingItemData(result, involvedColumns);

        onUpdateStart && onUpdateStart();
        updateMovedItem(movingItemData, involvedColumns).then(res => {
            // handle success state
        }).catch(err => {
            // handle error state
            // reload back to previous state
        }).finally(() => {
            onUpdateEnd && onUpdateEnd();
        });
    }

    return (
        <div className="flex w-full h-full gap-2" data-testid="kanban-container">
            <DragDropContext onDragEnd={onDragEnd}>
                {columns.map((column) => (
                    <KanbanCol key={column.id} column={column} />
                ))}
            </DragDropContext>
        </div>
    )
}